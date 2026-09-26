/**
 * theme-catalog.js — SATU sumber kebenaran untuk metadata KATALOG tema
 * (kategori, tag, gaya badge/gradient, thumbnail placeholder).
 *
 * Dipakai bersama oleh:
 * - src/app/themes/ThemesClient.jsx            (galeri marketing publik)
 * - src/app/dashboard/themes/ThemesListClient.jsx (galeri dashboard)
 *
 * Menghilangkan duplikasi `CATEGORY_MAP` yang sebelumnya ada di dua tempat.
 * Kategori kini juga bisa berasal dari kolom DB `Theme.category`; fallback ke
 * peta per-slug di bawah bila kolom masih kosong (data lama).
 */

/** Kategori valid — dipakai untuk filter & form admin. */
export const THEME_CATEGORIES = ["Elegant", "Floral", "Minimalist", "Blue", "Nature"];

/** Opsi filter (termasuk "Semua"). */
export const THEME_FILTERS = ["Semua", ...THEME_CATEGORIES];

// ─── Gaya visual per-KATEGORI (didefinisikan sekali) ───
const GOLD_STYLE = {
  badgeColor:
    "bg-gold-100 text-gold-700 dark:bg-gold-400/15 dark:text-gold-300 border border-gold-200 dark:border-gold-400/20",
  gradient: "from-gold-100 to-gold-50 dark:from-zinc-800 dark:to-zinc-900",
};
const ROSE_STYLE = {
  badgeColor:
    "bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent border border-accent/20 dark:border-accent/30",
  gradient: "from-accent/10 to-accent/5 dark:from-zinc-800 dark:to-zinc-900",
};
const DEFAULT_STYLE = {
  badgeColor: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  gradient: "from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900",
};

/** Peta gaya per kategori. Tambah kategori baru cukup di sini. */
export const CATEGORY_STYLE = {
  Elegant: GOLD_STYLE,
  Floral: ROSE_STYLE,
  Minimalist: GOLD_STYLE,
  Blue: GOLD_STYLE,
  Nature: GOLD_STYLE,
};

// Fallback per-slug (kategori + tag marketing) untuk data lama tanpa `category`.
const SLUG_META = {
  "classic-elegance": { category: "Elegant", tag: "Populer" },
  "floral-blossom": { category: "Floral", tag: "Eksklusif" },
  "modern-minimalist": { category: "Minimalist", tag: "Favorit" },
  "floral-blue": { category: "Blue", tag: "Baru" },
  "nature-harmony": { category: "Nature", tag: "Baru" },
};

/** Thumbnail placeholder per-slug (dipindah dari kedua client agar tak dobel). */
export const DEFAULT_THUMBNAILS = {
  "classic-elegance": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600",
  "floral-blossom": "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=600",
  "modern-minimalist": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600",
  "floral-blue": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=600",
  "nature-harmony": "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=600",
};

/**
 * Rakit metadata katalog sebuah tema: kategori dari DB (fallback slug),
 * tag, serta gaya badge & gradient sesuai kategori.
 * @param {{ slug: string, category?: string|null, tag?: string|null, isPremium?: boolean }} theme
 * @returns {{ category: string, tag: string, badgeColor: string, gradient: string }}
 */
export function getThemeCatalog(theme) {
  const fallback = SLUG_META[theme.slug] || {};
  const category = theme.category || fallback.category || "Elegant";
  const tag = theme.tag || fallback.tag || (theme.isPremium ? "Premium" : "Populer");
  const style = CATEGORY_STYLE[category] || DEFAULT_STYLE;
  return { category, tag, ...style };
}
