"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/features/auth/guard";
import { updateProfileSchema, changePasswordSchema } from "@/features/profile/schema";
import { updateProfile, changePassword } from "@/features/profile/service";

/**
 * Server Action: perbarui profil (nama) pengguna yang sedang login.
 * Identitas diambil dari sesi server — payload client TIDAK pernah menentukan
 * user mana yang diubah.
 */
export async function updateProfileAction(payload) {
  try {
    const user = await requireSession();

    const parsed = updateProfileSchema.safeParse(payload);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors?.[0]?.message || "Data profil tidak valid.",
      };
    }

    const result = await updateProfile(user.id, parsed.data);
    if (!result.success) return result;

    // Segarkan halaman pengaturan + layout dashboard (header/sidebar membaca
    // nama pengguna terbaru dari DB).
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard", "layout");

    return { success: true, data: result.user, message: "Profil berhasil diperbarui." };
  } catch (error) {
    console.error("Error updateProfileAction:", error);
    return { success: false, error: error.message || "Terjadi kesalahan pada server." };
  }
}

/**
 * Server Action: ganti kata sandi pengguna yang sedang login.
 */
export async function changePasswordAction(payload) {
  try {
    const user = await requireSession();

    const parsed = changePasswordSchema.safeParse(payload);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors?.[0]?.message || "Data kata sandi tidak valid.",
      };
    }

    const result = await changePassword(user.id, parsed.data);
    if (!result.success) return result;

    return { success: true, message: "Kata sandi berhasil diperbarui." };
  } catch (error) {
    console.error("Error changePasswordAction:", error);
    return { success: false, error: error.message || "Terjadi kesalahan pada server." };
  }
}
