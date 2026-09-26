/**
 * Ability - Mesin otorisasi berbasis kemampuan (ability-based access control).
 *
 * Pola ini terinspirasi Policy/Gate ala Laravel, diadaptasi untuk JS:
 * kode mengecek KEMAMPUAN (`can(user, "invitation:update", inv)`),
 * bukan IDENTITAS role (`role === "ADMIN"`). Role hanyalah bundel ability.
 *
 * File ini MURNI & isomorphic — tidak menyentuh DB, tidak `server-only`,
 * sehingga bisa dipakai di:
 *   - Client Component (mis. menyembunyikan tombol/menu),
 *   - Server Component & Server Action (penegakan via `@/features/auth/guard`).
 *
 * Konvensi action: "<resource>:<verb>", mis. "guest:delete".
 *
 * Bentuk `resource` yang diharapkan tiap action:
 *   - invitation:read|update|delete → objek Invitation ber-field `userId`
 *   - guest:create|read             → objek Invitation induk ber-field `userId`
 *   - guest:update|delete           → objek Guest dengan relasi `{ invitation: { userId } }`
 *   - *:create tanpa kepemilikan & admin:access → resource tidak dipakai
 */
import { ROLES } from "@/constants/roles";

/** Pemilik langsung sebuah resource (mis. Invitation.userId). */
const ownsResource = (user, resource) =>
  !!resource && resource.userId === user.id;

/** Kepemilikan Guest lewat Invitation induk (Guest tidak punya userId langsung). */
const ownsGuest = (user, guest) =>
  !!guest?.invitation && guest.invitation.userId === user.id;

/**
 * Definisi ability per-role. Setiap entri action bernilai:
 *   - `true`                         → selalu diizinkan
 *   - `(user, resource) => boolean`  → diizinkan bila predikat true (mis. kepemilikan)
 *   - tidak ada                      → ditolak
 *
 * "*" berarti role menguasai seluruh action (dipakai SUPER_ADMIN).
 *
 * Setiap role didefinisikan EKSPLISIT (tanpa pewarisan) agar peran lateral
 * seperti AGENCY tidak diam-diam mewarisi akses USER.
 */
const ABILITIES = {
  [ROLES.USER]: {
    "invitation:create": true,
    "invitation:read": ownsResource,
    "invitation:update": ownsResource,
    "invitation:delete": ownsResource,
    "guest:create": ownsResource, // resource = Invitation induk
    "guest:read": ownsResource, // resource = Invitation induk
    "guest:update": ownsGuest,
    "guest:delete": ownsGuest,
  },

  // AGENCY bersifat lateral. Untuk saat ini kemampuannya setara USER
  // (mengelola undangan miliknya sendiri). Tambahkan ability khusus
  // AGENCY di sini saat fiturnya (mis. kelola undangan klien) tiba —
  // JANGAN diwariskan otomatis dari USER.
  [ROLES.AGENCY]: {
    "invitation:create": true,
    "invitation:read": ownsResource,
    "invitation:update": ownsResource,
    "invitation:delete": ownsResource,
    "guest:create": ownsResource,
    "guest:read": ownsResource,
    "guest:update": ownsGuest,
    "guest:delete": ownsGuest,
  },

  // ADMIN terdefinisi di enum namun belum diberi kemampuan panel CMS.
  // Panel admin saat ini khusus SUPER_ADMIN (lihat SUPER_ADMIN "*").
  [ROLES.ADMIN]: {},

  [ROLES.SUPER_ADMIN]: {
    "*": true,
  },
};

/**
 * Inti otorisasi: apakah `user` boleh melakukan `action` pada `resource`.
 * Aman menerima user null/undefined (mengembalikan false).
 * @param {{ id?: string, role?: string } | null | undefined} user
 * @param {string} action - format "<resource>:<verb>"
 * @param {*} [resource] - objek target untuk cek kepemilikan (opsional)
 * @returns {boolean}
 */
export function can(user, action, resource) {
  if (!user || !user.role) return false;

  const rules = ABILITIES[user.role];
  if (!rules) return false;

  // Wildcard: role menguasai semua action.
  if (rules["*"] === true) return true;

  const rule = rules[action];
  if (rule === true) return true;
  if (typeof rule === "function") return rule(user, resource);

  return false;
}

/** Kebalikan dari {@link can}. */
export function cannot(user, action, resource) {
  return !can(user, action, resource);
}
