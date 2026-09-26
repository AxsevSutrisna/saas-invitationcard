"use server";

import { revalidatePath } from "next/cache";
import { createPublicRsvp } from "@/features/rsvp/repository";
import { rsvpSchema } from "@/features/rsvp/schema";
import { getInvitationPublishStatus } from "@/features/invitation/repository";

/**
 * Server Action - Memproses konfirmasi kehadiran (RSVP) tamu dari halaman publik
 */
export async function submitRsvpAction(payload) {
  try {
    const validatedData = rsvpSchema.parse(payload);

    // Integritas: pastikan undangan tujuan ada & sudah dipublikasikan
    // (cegah spam RSVP ke ID sembarang / undangan yang masih draft).
    const invitation = await getInvitationPublishStatus(validatedData.invitationId);
    if (!invitation || !invitation.isPublished) {
      return {
        success: false,
        error: "Undangan tidak ditemukan atau belum dipublikasikan.",
      };
    }

    const newRsvp = await createPublicRsvp(validatedData);

    // Refresh cache halaman publik agar daftar ucapan langsung ter-update
    revalidatePath("/[slug]", "layout");

    return {
      success: true,
      data: newRsvp,
    };
  } catch (error) {
    console.error("Error submitRsvpAction:", error);
    return {
      success: false,
      error: error.errors?.[0]?.message || error.message || "Gagal mengirim konfirmasi RSVP.",
    };
  }
}
