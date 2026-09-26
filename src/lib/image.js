import sharp from "sharp";

/**
 * Layanan konversi gambar terpusat (server-only).
 * Mengubah buffer gambar format APA PUN yang didukung sharp (JPEG, PNG, GIF,
 * TIFF, AVIF, HEIC, dll) menjadi WebP — dipakai semua modul yang mengunggah
 * gambar agar penyimpanan & penyajian selalu berformat WebP.
 */

const DEFAULT_MAX_WIDTH = 2400; // batasi dimensi agar file tetap ringan
const DEFAULT_QUALITY = 80; // kualitas seimbang untuk foto konten

/**
 * Konversi buffer gambar → WebP.
 * - Auto-rotate sesuai EXIF (gambar statis).
 * - Mempertahankan animasi (GIF/WebP animasi) bila ada.
 * - Membatasi lebar maksimum (tanpa memperbesar).
 *
 * @param {Buffer} inputBuffer
 * @param {{ maxWidth?: number, quality?: number }} [opts]
 * @returns {Promise<{ buffer: Buffer, contentType: string, width: number, height: number, size: number }>}
 */
export async function convertImageToWebp(inputBuffer, opts = {}) {
  const { maxWidth = DEFAULT_MAX_WIDTH, quality = DEFAULT_QUALITY } = opts;

  // Deteksi animasi lebih dulu agar semua frame dipertahankan saat konversi.
  const probe = await sharp(inputBuffer, { failOn: "none" }).metadata();
  const isAnimated = (probe.pages || 1) > 1;

  let pipeline = sharp(inputBuffer, { failOn: "none", animated: isAnimated });
  // Auto-rotate via EXIF hanya untuk gambar statis (rotate + animasi bisa bentrok).
  if (!isAnimated) pipeline = pipeline.rotate();

  const { data, info } = await pipeline
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality, effort: 4 })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: data,
    contentType: "image/webp",
    width: info.width,
    height: info.height,
    size: info.size,
  };
}
