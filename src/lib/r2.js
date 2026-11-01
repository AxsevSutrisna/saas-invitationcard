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

// Sanitasi segmen folder (huruf kecil, hanya a-z0-9-).
function sanitizeFolder(folder) {
  return String(folder || "images").toLowerCase().replace(/[^a-z0-9-]/g, "") || "images";
}
// Sanitasi ekstensi.
function sanitizeExt(ext) {
  return String(ext || "bin").toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
}
// Nama berkas acak anti-collision (tanpa memakai nama asli).
function randomFileName(ext) {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${sanitizeExt(ext)}`;
}

/**
 * Susun object key R2 ter-namespace per pengguna — SATU-SATUNYA sumber konvensi
 * key upload undangan. SELALU berawalan `invitations/{userId}/` agar guard
 * penghapusan (deleteObjectByUrl dengan opts.userId) & pembersihan objek yatim
 * tetap konsisten. JANGAN ubah prefix ini tanpa menyesuaikan guard tersebut.
 *
 * Bila `invitationId` diberikan (mis. saat mengedit undangan yang sudah ada),
 * aset dikelompokkan per-undangan: `invitations/{userId}/{invitationId}/{folder}/…`.
 * Tanpa `invitationId` (mis. membuat undangan baru yang belum punya id), aset
 * jatuh ke level pengguna: `invitations/{userId}/{folder}/…`.
 *
 * @param {{ userId: string, invitationId?: string, folder?: string, ext?: string }} opts
 * @returns {string} mis. "invitations/abc/inv123/images/1700000000000-x7k2.webp"
 */
export function buildUserObjectKey({ userId, invitationId, folder = "images", ext = "webp" } = {}) {
  if (!userId) throw new Error("buildUserObjectKey: userId wajib diisi.");
  const safeInv = invitationId
    ? String(invitationId).replace(/[^a-zA-Z0-9_-]/g, "")
    : "";
  const base = safeInv
    ? `invitations/${userId}/${safeInv}/${sanitizeFolder(folder)}`
    : `invitations/${userId}/${sanitizeFolder(folder)}`;
  return `${base}/${randomFileName(ext)}`;
}

/**
 * Susun object key untuk aset milik PLATFORM (tema), terpisah dari namespace
 * pengguna: `themes/{folder}/…`. Dipakai saat Super Admin mengunggah thumbnail/
 * preview tema agar tidak bercampur dengan aset undangan pengguna.
 *
 * @param {{ folder?: string, ext?: string }} opts
 * @returns {string} mis. "themes/images/1700000000000-x7k2.webp"
 */
export function buildThemeObjectKey({ folder = "images", ext = "webp" } = {}) {
  return `themes/${sanitizeFolder(folder)}/${randomFileName(ext)}`;
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
 * @param {{ userId?: string, prefix?: string }} [opts] Guard anti salah-hapus:
 *   - `userId` → hanya key ber-prefix `invitations/{userId}/` yang dihapus.
 *   - `prefix` → hanya key ber-prefix tersebut (mis. `themes/`) yang dihapus.
 * @returns {Promise<boolean>} true bila perintah delete berhasil dikirim.
 */
export async function deleteObjectByUrl(url, opts = {}) {
  try {
    const key = r2KeyFromUrl(url);
    if (!key) return false;
    if (opts.userId && !key.startsWith(`invitations/${opts.userId}/`)) return false;
    if (opts.prefix && !key.startsWith(opts.prefix)) return false;
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
