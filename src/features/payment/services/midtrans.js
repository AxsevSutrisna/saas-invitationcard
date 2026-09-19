import crypto from "crypto";

const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

// Tentukan base URL untuk Snap API (buat transaksi)
const SNAP_BASE_URL = isProduction
  ? "https://app.midtrans.com/snap/v1"
  : "https://app.sandbox.midtrans.com/snap/v1";

// Base URL untuk Core/Status API (CATATAN: pakai host "api.*", bukan "app.*")
const API_BASE_URL = isProduction
  ? "https://api.midtrans.com/v2"
  : "https://api.sandbox.midtrans.com/v2";

/**
 * Membuat Basic Auth Token berbasis Base64 yang aman untuk Edge Runtime (menggunakan btoa)
 */
function getAuthHeader() {
  const token = btoa(`${serverKey}:`);
  return `Basic ${token}`;
}

/**
 * Membuat transaksi baru di Midtrans Snap
 * @param {Object} params
 * @param {string} params.orderId - ID Pesanan unik
 * @param {number} params.amount - Jumlah nominal pembayaran
 * @param {string} params.userEmail - Email pembeli
 * @param {string} params.userName - Nama pembeli
 * @param {string} params.packageName - Nama paket langganan
 * @returns {Promise<Object>} Token & Redirect URL dari Midtrans
 */
export async function createSnapTransaction({
  orderId,
  amount,
  userEmail,
  userName,
  packageName,
  finishUrl,
}) {
  const body = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    customer_details: {
      first_name: userName || "Pelanggan",
      email: userEmail,
    },
    item_details: [
      {
        id: "premium_invitation_pkg",
        price: amount,
        quantity: 1,
        name: packageName,
      },
    ],
  };

  // Redirect callback (mode Snap redirect / mobile): user diarahkan balik ke situs
  if (finishUrl) {
    body.callbacks = { finish: finishUrl };
  }

  const response = await fetch(`${SNAP_BASE_URL}/transactions`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": getAuthHeader(),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Midtrans API Error (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * Mengambil status transaksi OTORITATIF langsung dari Midtrans (Get Status API).
 * Dipakai untuk re-verifikasi status di webhook alih-alih memercayai body notifikasi.
 * @param {string} orderId - ID Pesanan (order_id)
 * @returns {Promise<Object>} Objek status: { transaction_status, fraud_status, status_code, gross_amount, payment_type, ... }
 */
export async function getTransactionStatus(orderId) {
  const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(orderId)}/status`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Authorization": getAuthHeader(),
    },
  });

  const data = await response.json().catch(() => ({}));

  // 404 = transaksi tidak ditemukan di Midtrans; status_code lain diteruskan ke pemanggil.
  if (!response.ok && response.status !== 404) {
    throw new Error(`Midtrans Get Status Error (${response.status}): ${JSON.stringify(data)}`);
  }

  return data;
}

/**
 * Memverifikasi validitas signature_key notifikasi webhook dari Midtrans
 * @param {Object} params
 * @param {string} params.signatureKey - Signature key yang dikirim Midtrans
 * @param {string} params.orderId - ID Pesanan dari Midtrans
 * @param {string} params.statusCode - Status code dari Midtrans
 * @param {string} params.grossAmount - Gross amount dari Midtrans
 * @returns {boolean} Benar jika signature valid
 */
export function verifyWebhookSignature({
  signatureKey,
  orderId,
  statusCode,
  grossAmount,
}) {
  // Format string signature Midtrans: order_id + status_code + gross_amount + ServerKey
  const payload = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const calculatedHash = crypto
    .createHash("sha512")
    .update(payload)
    .digest("hex");

  return calculatedHash === signatureKey;
}
