import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
  console.warn("[R2] Missing required R2 environment variables in initialization.");
}

export const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
});

export const R2_BUCKET_NAME = bucketName || "";
export const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || "";

/**
 * Domain publik ternormalisasi: tanpa trailing slash & DIJAMIN berskema.
 * Bila R2_PUBLIC_DOMAIN di-set tanpa "https://" (mis. "pub-xxx.r2.dev"),
 * URL yang dihasilkan akan dianggap relatif oleh browser sehingga <img> rusak.
 * Di sini kita otomatis menambahkan "https://" agar URL selalu absolut.
 */
function normalizedDomain() {
  let d = (R2_PUBLIC_DOMAIN || "").trim().replace(/\/+$/, "");
  if (d && !/^https?:\/\//i.test(d)) d = `https://${d}`;
  return d;
}

/** Susun public URL dari object key. */
export function buildPublicUrl(key) {
  return `${normalizedDomain()}/${key}`;
}

/**
 * Susun object key R2 ter-namespace per pengguna — SATU-SATUNYA sumber konvensi
 * key upload. SELALU berawalan `invitations/{userId}/` agar guard penghapusan
 * (lihat deleteObjectByUrl dengan opts.userId) & pembersihan objek yatim tetap
 * konsisten. JANGAN ubah prefix ini tanpa menyesuaikan guard tersebut.
 *
 * @param {{ userId: string, folder?: string, ext?: string }} opts
 *   folder & ext di-sanitasi (huruf kecil, buang karakter non-aman).
 * @returns {string} mis. "invitations/abc/images/1700000000000-x7k2.webp"
 */
export function buildUserObjectKey({ userId, folder = "images", ext = "webp" } = {}) {
  if (!userId) throw new Error("buildUserObjectKey: userId wajib diisi.");
  const safeFolder =
    String(folder || "images").toLowerCase().replace(/[^a-z0-9-]/g, "") || "images";
  const safeExt =
    String(ext || "bin").toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 10);
  return `invitations/${userId}/${safeFolder}/${ts}-${rand}.${safeExt}`;
}

/**
 * Unggah buffer ke R2 dan kembalikan public URL-nya.
 * @param {string} key Object key tujuan.
 * @param {Buffer|Uint8Array} body Isi berkas.
 * @param {string} contentType MIME type (mis. "image/webp").
 * @returns {Promise<string>} public URL.
 */
export async function putObject(key, body, contentType) {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return buildPublicUrl(key);
}

/**
 * Ubah public URL menjadi object key R2.
 * Mengembalikan null bila URL kosong atau BUKAN milik domain publik R2 kita
 * (guard: mencegah percobaan menghapus URL eksternal seperti avatar Google).
 */
export function r2KeyFromUrl(url) {
  if (!url || typeof url !== "string") return null;
  const domain = normalizedDomain();
  if (!domain || !url.startsWith(`${domain}/`)) return null;
  const key = url.slice(domain.length + 1).split("?")[0]; // buang querystring
  return key ? decodeURIComponent(key) : null;
}

/**
 * Hapus satu objek R2 berdasarkan public URL — BEST-EFFORT: tidak pernah throw,
 * agar tidak menggagalkan operasi utama (hapus undangan, dsb) bila R2 bermasalah.
 *
 * @param {string} url Public URL objek.
 * @param {{ userId?: string }} [opts] Bila `userId` diberikan, hanya key
 *   ber-prefix `invitations/{userId}/` yang dihapus (mode aman anti salah-hapus).
 * @returns {Promise<boolean>} true bila perintah delete berhasil dikirim.
 */
export async function deleteObjectByUrl(url, opts = {}) {
  try {
    const key = r2KeyFromUrl(url);
    if (!key) return false;
    if (opts.userId && !key.startsWith(`invitations/${opts.userId}/`)) return false;
    if (!R2_BUCKET_NAME) return false;

    await s3Client.send(
      new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key })
    );
    return true;
  } catch (error) {
    console.error("[R2] Gagal menghapus objek:", url, error?.message);
    return false;
  }
}

/**
 * Hapus banyak objek R2 sekaligus (best-effort, paralel, dedup).
 * Nilai kosong/null/duplikat & URL non-R2 diabaikan otomatis.
 */
export async function deleteObjectsByUrls(urls, opts = {}) {
  const unique = [...new Set((Array.isArray(urls) ? urls : []).filter(Boolean))];
  if (unique.length === 0) return;
  await Promise.allSettled(unique.map((u) => deleteObjectByUrl(u, opts)));
}
