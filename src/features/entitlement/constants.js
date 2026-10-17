/**
 * Konstanta fitur (feature flags) — MURNI & isomorphic (aman di client & server).
 *
 * Setiap `key` WAJIB cocok persis dengan `Feature.key` di database
 * (di-seed pada `prisma/seed.js`). Bila menambah/mengubah key, ubah keduanya.
 *
 * Dua jenis fitur:
 *   - BOOLEAN → aktif/tidak (mis. NO_WATERMARK)
 *   - QUOTA   → berangka, punya `limitValue` (mis. MAX_GUESTS)
 */
export const FEATURE_KEYS = {
  // BOOLEAN
  NO_WATERMARK: "NO_WATERMARK", // Sembunyikan watermark "Powered by" di undangan publik
  PREMIUM_THEME: "PREMIUM_THEME", // Boleh memakai tema ber-flag isPremium
  DIGITAL_ENVELOPE: "DIGITAL_ENVELOPE", // Fitur amplop digital / hadiah
  RSVP: "RSVP", // Konfirmasi kehadiran tamu
  QR_CHECKIN: "QR_CHECKIN", // Check-in tamu via QR
  GUEST_BOOK: "GUEST_BOOK", // Buku tamu / ucapan
  LIVE_STREAM: "LIVE_STREAM", // Tautan live streaming acara
  BACKGROUND_MUSIC: "BACKGROUND_MUSIC", // Musik latar
  LOVE_STORY: "LOVE_STORY", // Bagian cerita perjalanan cinta
  CUSTOM_DOMAIN: "CUSTOM_DOMAIN", // Domain kustom (roadmap)

  // QUOTA
  MAX_INVITATIONS: "MAX_INVITATIONS", // Jumlah undangan yang boleh dibuat
  MAX_GUESTS: "MAX_GUESTS", // Jumlah tamu per undangan
  MAX_PHOTOS: "MAX_PHOTOS", // Jumlah foto galeri per undangan
};

/**
 * Peta fitur dasar untuk undangan TANPA entitlement/langganan aktif
 * (paket "FREE" implisit). Fitur BOOLEAN yang tidak disebut dianggap nonaktif.
 */
export const FREE_FEATURE_MAP = {
  [FEATURE_KEYS.MAX_INVITATIONS]: 1,
  [FEATURE_KEYS.MAX_GUESTS]: 100,
  [FEATURE_KEYS.MAX_PHOTOS]: 8,
};
