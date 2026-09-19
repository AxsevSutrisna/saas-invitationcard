import "server-only";
import { auth } from "@/lib/auth";

/**
 * Auth Guards - Pemeriksaan otorisasi terpusat untuk Server Actions & Route Handlers.
 * Dipakai ulang oleh controller lintas modul (mis. admin) agar aturan akses konsisten.
 */

/**
 * Memastikan ada sesi login yang valid.
 * @returns {Promise<import("next-auth").Session["user"]>} User pada sesi aktif
 * @throws {Error} Jika belum login
 */
export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Sesi telah berakhir. Silakan login kembali.");
  }
  return session.user;
}

/**
 * Memastikan pengguna aktif memiliki peran SUPER_ADMIN.
 * @returns {Promise<import("next-auth").Session["user"]>} User Super Admin
 * @throws {Error} Jika bukan Super Admin
 */
export async function requireSuperAdmin() {
  const user = await requireSession();
  if (user.role !== "SUPER_ADMIN") {
    throw new Error("Akses ditolak. Anda tidak memiliki wewenang Super Admin.");
  }
  return user;
}
