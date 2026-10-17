/**
 * Helper peta fitur — MURNI & isomorphic (tanpa DB, aman di client & server).
 *
 * "Peta fitur" adalah objek datar { [featureKey]: boolean | number | null } yang
 * meringkas hak akses sebuah undangan. Nilai:
 *   - boolean  → fitur BOOLEAN (true = aktif)
 *   - number   → kuota fitur QUOTA
 *   - null     → kuota tak terbatas (unlimited) — key tetap hadir di peta
 *   - (absen)  → tidak diberikan
 */
import { FREE_FEATURE_MAP } from "./constants";

/**
 * Bangun peta fitur datar dari relasi PackageFeature hasil query Prisma
 * (tiap elemen: { enabled, limitValue, feature: { key, type } }).
 * @param {Array<{enabled: boolean, limitValue: number|null, feature: {key: string, type: string}}>} packageFeatures
 * @returns {Record<string, boolean|number|null>}
 */
export function buildFeatureMap(packageFeatures = []) {
  const map = {};
  for (const pf of packageFeatures) {
    const key = pf?.feature?.key;
    if (!key) continue;
    if (pf.feature.type === "QUOTA") {
      // null limitValue = tak terbatas (disimpan sebagai null; key tetap hadir)
      map[key] = pf.limitValue ?? null;
    } else {
      map[key] = !!pf.enabled;
    }
  }
  return map;
}

/** Apakah fitur BOOLEAN aktif pada peta. Aman terhadap peta null/undefined. */
export function hasFeature(map, key) {
  return map?.[key] === true;
}

/**
 * Nilai kuota sebuah fitur QUOTA.
 * @returns {number} jumlah; `Infinity` bila tak terbatas; `0` bila tidak diberikan.
 */
export function getQuota(map, key) {
  if (!map || !(key in map)) return 0;
  const v = map[key];
  if (v === null) return Infinity; // unlimited
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/** Salinan peta fitur fallback (tanpa entitlement). */
export function freeFeatureMap() {
  return { ...FREE_FEATURE_MAP };
}

/**
 * Gabungkan beberapa peta fitur menjadi satu (untuk BUNDLE & stacking add-on).
 * Aturan gabung:
 *   - BOOLEAN → OR (true menang).
 *   - QUOTA   → `null` (unlimited) menang; selain itu ambil nilai terbesar.
 * @param {...Record<string, boolean|number|null>} maps
 * @returns {Record<string, boolean|number|null>}
 */
export function mergeFeatureMaps(...maps) {
  const out = {};
  for (const map of maps) {
    if (!map || typeof map !== "object") continue;
    for (const [key, val] of Object.entries(map)) {
      if (typeof val === "boolean") {
        out[key] = out[key] === true || val === true;
      } else {
        // Fitur QUOTA: null = unlimited (menang); selain itu ambil max.
        const cur = out[key];
        if (cur === null || val === null) {
          out[key] = null;
        } else {
          out[key] = Math.max(Number(cur) || 0, Number(val) || 0);
        }
      }
    }
  }
  return out;
}
