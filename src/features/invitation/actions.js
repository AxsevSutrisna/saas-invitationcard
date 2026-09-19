"use server";

import { revalidatePath } from "next/cache";
import { invitationFormSchema } from "@/features/invitation/schema";
import {
  createInvitation,
  deleteInvitation,
  checkSlugAvailability,
} from "@/features/invitation/repository";
import { db } from "@/lib/db";
import { deleteObjectsByUrls } from "@/lib/r2";
import { findActiveSubscriptionByUserId } from "@/features/subscription/repository";
import { requireSession } from "@/features/auth/guard";

/**
 * Action: Memproses Pembuatan Undangan Baru
 */
export async function createInvitationAction(payload) {
  try {
    const user = await requireSession();

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
 * Action: Menghapus Undangan
 */
export async function deleteInvitationAction(invitationId) {
  try {
    const user = await requireSession();

    // Kumpulkan seluruh URL media R2 milik undangan SEBELUM dihapus dari DB
    // (dibatasi ke pemilik agar aman). Relasi lain ikut terhapus via cascade DB.
    const media = await db.invitation.findFirst({
      where: { id: invitationId, userId: user.id },
      select: {
        coverUrl: true,
        groomPhotoUrl: true,
        bridePhotoUrl: true,
        musicUrl: true,
        galleries: { select: { mediaUrl: true, thumbnailUrl: true } },
        loveStories: { select: { imageUrl: true } },
      },
    });

    await deleteInvitation(invitationId, user.id);

    // Bersihkan objek R2 setelah DB sukses — best-effort (tak menggagalkan operasi).
    if (media) {
      const urls = [
        media.coverUrl,
        media.groomPhotoUrl,
        media.bridePhotoUrl,
        media.musicUrl,
        ...media.galleries.flatMap((g) => [g.mediaUrl, g.thumbnailUrl]),
        ...media.loveStories.map((s) => s.imageUrl),
      ];
      await deleteObjectsByUrls(urls, { userId: user.id });
    }

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
