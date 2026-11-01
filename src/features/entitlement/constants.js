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
 *
 * WAJIB cermin penugasan fitur paket "free" di `prisma/seed.js` (sumber katalog
 * yang dikelola admin): FREE memberi Musik Latar + RSVP, selain kuota dasar —
 * TANPA tanpa-watermark, tema premium, amplop digital, love story, buku tamu.
 */
export const FREE_FEATURE_MAP = {
  [FEATURE_KEYS.MAX_INVITATIONS]: 1,
  [FEATURE_KEYS.MAX_GUESTS]: 100,
  [FEATURE_KEYS.MAX_PHOTOS]: 8,
  [FEATURE_KEYS.BACKGROUND_MUSIC]: true,
  [FEATURE_KEYS.RSVP]: true,
};

/**
 * Fitur yang flag-nya sudah ada di katalog tetapi KAPABILITASNYA belum dibangun
 * (roadmap). Ditandai "Segera Hadir" di katalog admin & bullet marketing, dan
 * TIDAK menggerakkan apa pun di runtime (tak ada field/UI untuk dikunci).
 *
 * Saat sebuah fitur selesai dibangun: hapus key-nya dari sini LALU pasang
 * gating-nya (mis. `<FeatureGate>` / cek server) + hapus label "(Segera Hadir)"
 * dari bullet paket terkait.
 */
export const COMING_SOON_FEATURES = new Set([
  FEATURE_KEYS.LIVE_STREAM,
  FEATURE_KEYS.QR_CHECKIN,
  FEATURE_KEYS.CUSTOM_DOMAIN,
]);

/** Apakah sebuah feature key masih "segera hadir" (belum berfungsi). */
export function isComingSoonFeature(key) {
  return COMING_SOON_FEATURES.has(key);
}
