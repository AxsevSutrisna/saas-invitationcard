"use server";

import { registerSchema } from "@/features/auth/schema";
import { registerUser } from "@/features/auth/service";

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
