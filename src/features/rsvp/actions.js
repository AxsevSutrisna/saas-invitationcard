"use server";

import { revalidatePath } from "next/cache";
import { createPublicRsvp } from "@/features/rsvp/repository";
import { rsvpSchema } from "@/features/rsvp/schema";

/**
 * Server Action - Memproses konfirmasi kehadiran (RSVP) tamu dari halaman publik
 */
export async function submitRsvpAction(payload) {
  try {
    const validatedData = rsvpSchema.parse(payload);

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
