import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .min(2, "Name must be at least 2 characters."),
  email: z
    .string({ required_error: "Email is required." })
    .email("Invalid email address format."),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, "Password must be at least 8 characters."),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email("Invalid email address format."),
  password: z
    .string({ required_error: "Password is required." })
    .min(1, "Password is required."),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email wajib diisi." })
    .email("Format email tidak valid."),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token tidak valid."),
  password: z
    .string({ required_error: "Kata sandi wajib diisi." })
    .min(8, "Kata sandi minimal 8 karakter."),
});
