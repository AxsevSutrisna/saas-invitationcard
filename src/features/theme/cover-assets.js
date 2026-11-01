/**
 * Manifest aset PNG untuk SAMPUL semua tema undangan (teknik layer mengundanganda).
 *
 * Taruh file di `public/themes/<slug>/` (lihat public/themes/README.md). Lalu set
 * `enabled: true` pada tema yang asetnya sudah lengkap. Selama `enabled: false`
 * (default) atau file belum ada, sampul memakai ornamen SVG bawaan (fallback
 * aman — tak ada yang rusak).
 *
 * Tata letak layer SAMA untuk semua tema (ornamen/daun menjuntai di atas +
 * elemen sudut bawah kiri/kanan, kanan dibuat cermin). Isi gambar disesuaikan
 * tiap tema (floral → bunga; classic → ornamen emas; modern → geometris; dst).
 * Posisi meniru pola mengundanganda; `src` menunjuk aset LISENSI MILIK ANDA.
 */

// Layout bersama (posisi/ukuran/rotasi) — reuse "leaf.png" & "flower-1..5.png".
const COVER_LEAVES = [
  { top: -12, side: "right", offset: -12, width: 200, rotate: 1 },
  { top: -42, side: "right", offset: 78, width: 150, rotate: -2 },
  { top: -150, side: "right", offset: -40, width: 300, rotate: 4 },
  { top: -12, side: "left", offset: -12, width: 190, rotate: -1, flip: true },
  { top: -42, side: "left", offset: 78, width: 150, rotate: 2, flip: true },
  { top: -150, side: "left", offset: -40, width: 290, rotate: -4, flip: true },
];

const COVER_FLOWERS = [
  { src: "flower-1.png", bottom: -80, offset: -5, width: 110, rotate: 3, z: 5 },
  { src: "flower-2.png", bottom: -50, offset: -50, width: 90, rotate: 19, z: 4 },
  { src: "flower-5.png", bottom: -100, offset: -20, width: 140, rotate: 9, z: 3 },
  { src: "flower-3.png", bottom: 40, offset: -10, width: 85, rotate: -6, z: 2 },
  { src: "flower-4.png", bottom: 60, offset: 20, width: 75, rotate: 29, z: 1 },
];

function themeCoverAssets(slug, overrides = {}) {
  const base = `/themes/${slug}`;
  return {
    enabled: false, // ⬅️ set true setelah aset tema ini lengkap di public/themes/<slug>/
    base,
    coverBg: `${base}/cover-bg.webp`, // opsional (fallback: latar bawaan tema)
    photoFrame: `${base}/photo-frame.png`, // opsional
    petal: `${base}/petal.png`, // opsional
    leaf: `${base}/leaf.png`,
    coverLeaves: COVER_LEAVES,
    coverFlowers: COVER_FLOWERS,
    ...overrides,
  };
}

export const COVER_ASSETS = {
  "classic-elegance": themeCoverAssets("classic-elegance"),
  "floral-blossom": themeCoverAssets("floral-blossom"),
  "floral-blue": themeCoverAssets("floral-blue"),
  "modern-minimalist": themeCoverAssets("modern-minimalist"),
  "nature-harmony": themeCoverAssets("nature-harmony"),
};

export function getCoverAssets(slug) {
  return COVER_ASSETS[slug] || null;
}
