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
 * @property {string|null} coverUrl
 * @property {string|null} musicUrl
 * @property {string|null} quotes
 * @property {string|null} openingText
 * @property {boolean} isPublished
 * @property {Date|null} publishedAt
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Theme
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string|null} description
 * @property {string|null} thumbnailUrl
 * @property {any} [previewImages]
 * @property {boolean} isPremium
 * @property {boolean} isActive
 * @property {number} sortOrder
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Event
 * @property {string} id
 * @property {string} invitationId
 * @property {string} name
 * @property {Date} date
 * @property {string} startTime
 * @property {string|null} endTime
 * @property {string} locationName
 * @property {string} address
 * @property {string|null} mapUrl
 * @property {number|null} mapLat
 * @property {number|null} mapLng
 * @property {number} sortOrder
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} LoveStory
 * @property {string} id
 * @property {string} invitationId
 * @property {string} title
 * @property {string|null} date
 * @property {string} description
 * @property {string|null} imageUrl
 * @property {number} sortOrder
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Gallery
 * @property {string} id
 * @property {string} invitationId
 * @property {string} mediaUrl
 * @property {string|null} thumbnailUrl
 * @property {"PHOTO" | "VIDEO"} type
 * @property {string|null} caption
 * @property {number} sortOrder
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Gift
 * @property {string} id
 * @property {string} invitationId
 * @property {"BANK" | "EWALLET" | "PHYSICAL"} type
 * @property {string} providerName
 * @property {string} accountName
 * @property {string|null} accountNumber
 * @property {string|null} qrCodeUrl
 * @property {string|null} note
 * @property {number} sortOrder
 */

/**
 * @typedef {Object} Guest
 * @property {string} id
 * @property {string} invitationId
 * @property {string} name
 * @property {string|null} whatsapp
 * @property {string} uniqueCode
 * @property {boolean} isOpened
 * @property {Date|null} openedAt
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} RSVP
 * @property {string} id
 * @property {string} invitationId
 * @property {string|null} guestId
 * @property {string|null} name
 * @property {"YES" | "NO" | "MAYBE"} attendance
 * @property {number} pax
 * @property {string|null} message
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Package
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {"ONE_TIME" | "RECURRING"} type
 * @property {number} price
 * @property {any} features
 * @property {number} maxInvitations
 * @property {number} durationDays
 * @property {boolean} isActive
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Subscription
 * @property {string} id
 * @property {string} userId
 * @property {string} packageId
 * @property {"ACTIVE" | "EXPIRED" | "CANCELLED"} status
 * @property {Date} startDate
 * @property {Date} validUntil
 * @property {number} quotaUsed
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} userId
 * @property {string} packageId
 * @property {number} amount
 * @property {string} currency
 * @property {string} midtransOrderId
 * @property {string|null} midtransToken
 * @property {"PENDING" | "SUCCESS" | "FAILED" | "REFUNDED"} status
 * @property {string|null} paymentUrl
 * @property {Date|null} paidAt
 * @property {Date} createdAt
 */

