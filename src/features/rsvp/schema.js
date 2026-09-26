import { z } from "zod";

/**
 * Skema validasi input RSVP tamu dari halaman publik.
 */
export const rsvpSchema = z.object({
  invitationId: z.string().min(1, "ID Undangan wajib ada"),
  name: z.string().min(2, "Nama Anda minimal 2 karakter").max(50, "Nama maksimal 50 karakter"),
  attendance: z.enum(["YES", "NO", "MAYBE"], {
    errorMap: () => ({ message: "Silakan pilih konfirmasi kehadiran" }),
  }),
  pax: z
    .preprocess(
      (val) => parseInt(val, 10),
      z.number().min(1, "Jumlah tamu minimal 1").max(10, "Jumlah tamu maksimal 10")
    )
    .default(1),
  message: z.string().max(500, "Ucapan maksimal 500 karakter").optional().nullable(),
  guestId: z.string().optional().nullable(),
});
