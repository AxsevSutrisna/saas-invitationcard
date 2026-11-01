"use server";

import { revalidatePath } from "next/cache";
import { invitationFormSchema } from "@/features/invitation/schema";
import {
  createInvitation,
  updateInvitation,
  deleteInvitation,
  checkSlugAvailability,
  getInvitationOwnerWithMedia,
} from "@/features/invitation/repository";
import { db } from "@/lib/db";
import { deleteObjectsByUrls } from "@/lib/r2";
import { incrementSubscriptionQuota } from "@/features/subscription/repository";
import {
  getGrantableFeaturesForUser,
  checkInvitationQuota,
  mintEntitlementFromSubscription,
} from "@/features/entitlement/service";
import { hasFeature } from "@/features/entitlement/featureMap";
import { FEATURE_KEYS } from "@/features/entitlement/constants";
import { authorize } from "@/features/auth/guard";

/**
 * Ratakan seluruh URL media dari objek undangan (baik hasil query DB maupun
 * payload form) menjadi satu array datar (tanpa nilai kosong).
 */
function collectMediaUrls(media) {
  if (!media) return [];
  return [
    media.coverUrl,
    media.groomPhotoUrl,
    media.bridePhotoUrl,
    media.musicUrl,
    ...(media.galleries?.flatMap((g) => [g.mediaUrl, g.thumbnailUrl]) ?? []),
    ...(media.loveStories?.map((s) => s.imageUrl) ?? []),
    ...(media.gifts?.map((g) => g.qrCodeUrl) ?? []),
  ].filter(Boolean);
}

/**
 * Cek akses tema premium (dipakai bersama create & update): tema ber-flag
 * `isPremium` butuh fitur PREMIUM_THEME pada peta fitur user.
 * @returns {Promise<string|null>} pesan error bila ditolak, null bila boleh.
 */
async function checkPremiumThemeAccess(themeId, grantableFeatures) {
  const selectedTheme = await db.theme.findUnique({
    where: { id: themeId },
    select: { isPremium: true },
  });
  if (selectedTheme?.isPremium && !hasFeature(grantableFeatures, FEATURE_KEYS.PREMIUM_THEME)) {
    return "Tema yang Anda pilih adalah Tema Premium. Silakan upgrade paket Anda terlebih dahulu di menu Langganan.";
  }
  return null;
}

/**
 * Action: Memproses Pembuatan Undangan Baru
 */
export async function createInvitationAction(payload) {
  try {
    const user = await authorize("invitation:create");

    // Validasi Zod
    const validatedData = invitationFormSchema.parse(payload);

    // Cek keunikan slug
    const isSlugFree = await checkSlugAvailability(validatedData.slug);
    if (!isSlugFree) {
      return {
        success: false,
        error: `Alamat URL "${validatedData.slug}" sudah digunakan. Silakan gunakan slug lain.`,
      };
    }

    // Resolusi fitur yang bisa diberikan ke user + langganan aktifnya (satu baca).
    const { map: grantableFeatures, subscription } =
      await getGrantableFeaturesForUser(user.id);

    // Cek Akses Tema Premium (Security Check) — berbasis feature flag.
    const premiumError = await checkPremiumThemeAccess(validatedData.themeId, grantableFeatures);
    if (premiumError) {
      return { success: false, error: premiumError };
    }

    // Penegakan kuota pembuatan undangan (MAX_INVITATIONS).
    const quota = await checkInvitationQuota(user.id, grantableFeatures);
    if (!quota.allowed) {
      const limitLabel = quota.limit === Infinity ? "∞" : quota.limit;
      return {
        success: false,
        error: `Kuota undangan Anda sudah penuh (${quota.used}/${limitLabel}). Silakan upgrade paket untuk membuat undangan baru.`,
      };
    }

    // Eksekusi Simpan di PostgreSQL
    const newInvitation = await createInvitation(user.id, validatedData);

    // Bila dibuat di bawah langganan aktif: ikat hak akses ke undangan ini
    // (entitlement per-undangan) & catat pemakaian kuota. Best-effort — kegagalan
    // di sini tidak membatalkan undangan yang sudah tersimpan.
    if (subscription) {
      try {
        await mintEntitlementFromSubscription({
          invitationId: newInvitation.id,
          userId: user.id,
          subscription,
          featuresSnapshot: grantableFeatures,
        });
        await incrementSubscriptionQuota(subscription.id);
      } catch (e) {
        console.error("Gagal mencatat entitlement/kuota untuk undangan baru:", e);
      }
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        id: newInvitation.id,
        slug: newInvitation.slug,
      },
    };
  } catch (error) {
    console.error("Error createInvitationAction:", error);
    return {
      success: false,
      error: error.message || "Gagal membuat undangan. Silakan coba lagi.",
    };
  }
}

/**
 * Action: Memperbarui Undangan (Edit)
 */
export async function updateInvitationAction(invitationId, payload) {
  try {
    // Validasi Zod
    const validatedData = invitationFormSchema.parse(payload);

    // Satu baca: pemilik (untuk otorisasi) + URL media LAMA (untuk pembersihan
    // objek R2 yatim). Menggantikan dua baca terpisah atas baris yang sama.
    const existing = await getInvitationOwnerWithMedia(invitationId);
    const user = await authorize("invitation:update", existing);

    // Cek keunikan slug — izinkan slug yang sama bila masih milik undangan ini.
    const slugOwner = await db.invitation.findUnique({
      where: { slug: validatedData.slug },
      select: { id: true },
    });
    if (slugOwner && slugOwner.id !== invitationId) {
      return {
        success: false,
        error: `Alamat URL "${validatedData.slug}" sudah digunakan. Silakan gunakan slug lain.`,
      };
    }

    // Cek Akses Tema Premium (Security Check) — berbasis feature flag.
    const { map: grantableFeatures } = await getGrantableFeaturesForUser(user.id);
    const premiumError = await checkPremiumThemeAccess(validatedData.themeId, grantableFeatures);
    if (premiumError) {
      return { success: false, error: premiumError };
    }

    const updated = await updateInvitation(invitationId, user.id, validatedData);

    // Bersihkan objek R2 yang tak lagi dipakai (media lama yang dihapus/diganti).
    // Best-effort & aman: deleteObjectsByUrls mengabaikan URL non-R2 (Unsplash,
    // dsb) dan hanya menghapus key ber-prefix `invitations/{userId}/`, sehingga
    // berkas template milik bersama tidak akan terhapus.
    const oldUrls = collectMediaUrls(existing);
    const newUrls = new Set(collectMediaUrls(validatedData));
    const orphanedUrls = oldUrls.filter((url) => !newUrls.has(url));
    if (orphanedUrls.length > 0) {
      await deleteObjectsByUrls(orphanedUrls, { userId: user.id });
    }

    revalidatePath("/dashboard");
    revalidatePath(`/${updated.slug}`);

    return {
      success: true,
      data: { id: updated.id, slug: updated.slug },
    };
  } catch (error) {
    console.error("Error updateInvitationAction:", error);
    return {
      success: false,
      error: error.message || "Gagal memperbarui undangan. Silakan coba lagi.",
    };
  }
}

/**
 * Action: Menghapus Undangan
 */
export async function deleteInvitationAction(invitationId) {
  try {
    // Satu baca: pemilik (untuk otorisasi) + seluruh URL media R2 milik undangan
    // SEBELUM dihapus dari DB. (Relasi anak ikut terhapus via cascade DB.)
    const existing = await getInvitationOwnerWithMedia(invitationId);
    const user = await authorize("invitation:delete", existing);

    await deleteInvitation(invitationId, user.id);

    // Bersihkan objek R2 setelah DB sukses — best-effort (tak menggagalkan
    // operasi), hanya key milik user & URL non-R2 diabaikan otomatis.
    await deleteObjectsByUrls(collectMediaUrls(existing), { userId: user.id });

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error deleteInvitationAction:", error);
    return {
      success: false,
      error: "Gagal menghapus undangan. Silakan coba lagi.",
    };
  }
}
