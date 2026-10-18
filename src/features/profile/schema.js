import { z } from "zod";

/**
 * Skema profil pengguna (Pengaturan Akun).
 * Dipakai oleh server action untuk memvalidasi payload dari form client.
 */
export const updateProfileSchema = z.object({
  name: z
    .string({ required_error: "Nama wajib diisi." })
    .trim()
    .min(2, "Nama minimal 2 karakter.")
    .max(80, "Nama maksimal 80 karakter."),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: "Kata sandi saat ini wajib diisi." })
      .min(1, "Kata sandi saat ini wajib diisi."),
    newPassword: z
      .string({ required_error: "Kata sandi baru wajib diisi." })
      .min(8, "Kata sandi baru minimal 8 karakter."),
  })
  .refine((d) => d.newPassword !== d.currentPassword, {
    message: "Kata sandi baru harus berbeda dari kata sandi lama.",
    path: ["newPassword"],
  });
