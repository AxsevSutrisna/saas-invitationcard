import { z } from "zod";

/**
 * Validation Layer - Auth
 * Seluruh schema validasi Zod terkait proses autentikasi.
 */

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Nama wajib diisi." })
    .min(2, "Nama minimal 2 karakter."),
  email: z
    .string({ required_error: "Email wajib diisi." })
    .email("Format email tidak valid."),
  password: z
    .string({ required_error: "Password wajib diisi." })
    .min(8, "Password minimal 8 karakter."),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email wajib diisi." })
    .email("Format email tidak valid."),
  password: z
    .string({ required_error: "Password wajib diisi." })
    .min(1, "Password wajib diisi."),
});
