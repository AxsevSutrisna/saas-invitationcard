import { convertImageToWebp } from "@/lib/image";
import { putObject, buildUserObjectKey } from "@/lib/r2";

/**
 * Upload service terpusat (server-only).
 * Semua modul yang mengunggah GAMBAR memakai ini agar berkas SELALU dikonversi
 * ke WebP sebelum disimpan ke R2, dan URL yang dikembalikan menunjuk berkas .webp.
 */

// Tipe input gambar yang diterima (akan dikonversi ke WebP).
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/tiff",
  "image/heic",
  "image/heif",
];

// Batas ukuran input (sebelum konversi). Output WebP jauh lebih kecil.
export const MAX_IMAGE_INPUT_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Konversi buffer gambar → WebP lalu unggah ke R2.
 *
 * @param {Buffer} inputBuffer Isi berkas asli (format apa pun yang didukung sharp).
 * @param {{ userId: string, folder?: string, maxWidth?: number, quality?: number }} opts
 * @returns {Promise<{ url: string, key: string, width: number, height: number, size: number }>}
 */
export async function uploadImage(inputBuffer, opts) {
  const { userId, folder = "images", maxWidth, quality } = opts || {};
  if (!userId) throw new Error("uploadImage: userId wajib diisi.");

  const webp = await convertImageToWebp(inputBuffer, { maxWidth, quality });
  // Selalu .webp karena berkas dikonversi ke WebP sebelum diunggah.
  const key = buildUserObjectKey({ userId, folder, ext: "webp" });
  const url = await putObject(key, webp.buffer, webp.contentType);

  return {
    url,
    key,
    width: webp.width,
    height: webp.height,
    size: webp.size,
  };
}
