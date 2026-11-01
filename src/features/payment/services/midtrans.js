import crypto from "crypto";

const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

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
 * Membuat charge via Midtrans CORE API (bukan Snap) untuk UI pembayaran custom.
 * Mendukung QRIS, Bank Transfer / VA (BCA/BNI/BRI/Permata), dan Mandiri (echannel).
 *
 * @param {Object} params
 * @param {string} params.orderId
 * @param {number} params.amount
 * @param {string} params.userEmail
 * @param {string} params.userName
 * @param {string} params.itemName - nama item (tampil di riwayat/tagihan)
 * @param {"qris"|"bank_transfer"|"echannel"} params.method - payment_type Core API
 * @param {string} [params.bank] - untuk bank_transfer: bca | bni | bri | permata
 * @returns {Promise<Object>} instruksi pembayaran ternormalisasi
 */
export async function createCoreCharge({
  orderId,
  amount,
  userEmail,
  userName,
  itemName,
  method,
  bank,
}) {
  const body = {
    payment_type: method,
    transaction_details: { order_id: orderId, gross_amount: amount },
    customer_details: { first_name: userName || "Pelanggan", email: userEmail },
    item_details: [
      { id: "ikara_pkg", price: amount, quantity: 1, name: (itemName || "Paket IKARA").slice(0, 50) },
    ],
    // Batas waktu pembayaran 24 jam.
    custom_expiry: { expiry_duration: 24, unit: "hour" },
  };

  if (method === "bank_transfer") {
    body.bank_transfer = { bank };
  } else if (method === "echannel") {
    body.echannel = { bill_info1: "Pembayaran", bill_info2: (itemName || "Paket IKARA").slice(0, 50) };
  } else if (method === "qris") {
    body.qris = { acquirer: "gopay" };
  }

  const response = await fetch(`${API_BASE_URL}/charge`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  const statusCode = String(data.status_code || "");

  // Charge sukses (pending/settlement) → status_code 2xx. Selain itu = gagal.
  if (!response.ok || (statusCode && !statusCode.startsWith("2"))) {
    throw new Error(
      data.status_message || `Midtrans Charge Error (${response.status}/${statusCode || "?"})`
    );
  }

  return normalizeCoreCharge(data);
}

/** Normalisasi respons charge Core API ke bentuk seragam untuk disimpan & ditampilkan. */
function normalizeCoreCharge(d) {
  let bank = null;
  let vaNumber = null;
  let billerCode = null;
  let billKey = null;
  let qrImageUrl = null;
  let qrString = null;

  if (Array.isArray(d.va_numbers) && d.va_numbers[0]) {
    bank = d.va_numbers[0].bank;
    vaNumber = d.va_numbers[0].va_number;
  }
  if (d.permata_va_number) {
    bank = "permata";
    vaNumber = d.permata_va_number;
  }
  if (d.biller_code) billerCode = d.biller_code;
  if (d.bill_key) billKey = d.bill_key;
  if (Array.isArray(d.actions)) {
    const qr = d.actions.find((a) => a.name === "generate-qr-code");
    if (qr) qrImageUrl = qr.url;
  }
  if (d.qr_string) qrString = d.qr_string;

  // expiry_time Midtrans: "YYYY-MM-DD HH:mm:ss" (WIB/GMT+7) → jadikan ISO absolut.
  const expiryTime = d.expiry_time ? `${d.expiry_time.replace(" ", "T")}+07:00` : null;

  return {
    paymentType: d.payment_type || null,
    bank,
    vaNumber,
    billerCode,
    billKey,
    qrImageUrl,
    qrString,
    expiryTime,
    grossAmount: d.gross_amount || null,
  };
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
