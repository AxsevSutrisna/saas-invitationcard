import "server-only";
import bcrypt from "bcryptjs";
import {
  getUserPasswordHash,
  updateUserName,
  updateUserPasswordById,
} from "@/features/profile/repository";

/**
 * Logika bisnis modul Profil. Dipisah dari server action agar mudah diuji
 * dan dipakai ulang. Tidak menyentuh request/response (murni data).
 */

/** Perbarui nama tampilan. */
export async function updateProfile(userId, { name }) {
  const user = await updateUserName(userId, name);
  return { success: true, user };
}

/**
 * Ganti kata sandi: verifikasi kata sandi lama dulu, lalu simpan hash baru.
 * Akun Google-only (tanpa password) diarahkan memakai alur "lupa kata sandi".
 */
export async function changePassword(userId, { currentPassword, newPassword }) {
  const row = await getUserPasswordHash(userId);

  if (!row?.password) {
    return {
      success: false,
      error:
        "Akun ini masuk melalui Google dan belum memiliki kata sandi. Gunakan 'Lupa kata sandi' pada halaman masuk untuk menyetelnya.",
    };
  }

  const isCurrentValid = await bcrypt.compare(currentPassword, row.password);
  if (!isCurrentValid) {
    return { success: false, error: "Kata sandi saat ini salah." };
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  await updateUserPasswordById(userId, hashed);
  return { success: true };
}
