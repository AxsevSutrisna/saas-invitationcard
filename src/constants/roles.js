/**
 * Constants - User Roles
 * Sumber kebenaran (SSOT) untuk nilai peran di level aplikasi.
 *
 * PENTING: Nilai di sini WAJIB cocok persis dengan `enum Role` pada
 * prisma/schema.prisma. Jika salah satu berubah, ubah keduanya.
 *
 * File ini murni (isomorphic) — aman di-import dari Server Component,
 * Client Component, maupun Server Action. Jangan menaruh logika
 * penegakan akses (yang melempar/redirect) di sini; itu tugas
 * `@/features/auth/guard` (server-only).
 */
export const ROLES = {
  USER: "USER", // Calon pengantin / pengguna biasa
  AGENCY: "AGENCY", // Wedding Organizer / Studio Foto (peran lateral, fitur berbeda)
  ADMIN: "ADMIN", // Admin platform
  SUPER_ADMIN: "SUPER_ADMIN", // Akses penuh ke CMS
};

/** Daftar seluruh nilai role yang valid (untuk dropdown, validasi, dsb). */
export const ROLE_VALUES = Object.values(ROLES);

/**
 * Predikat murni: apakah `role` sama persis dengan `target`.
 * Sengaja TIDAK memakai hirarki index — peran seperti AGENCY bersifat
 * lateral (bukan superset USER), jadi pencocokan eksplisit lebih aman
 * dari kebocoran akses.
 * @param {string | undefined | null} role
 * @param {string} target
 * @returns {boolean}
 */
export function isRole(role, target) {
  return role === target;
}

/**
 * Apakah role adalah SUPER_ADMIN.
 * @param {string | undefined | null} role
 * @returns {boolean}
 */
export function isSuperAdmin(role) {
  return role === ROLES.SUPER_ADMIN;
}
