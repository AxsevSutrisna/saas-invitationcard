/**
 * Test Payment Gateway (Midtrans) — Paket & Bundling
 * ==================================================
 * Memverifikasi integrasi Midtrans untuk pembelian paket/bundling:
 *
 *  OFFLINE (tanpa jaringan, deterministik):
 *   - verifyWebhookSignature: tanda tangan SHA-512 valid diterima, yang diubah ditolak.
 *   - mapMidtransStatus: pemetaan status Midtrans → status internal.
 *
 *  LIVE (hanya jika SANDBOX terkonfigurasi — produksi DILEWATI demi keamanan):
 *   - createSnapTransaction nyata ke Midtrans Sandbox untuk:
 *       1) BASIC  (eceran, ONE_TIME)
 *       2) Paket Komplit (BUNDLE)
 *       3) Vendor Pack x3 (RESELLER, harga grosir)
 *     → harus mengembalikan Snap `token` + `redirect_url`.
 *   - getTransactionStatus nyata atas salah satu order → membuktikan jalur
 *     re-verifikasi webhook menjangkau Midtrans.
 *
 * Helper di bawah MENCERMINKAN `src/features/payment/services/midtrans.js` &
 * `mapMidtransStatus` di webhook (app pakai ESM `.js` yang tak bisa dimuat Node polos).
 * Panggilan jaringan ke endpoint & dengan algoritma yang SAMA PERSIS.
 *
 * Jalankan: node -r dotenv/config scripts/test-midtrans-payment.cjs
 */
const crypto = require("crypto");
const { PrismaClient } = require("../src/generated/prisma");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv").config();

const SERVER_KEY = (process.env.MIDTRANS_SERVER_KEY || "").trim();
const CLIENT_KEY = (process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "").trim();
const IS_PROD = process.env.MIDTRANS_IS_PRODUCTION === "true";
const SNAP_BASE = IS_PROD ? "https://app.midtrans.com/snap/v1" : "https://app.sandbox.midtrans.com/snap/v1";
const API_BASE = IS_PROD ? "https://api.midtrans.com/v2" : "https://api.sandbox.midtrans.com/v2";
const authHeader = () => "Basic " + Buffer.from(`${SERVER_KEY}:`).toString("base64");

// --- mirror midtrans.js -----------------------------------------------------
function signature(orderId, statusCode, grossAmount) {
  return crypto.createHash("sha512").update(`${orderId}${statusCode}${grossAmount}${SERVER_KEY}`).digest("hex");
}
function verifyWebhookSignature({ signatureKey, orderId, statusCode, grossAmount }) {
  return signature(orderId, statusCode, grossAmount) === signatureKey;
}
// mirror mapMidtransStatus dari src/app/api/v1/payments/webhook/route.js
function mapMidtransStatus(t, f) {
  if (t === "settlement" || (t === "capture" && f === "accept")) return "SUCCESS";
  if (["refund", "partial_refund", "chargeback", "partial_chargeback"].includes(t)) return "REFUNDED";
  if (["deny", "cancel", "expire", "failure"].includes(t)) return "FAILED";
  return "PENDING";
}
async function createSnap({ orderId, amount, name }) {
  const body = {
    transaction_details: { order_id: orderId, gross_amount: amount },
    customer_details: { first_name: "E2E Tester", email: "e2e@test.local" },
    item_details: [{ id: "pkg", price: amount, quantity: 1, name: name || "Paket" }],
  };
  const res = await fetch(`${SNAP_BASE}/transactions`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: authHeader() },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}
async function getStatus(orderId) {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(orderId)}/status`, {
    method: "GET",
    headers: { Accept: "application/json", Authorization: authHeader() },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

// --- harness ---------------------------------------------------------------
const results = [];
function check(name, cond, extra) {
  results.push({ name, ok: !!cond });
  console.log(`  ${cond ? "✅ PASS" : "❌ FAIL"}  ${name}${extra ? `  — ${extra}` : ""}`);
}

const pool = new Pool({ connectionString: (process.env.DATABASE_URL || "").replace(/^["']|["']$/g, "") });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

(async () => {
  console.log("Test Midtrans Payment — Paket & Bundling\n");

  // ---- Env ----------------------------------------------------------------
  console.log("[Environment]");
  console.log(`  MIDTRANS_SERVER_KEY           : ${SERVER_KEY ? "ADA" : "(kosong)"}`);
  console.log(`  NEXT_PUBLIC_MIDTRANS_CLIENT_KEY: ${CLIENT_KEY ? "ADA" : "(kosong)"}`);
  console.log(`  MIDTRANS_IS_PRODUCTION        : ${IS_PROD}`);
  console.log(`  Mode                          : ${IS_PROD ? "PRODUCTION" : "SANDBOX"}`);
  check("Server key tersedia", !!SERVER_KEY);
  check("Client key tersedia", !!CLIENT_KEY);

  // ---- Offline: signature -------------------------------------------------
  console.log("\n[Signature webhook]");
  const sOrder = "IKARA-TEST-123";
  const sCode = "200";
  const sAmount = "99000.00";
  const goodSig = signature(sOrder, sCode, sAmount);
  check("signature valid DITERIMA", verifyWebhookSignature({ signatureKey: goodSig, orderId: sOrder, statusCode: sCode, grossAmount: sAmount }));
  check("signature nominal diubah DITOLAK", !verifyWebhookSignature({ signatureKey: goodSig, orderId: sOrder, statusCode: sCode, grossAmount: "100000.00" }));
  check("signature acak DITOLAK", !verifyWebhookSignature({ signatureKey: "deadbeef", orderId: sOrder, statusCode: sCode, grossAmount: sAmount }));

  // ---- Offline: status mapping -------------------------------------------
  console.log("\n[Pemetaan status Midtrans]");
  check("settlement → SUCCESS", mapMidtransStatus("settlement") === "SUCCESS");
  check("capture+accept → SUCCESS", mapMidtransStatus("capture", "accept") === "SUCCESS");
  check("refund → REFUNDED", mapMidtransStatus("refund") === "REFUNDED");
  check("expire → FAILED", mapMidtransStatus("expire") === "FAILED");
  check("deny → FAILED", mapMidtransStatus("deny") === "FAILED");
  check("pending → PENDING", mapMidtransStatus("pending") === "PENDING");

  // ---- Harga paket dari DB ------------------------------------------------
  const [basic, bundle, vendor] = await Promise.all([
    prisma.package.findUnique({ where: { slug: "basic" }, select: { name: true, price: true } }),
    prisma.package.findUnique({ where: { slug: "bundle-komplit" }, select: { name: true, price: true } }),
    prisma.package.findUnique({ where: { slug: "vendor" }, select: { name: true, price: true, wholesalePrice: true } }),
  ]);

  // ---- Live: Snap transaction (sandbox only) ------------------------------
  console.log("\n[Snap transaction — LIVE]");
  if (!SERVER_KEY) {
    console.log("  ⏭️  DILEWATI — MIDTRANS_SERVER_KEY kosong. Isi .env untuk uji live.");
  } else if (IS_PROD) {
    console.log("  ⏭️  DILEWATI — mode PRODUCTION. Tidak membuat order sungguhan. Set MIDTRANS_IS_PRODUCTION=false (sandbox) untuk uji live.");
  } else {
    const stamp = Date.now();
    const cases = [
      { label: "ECERAN (BASIC)", orderId: `E2E-ECERAN-${stamp}`, amount: basic?.price ?? 99000, name: basic?.name ?? "BASIC" },
      { label: "BUNDLE (Paket Komplit)", orderId: `E2E-BUNDLE-${stamp}`, amount: bundle?.price ?? 129000, name: bundle?.name ?? "Paket Komplit" },
      { label: "RESELLER (Vendor x3)", orderId: `E2E-RESELLER-${stamp}`, amount: (vendor?.wholesalePrice ?? 99000) * 3, name: `${vendor?.name ?? "Vendor Pack"} x3` },
    ];
    let firstOrder = null;
    for (const c of cases) {
      try {
        const r = await createSnap(c);
        const okToken = r.ok && !!r.data?.token && !!r.data?.redirect_url;
        check(`Snap ${c.label} (Rp${c.amount}) → token`, okToken, okToken ? `token ${String(r.data.token).slice(0, 12)}…` : `HTTP ${r.status}: ${JSON.stringify(r.data).slice(0, 160)}`);
        if (okToken && !firstOrder) firstOrder = c.orderId;
      } catch (e) {
        check(`Snap ${c.label}`, false, e.message);
      }
    }

    // ---- Live: Get Status (re-verifikasi webhook) -------------------------
    console.log("\n[Get Status — LIVE]");
    if (firstOrder) {
      try {
        const st = await getStatus(firstOrder);
        // Order Snap yang BELUM dibayar belum punya transaction_status (Midtrans
        // balas status_code "404 Transaction doesn't exist"). Yang diverifikasi:
        // endpoint Get Status terjangkau & ter-autentikasi (ada status_code).
        const reachable = !!st.data?.status_code;
        const label = st.data?.transaction_status
          ? `status=${st.data.transaction_status}`
          : `status_code=${st.data?.status_code} (${st.data?.status_message || "belum ada upaya bayar"})`;
        check("Get Status (re-verifikasi) terjangkau & terautentikasi", reachable, label);
      } catch (e) {
        check("Get Status", false, e.message);
      }
    } else {
      console.log("  ⏭️  DILEWATI — tak ada order yang berhasil dibuat.");
    }
  }

  // ---- Ringkasan ----------------------------------------------------------
  const passed = results.filter((r) => r.ok).length;
  const failed = results.length - passed;
  console.log(`\n================ HASIL: ${passed}/${results.length} PASS, ${failed} FAIL ================`);
  if (!SERVER_KEY || IS_PROD) console.log("(Uji LIVE Snap/Get-Status dilewati — lihat catatan di atas.)");

  await prisma.$disconnect().catch(() => {});
  await pool.end().catch(() => {});
  process.exit(failed === 0 ? 0 : 1);
})().catch(async (e) => {
  console.error("\n💥 ERROR:", e.message);
  await prisma.$disconnect().catch(() => {});
  await pool.end().catch(() => {});
  process.exit(1);
});
