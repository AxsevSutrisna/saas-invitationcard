"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createPublicRsvp } from "@/server/repositories/rsvp.repository";

// Skema validasi input RSVP tamu
const rsvpSchema = z.object({
  invitationId: z.string().min(1, "ID Undangan wajib ada"),
  name: z.string().min(2, "Nama Anda minimal 2 karakter").max(50, "Nama maksimal 50 karakter"),
  attendance: z.enum(["YES", "NO", "MAYBE"], {
    errorMap: () => ({ message: "Silakan pilih konfirmasi kehadiran" }),
  }),
  pax: z.preprocess(
    (val) => parseInt(val, 10),
    z.number().min(1, "Jumlah tamu minimal 1").max(10, "Jumlah tamu maksimal 10")
  ).default(1),
  message: z.string().max(500, "Ucapan maksimal 500 karakter").optional().nullable(),
  guestId: z.string().optional().nullable(),
});

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
