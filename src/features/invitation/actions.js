"use server";

import { revalidatePath } from "next/cache";
import { invitationFormSchema } from "@/features/invitation/schema";
import {
  createInvitation,
  updateInvitation,
  deleteInvitation,
  checkSlugAvailability,
  getInvitationOwner,
  getInvitationMediaUrls,
} from "@/features/invitation/repository";
import { db } from "@/lib/db";
import { deleteObjectsByUrls } from "@/lib/r2";
import { findActiveSubscriptionByUserId } from "@/features/subscription/repository";
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

    // Cek Akses Tema Premium (Security Check)
    const selectedTheme = await db.theme.findUnique({
      where: { id: validatedData.themeId },
    });

    if (selectedTheme?.isPremium) {
      const activeSub = await findActiveSubscriptionByUserId(user.id);
      if (!activeSub) {
        return {
          success: false,
          error: "Tema yang Anda pilih adalah Tema Premium. Silakan upgrade akun Anda ke Premium terlebih dahulu di menu Langganan.",
        };
      }
    }

    // Eksekusi Simpan di PostgreSQL
    const newInvitation = await createInvitation(user.id, validatedData);

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

    // Otorisasi: hanya pemilik undangan yang boleh mengedit.
    const owner = await getInvitationOwner(invitationId);
    const user = await authorize("invitation:update", owner);

    // Simpan URL media LAMA sebelum diperbarui (untuk pembersihan objek yatim).
    const oldMedia = await getInvitationMediaUrls(invitationId);

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

    // Cek Akses Tema Premium (Security Check) — sama seperti saat membuat.
    const selectedTheme = await db.theme.findUnique({
      where: { id: validatedData.themeId },
    });
    if (selectedTheme?.isPremium) {
      const activeSub = await findActiveSubscriptionByUserId(user.id);
      if (!activeSub) {
        return {
          success: false,
          error:
            "Tema yang Anda pilih adalah Tema Premium. Silakan upgrade akun Anda ke Premium terlebih dahulu di menu Langganan.",
        };
      }
    }

    const updated = await updateInvitation(invitationId, user.id, validatedData);

    // Bersihkan objek R2 yang tak lagi dipakai (media lama yang dihapus/diganti).
    // Best-effort & aman: deleteObjectsByUrls mengabaikan URL non-R2 (Unsplash,
    // dsb) dan hanya menghapus key ber-prefix `invitations/{userId}/`, sehingga
    // berkas template milik bersama tidak akan terhapus.
    const oldUrls = collectMediaUrls(oldMedia);
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
    // Otorisasi: hanya pemilik undangan yang boleh menghapus.
    const owner = await getInvitationOwner(invitationId);
    const user = await authorize("invitation:delete", owner);

    // Kumpulkan seluruh URL media R2 milik undangan SEBELUM dihapus dari DB.
    // (Ownership sudah dijamin oleh authorize di atas; relasi ikut terhapus via
    // cascade DB.)
    const media = await getInvitationMediaUrls(invitationId);

    await deleteInvitation(invitationId, user.id);

    // Bersihkan objek R2 setelah DB sukses — best-effort (tak menggagalkan
    // operasi), hanya key milik user & URL non-R2 diabaikan otomatis.
    await deleteObjectsByUrls(collectMediaUrls(media), { userId: user.id });

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
