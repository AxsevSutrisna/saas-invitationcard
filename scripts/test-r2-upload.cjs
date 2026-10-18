/**
 * E2E / Integration Test — Modul Upload (Gambar & Musik) ke Cloudflare R2
 * ========================================================================
 * Menguji alur penyimpanan aset end-to-end langsung ke R2:
 *
 *  OFFLINE:
 *   - Konvensi object key (buildUserObjectKey ± invitationId, buildThemeObjectKey)
 *     + round-trip URL↔key + logika guard hapus.
 *   - Konversi gambar multi-format → WebP via `sharp` nyata (PNG/JPEG/GIF/TIFF/
 *     WEBP/AVIF) — membuktikan "format apa pun → WebP".
 *
 *  LIVE (butuh kredensial R2):
 *   - GAMBAR: put WebP ke R2 → HeadObject (cek ada + ContentType image/webp) →
 *     fetch public URL (cek 200 + content-type webp) → DeleteObject.
 *   - AUDIO: getSignedUrl (presigned PUT) → fetch PUT buffer → HeadObject → delete.
 *
 * Semua objek uji dibuat di prefix `invitations/_e2e-test/...` & `themes/_e2e-test/...`
 * dan DIHAPUS lagi di akhir (blok finally). Helper key MENCERMINKAN src/lib/r2.js;
 * konversi MENCERMINKAN src/lib/image.js (modul app ESM tak bisa dimuat Node polos).
 *
 * Jalankan: node -r dotenv/config scripts/test-r2-upload.cjs
 */
const sharp = require("sharp");
const {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();

const ACCOUNT = process.env.R2_ACCOUNT_ID;
const BUCKET = process.env.R2_BUCKET_NAME || "";
const PUBLIC_DOMAIN = (process.env.R2_PUBLIC_DOMAIN || "").trim().replace(/\/+$/, "");
const hasCreds = !!(ACCOUNT && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && BUCKET);

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

// --- mirror src/lib/r2.js -------------------------------------------------
const sanitizeFolder = (f) => String(f || "images").toLowerCase().replace(/[^a-z0-9-]/g, "") || "images";
const sanitizeExt = (e) => String(e || "bin").toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
const randomFileName = (ext) => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${sanitizeExt(ext)}`;
function buildUserObjectKey({ userId, invitationId, folder = "images", ext = "webp" }) {
  const inv = invitationId ? String(invitationId).replace(/[^a-zA-Z0-9_-]/g, "") : "";
  const base = inv ? `invitations/${userId}/${inv}/${sanitizeFolder(folder)}` : `invitations/${userId}/${sanitizeFolder(folder)}`;
  return `${base}/${randomFileName(ext)}`;
}
function buildThemeObjectKey({ folder = "images", ext = "webp" }) {
  return `themes/${sanitizeFolder(folder)}/${randomFileName(ext)}`;
}
function normalizedDomain() {
  let d = PUBLIC_DOMAIN;
  if (d && !/^https?:\/\//i.test(d)) d = `https://${d}`;
  return d;
}
const buildPublicUrl = (key) => `${normalizedDomain()}/${key}`;
function r2KeyFromUrl(url) {
  const domain = normalizedDomain();
  if (!domain || !url.startsWith(`${domain}/`)) return null;
  return decodeURIComponent(url.slice(domain.length + 1).split("?")[0]) || null;
}
// mirror image.js
async function convertImageToWebp(buf) {
  const probe = await sharp(buf, { failOn: "none" }).metadata();
  const animated = (probe.pages || 1) > 1;
  let p = sharp(buf, { failOn: "none", animated });
  if (!animated) p = p.rotate();
  const { data, info } = await p.resize({ width: 2400, withoutEnlargement: true }).webp({ quality: 80, effort: 4 }).toBuffer({ resolveWithObject: true });
  return { buffer: data, contentType: "image/webp", width: info.width, height: info.height };
}

// --- harness --------------------------------------------------------------
const results = [];
const check = (name, cond, extra) => { results.push(!!cond); console.log(`  ${cond ? "✅ PASS" : "❌ FAIL"}  ${name}${extra ? ` — ${extra}` : ""}`); };
const head = async (key) => { try { return await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key })); } catch { return null; } };
const createdKeys = [];

(async () => {
  console.log("Test Upload → Cloudflare R2 (gambar & musik)\n");
  console.log("[Environment]");
  console.log(`  Kredensial R2 : ${hasCreds ? "LENGKAP" : "KURANG"}`);
  console.log(`  Public domain : ${PUBLIC_DOMAIN || "(kosong)"}`);

  // ---- 1. Konvensi key ----------------------------------------------------
  console.log("\n[Konvensi object key]");
  const kFlat = buildUserObjectKey({ userId: "u1", folder: "images" });
  const kInv = buildUserObjectKey({ userId: "u1", invitationId: "inv9", folder: "images" });
  const kTheme = buildThemeObjectKey({ folder: "images" });
  const kAudio = buildUserObjectKey({ userId: "u1", invitationId: "inv9", folder: "audio", ext: "mp3" });
  check("key user (tanpa invitationId) → invitations/u1/images/*.webp", /^invitations\/u1\/images\/\d+-[a-z0-9]+\.webp$/.test(kFlat), kFlat);
  check("key user (dengan invitationId) → invitations/u1/inv9/images/*", /^invitations\/u1\/inv9\/images\//.test(kInv), kInv);
  check("key tema → themes/images/*", /^themes\/images\//.test(kTheme), kTheme);
  check("key audio ber-ext .mp3", kAudio.endsWith(".mp3"), kAudio);
  const url = buildPublicUrl(kInv);
  check("URL↔key round-trip (r2KeyFromUrl)", r2KeyFromUrl(url) === kInv);
  check("r2KeyFromUrl tolak URL non-R2 (mis. Unsplash)", r2KeyFromUrl("https://images.unsplash.com/abc.jpg") === null);
  // guard hapus (replica): userId hanya boleh hapus prefix-nya
  const guard = (key, userId) => key.startsWith(`invitations/${userId}/`);
  check("guard: user tak bisa hapus aset user lain", guard("invitations/u2/images/x.webp", "u1") === false);
  check("guard: user boleh hapus aset per-undangannya", guard(kInv, "u1") === true);

  // ---- 2. Konversi multi-format → WebP -----------------------------------
  console.log("\n[Konversi gambar → WebP (sharp nyata)]");
  const base = sharp({ create: { width: 120, height: 80, channels: 3, background: { r: 200, g: 169, b: 106 } } });
  const sources = {};
  sources.png = await base.clone().png().toBuffer();
  sources.jpeg = await base.clone().jpeg().toBuffer();
  sources.tiff = await base.clone().tiff().toBuffer();
  sources.webp = await base.clone().webp().toBuffer();
  // GIF (animasi 2 frame) — uji jalur animated
  try {
    sources.gif = await sharp({ create: { width: 40, height: 40, channels: 3, background: { r: 10, g: 10, b: 10 } }, animated: true, pages: 2 }).gif().toBuffer();
  } catch { /* skip bila build gif terbatas */ }
  try { sources.avif = await base.clone().avif().toBuffer(); } catch { /* avif opsional */ }

  for (const [fmt, buf] of Object.entries(sources)) {
    try {
      const out = await convertImageToWebp(buf);
      const meta = await sharp(out.buffer).metadata();
      check(`input ${fmt.toUpperCase()} → output WebP valid`, out.contentType === "image/webp" && meta.format === "webp" && meta.width > 0, `${meta.width}x${meta.height}, ${out.buffer.length}B`);
    } catch (e) {
      check(`input ${fmt.toUpperCase()} → WebP`, false, e.message);
    }
  }
  // Non-gambar → harus gagal (sharp menolak)
  try {
    await convertImageToWebp(Buffer.from("ini teks biasa, bukan gambar"));
    check("non-gambar ditolak konversi", false, "seharusnya throw");
  } catch {
    check("non-gambar ditolak konversi (sharp throw → 422 di route)", true);
  }

  // ---- 3 & 4. LIVE R2 -----------------------------------------------------
  if (!hasCreds) {
    console.log("\n[LIVE R2] ⏭️  DILEWATI — kredensial R2 tidak lengkap.");
  } else {
    const runId = `run-${Date.now()}`;

    // 3. Gambar: put → head → fetch public → (delete di finally)
    console.log("\n[LIVE: upload GAMBAR ke R2]");
    try {
      const webp = await convertImageToWebp(sources.png);
      const imgKey = buildUserObjectKey({ userId: "_e2e-test", invitationId: runId, folder: "images", ext: "webp" });
      await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: imgKey, Body: webp.buffer, ContentType: webp.contentType }));
      createdKeys.push(imgKey);
      const h = await head(imgKey);
      check("gambar tersimpan di R2 (HeadObject)", !!h, imgKey);
      check("ContentType tersimpan = image/webp", h?.ContentType === "image/webp", h?.ContentType);

      if (PUBLIC_DOMAIN) {
        try {
          const res = await fetch(buildPublicUrl(imgKey));
          const ct = res.headers.get("content-type") || "";
          if (res.ok || res.status === 404) {
            // Terjangkau → nilai sebagai check nyata (200 + webp).
            check("public URL dapat di-GET (200) & ber-WebP", res.ok && ct.includes("webp"), `HTTP ${res.status}, ${ct}`);
          } else {
            check("public URL dapat di-GET (200) & ber-WebP", false, `HTTP ${res.status}, ${ct}`);
          }
        } catch (e) {
          // Kegagalan koneksi/TLS (mis. ISP memblokir *.r2.dev) → SKIP, bukan FAIL:
          // keberadaan objek sudah dibuktikan HeadObject di atas.
          console.log(`  ⏭️  GET public URL DILEWATI — domain r2.dev tak terjangkau dari jaringan ini (${e.cause?.code || e.message}). Verifikasi dari jaringan tanpa blokir / via custom domain.`);
        }
      } else {
        console.log("  ⏭️  fetch public URL dilewati (R2_PUBLIC_DOMAIN kosong).");
      }
    } catch (e) {
      check("upload gambar ke R2", false, e.message);
    }

    // 4. Audio: presigned PUT → head → (delete di finally)
    console.log("\n[LIVE: upload AUDIO via presigned URL]");
    try {
      const audioKey = buildUserObjectKey({ userId: "_e2e-test", invitationId: runId, folder: "audio", ext: "mp3" });
      const presigned = await getSignedUrl(
        s3,
        new PutObjectCommand({ Bucket: BUCKET, Key: audioKey, ContentType: "audio/mpeg" }),
        { expiresIn: 60 }
      );
      check("presigned PUT URL terbit", presigned.startsWith("https://"));
      const put = await fetch(presigned, { method: "PUT", headers: { "Content-Type": "audio/mpeg" }, body: Buffer.from([0xff, 0xfb, 0x90, 0x00, 1, 2, 3, 4]) });
      createdKeys.push(audioKey);
      check("audio ter-PUT langsung ke R2 (presigned)", put.ok, `HTTP ${put.status}`);
      check("audio tersimpan di R2 (HeadObject)", !!(await head(audioKey)), audioKey);
    } catch (e) {
      check("upload audio via presigned", false, e.message);
    }

    // 5. Verifikasi DELETE (yang dipakai pembersihan aset yatim)
    console.log("\n[LIVE: hapus objek (cleanup) + verifikasi terhapus]");
    for (const key of createdKeys) {
      await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key })).catch(() => {});
    }
    const stillThere = await head(createdKeys[0]);
    check("objek benar-benar terhapus setelah DeleteObject", stillThere === null);
    createdKeys.length = 0;
  }

  // ---- Ringkasan ----------------------------------------------------------
  const passed = results.filter(Boolean).length;
  const failed = results.length - passed;
  console.log(`\n================ HASIL: ${passed}/${results.length} PASS, ${failed} FAIL ================`);
  if (!hasCreds) console.log("(Uji LIVE R2 dilewati.)");
  process.exit(failed === 0 ? 0 : 1);
})().catch(async (e) => {
  console.error("\n💥 ERROR:", e.message);
  // Best-effort cleanup bila error di tengah
  for (const key of createdKeys) {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key })).catch(() => {});
  }
  process.exit(1);
});
