/**
 * Constants - User Roles
 * Definisi seluruh role pengguna dalam sistem.
 * Gunakan konstanta ini untuk pengecekan role, bukan string literal.
 */
export const ROLES = {
  USER: "USER",           // Calon pengantin / pengguna biasa
  AGENCY: "AGENCY",       // Wedding Organizer / Studio Foto
  ADMIN: "ADMIN",         // Admin platform
  SUPER_ADMIN: "SUPER_ADMIN", // Akses penuh ke CMS
};

/**
 * Hirarki role (semakin tinggi index = semakin tinggi akses)
 */
export const ROLE_HIERARCHY = [
  ROLES.USER,
  ROLES.AGENCY,
  ROLES.ADMIN,
  ROLES.SUPER_ADMIN,
];

/**
 * Cek apakah role memiliki akses minimal tertentu
 * @param {string} userRole - Role pengguna saat ini
 * @param {string} requiredRole - Role minimum yang dibutuhkan
 * @returns {boolean}
 */
export function hasRole(userRole, requiredRole) {
  return (
    ROLE_HIERARCHY.indexOf(userRole) >= ROLE_HIERARCHY.indexOf(requiredRole)
  );
}
