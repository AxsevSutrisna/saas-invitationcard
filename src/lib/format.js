/**
 * Format helpers - dipakai lintas komponen agar tidak menduplikasi logika format.
 */

/**
 * Format angka ke Rupiah, mis. 99000 -> "Rp 99.000" (tanpa desimal).
 * @param {number} amount
 */
export function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

/**
 * Format tanggal panjang Indonesia, mis. "Sabtu, 12 Oktober 2025".
 * @param {string|number|Date} date
 */
export function formatEventDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Format tanggal ringkas Indonesia, mis. "12 Okt 2025".
 * @param {string|number|Date} date
 */
export function formatShortDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Bangun URL WhatsApp (wa.me) dari nomor telepon + pesan opsional.
 * Membersihkan karakter non-digit dan menormalkan awalan "0" (lokal ID) menjadi "62".
 * @param {string} phone
 * @param {string} [message]
 */
export function buildWhatsAppUrl(phone, message = "") {
  let cleaned = String(phone || "").replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  }
  const base = `https://wa.me/${cleaned}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
