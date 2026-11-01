import "server-only";
import { db } from "@/lib/db";

/**
 * Akses data untuk modul Profil (Pengaturan Akun).
 * Semua fungsi beroperasi berdasarkan `id` pengguna (bukan email) agar aman
 * dipakai dari sesi yang sedang login.
 */

/** Ambil profil lengkap (termasuk hash password untuk penentuan metode masuk). */
export function getUserProfile(id) {
  return db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      password: true,
    },
  });
}

/** Perbarui nama tampilan pengguna. */
export function updateUserName(id, name) {
  return db.user.update({
    where: { id },
    data: { name },
    select: { id: true, name: true },
  });
}

/** Ambil HANYA hash password (verifikasi kata sandi saat ini). */
export function getUserPasswordHash(id) {
  return db.user.findUnique({ where: { id }, select: { password: true } });
}

/** Setel hash password baru. */
export function updateUserPasswordById(id, hashedPassword) {
  return db.user.update({ where: { id }, data: { password: hashedPassword } });
}
