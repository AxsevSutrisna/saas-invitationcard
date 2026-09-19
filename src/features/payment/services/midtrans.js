import crypto from "crypto";

const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

// Tentukan base URL untuk Snap API
const SNAP_BASE_URL = isProduction
  ? "https://app.midtrans.com/snap/v1"
  : "https://app.sandbox.midtrans.com/snap/v1";

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
}) {
  const response = await fetch(`${SNAP_BASE_URL}/transactions`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": getAuthHeader(),
    },
    body: JSON.stringify({
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
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Midtrans API Error (${response.status}): ${errorText}`);
  }

  return response.json();
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
