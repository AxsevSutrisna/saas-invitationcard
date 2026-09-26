import { z } from "zod";

/**
 * Skema validasi tamu (tambah satuan).
 */
export const guestSchema = z.object({
  invitationId: z.string().min(1, "ID Undangan wajib ada"),
  name: z.string().min(2, "Nama tamu minimal 2 karakter").max(50, "Nama maksimal 50 karakter"),
  whatsapp: z.string().optional().nullable(),
});

/**
 * Skema update tamu: sama seperti guestSchema tanpa invitationId.
 */
export const updateGuestSchema = guestSchema.omit({ invitationId: true });

/**
 * Skema tambah tamu massal dari teks (satu tamu per baris).
 */
export const bulkGuestSchema = z.object({
  invitationId: z.string().min(1, "ID Undangan wajib ada"),
  rawNames: z.string().min(1, "Daftar Tamu Undangan wajib diisi"),
});
