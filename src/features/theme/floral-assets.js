/**
 * Manifest aset PNG tema Floral Blossom (opsi "fotorealistis").
 *
 * Letakkan file di `public/themes/floral/` (lihat README di sana). Lalu set
 * FLORAL_USE_PNG = true untuk mengaktifkan layer PNG pada sampul; selama false
 * (atau file belum ada), sampul memakai ornamen SVG bawaan (fallback aman).
 *
 * Tata letak layer (bottom/left/width/rotate/z) MENIRU pola mengundanganda —
 * tapi `src` menunjuk ke aset LISENSI MILIK ANDA, bukan gambar mereka.
 */

export const FLORAL_ASSET_BASE = "/themes/floral";

// ⬇️ Ubah ke true setelah aset PNG diletakkan di public/themes/floral/
export const FLORAL_USE_PNG = false;

export const FLORAL_ASSETS = {
  base: FLORAL_ASSET_BASE,
  coverBg: `${FLORAL_ASSET_BASE}/cover-bg.webp`,     // opsional (fallback: gradient)
  photoFrame: `${FLORAL_ASSET_BASE}/photo-frame.png`, // opsional
  petal: `${FLORAL_ASSET_BASE}/petal.png`,            // opsional
  leaf: `${FLORAL_ASSET_BASE}/leaf.png`,

  // Dedaunan menjuntai di tepi atas (reuse leaf.png, beda transform).
  // side: "left" | "right"; offset: jarak px dari tepi; flip: cermin horizontal.
  coverLeaves: [
    { top: -12, side: "right", offset: -12, width: 200, rotate: 1 },
    { top: -42, side: "right", offset: 78, width: 150, rotate: -2 },
    { top: -150, side: "right", offset: -40, width: 300, rotate: 4 },
    { top: -12, side: "left", offset: -12, width: 190, rotate: -1, flip: true },
    { top: -42, side: "left", offset: 78, width: 150, rotate: 2, flip: true },
    { top: -150, side: "left", offset: -40, width: 290, rotate: -4, flip: true },
  ],

  // Karangan bunga sudut bawah. Didefinisikan sisi KIRI; sisi kanan dibuat
  // cermin otomatis. (px mengacu lebar HP ~ 390–440.)
  coverFlowers: [
    { src: "flower-1.png", bottom: -80, offset: -5, width: 110, rotate: 3, z: 5 },
    { src: "flower-2.png", bottom: -50, offset: -50, width: 90, rotate: 19, z: 4 },
    { src: "flower-5.png", bottom: -100, offset: -20, width: 140, rotate: 9, z: 3 },
    { src: "flower-3.png", bottom: 40, offset: -10, width: 85, rotate: -6, z: 2 },
    { src: "flower-4.png", bottom: 60, offset: 20, width: 75, rotate: 29, z: 1 },
  ],
};
