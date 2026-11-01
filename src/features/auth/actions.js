"use server";

import {
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/features/auth/schema";
import {
  registerUser,
  requestPasswordReset,
  resetPassword,
} from "@/features/auth/service";

/**
 * Server Action: Registrasi pengguna baru.
 * Menggantikan endpoint POST /api/v1/auth/register.
 */
export async function registerAction(payload) {
  try {
    const parsed = registerSchema.safeParse(payload);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors?.[0]?.message || "Data registrasi tidak valid.",
      };
    }

    const result = await registerUser(parsed.data);
    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, data: result.user };
  } catch (error) {
    console.error("Error registerAction:", error);
    return { success: false, error: "Terjadi kesalahan pada server. Silakan coba lagi." };
  }
}

/**
 * Server Action: Meminta tautan reset password dikirim ke email.
 * Selalu mengembalikan pesan generik (anti-enumeration).
 */
export async function requestPasswordResetAction(payload) {
  try {
    const parsed = forgotPasswordSchema.safeParse(payload);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors?.[0]?.message || "Email tidak valid.",
      };
    }

    await requestPasswordReset(parsed.data.email);

    return {
      success: true,
      message:
        "Jika email terdaftar, kami telah mengirim tautan untuk mengatur ulang kata sandi. Silakan cek kotak masuk (dan folder spam).",
    };
  } catch (error) {
    console.error("Error requestPasswordResetAction:", error);
    return { success: false, error: "Terjadi kesalahan pada server. Silakan coba lagi." };
  }
}

/**
 * Server Action: Menyetel kata sandi baru berdasarkan token yang valid.
 */
export async function resetPasswordAction(payload) {
  try {
    const parsed = resetPasswordSchema.safeParse(payload);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors?.[0]?.message || "Data tidak valid.",
      };
    }

    const result = await resetPassword(parsed.data.token, parsed.data.password);
    if (!result.success) {
      return { success: false, error: result.error };
    }

    return {
      success: true,
      message: "Kata sandi berhasil diperbarui. Silakan masuk dengan kata sandi baru Anda.",
    };
  } catch (error) {
    console.error("Error resetPasswordAction:", error);
    return { success: false, error: "Terjadi kesalahan pada server. Silakan coba lagi." };
  }
}
