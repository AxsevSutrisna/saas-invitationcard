import "server-only";
import { auth } from "@/lib/auth";
import { isSuperAdmin } from "@/constants/roles";
import { can } from "@/lib/ability";

/**
 * Auth Guards - Pemeriksaan otorisasi terpusat untuk Server Actions & Route Handlers.
 * Lapisan PENEGAKAN (melempar error / menghentikan eksekusi) di sisi server.
 * Logika keputusannya sendiri ada di `@/lib/ability` (murni & isomorphic).
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
 * Penegak ability generik: pastikan user aktif boleh melakukan `action`
 * pada `resource`. Bungkus tipis di atas `can()` agar Server Action cukup
 * memanggil satu baris untuk mendapatkan user sekaligus menegakkan akses.
 * @param {string} action - format "<resource>:<verb>", mis. "guest:update"
 * @param {*} [resource] - objek target untuk cek kepemilikan (opsional)
 * @returns {Promise<import("next-auth").Session["user"]>} User pada sesi aktif
 * @throws {Error} Jika belum login atau tidak berwenang
 */
export async function authorize(action, resource) {
  const user = await requireSession();
  if (!can(user, action, resource)) {
    throw new Error(
      "Akses ditolak. Anda tidak memiliki wewenang untuk tindakan ini."
    );
  }
  return user;
}

/**
 * Memastikan pengguna aktif memiliki peran SUPER_ADMIN.
 * @returns {Promise<import("next-auth").Session["user"]>} User Super Admin
 * @throws {Error} Jika bukan Super Admin
 */
export async function requireSuperAdmin() {
  const user = await requireSession();
  if (!isSuperAdmin(user.role)) {
    throw new Error("Akses ditolak. Anda tidak memiliki wewenang Super Admin.");
  }
  return user;
}
