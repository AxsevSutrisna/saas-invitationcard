/**
 * Type Definitions (JSDoc)
 * Digunakan sebagai dokumentasi tipe data untuk seluruh project.
 * Karena project menggunakan JavaScript (bukan TypeScript), JSDoc
 * digunakan sebagai pengganti untuk intellisense dan dokumentasi.
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string|null} image
 * @property {string} role - "USER" | "AGENCY" | "ADMIN" | "SUPER_ADMIN"
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Session
 * @property {User} user
 * @property {Date} expires
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {string} message
 * @property {any} [data]
 * @property {{ code: string, details: string[] }} [error]
 */

/**
 * @typedef {Object} Invitation
 * @property {string} id
 * @property {string} slug
 * @property {string} userId
 * @property {string} themeId
 * @property {string} title
 * @property {string} brideName
 * @property {string} groomName
 * @property {string|null} musicUrl
 * @property {string|null} quotes
 * @property {boolean} isPublished
 */
