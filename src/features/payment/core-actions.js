"use server";

import { requireSession } from "@/features/auth/guard";
import { ROLES } from "@/constants/roles";
import { createCoreCharge } from "@/features/payment/services/midtrans";
import { reconcilePaymentByOrderId } from "@/features/payment/reconcile";
import { findPackageById } from "@/features/subscription/repository";
import { createTransaction, findTransactionByOrderId } from "@/features/payment/repository";
import { getInvitationOwner } from "@/features/invitation/repository";

/**
 * Peta pilihan metode (UI) → parameter Core API Midtrans.
 * Tahap ini: QRIS + Transfer VA (BCA/Mandiri/BNI/BRI/Permata).
 */
const METHOD_MAP = {
  qris: { method: "qris" },
  bca: { method: "bank_transfer", bank: "bca" },
  bni: { method: "bank_transfer", bank: "bni" },
  bri: { method: "bank_transfer", bank: "bri" },
  permata: { method: "bank_transfer", bank: "permata" },
  mandiri: { method: "echannel" },
};

/**
 * Server Action: buat charge Core API + catat transaksi (status PENDING).
 * Validasi mode sama dengan checkout Snap lama (langganan / eceran / reseller).
 *
 * @param {string} packageId
 * @param {{ method: string, invitationId?: string, quantity?: number }} options
 * @returns {Promise<{success: boolean, data?: {orderId: string}, error?: string}>}
 */
export async function createCustomCheckoutAction(packageId, options = {}) {
  try {
    const user = await requireSession();
    const { method: methodKey, invitationId = null, quantity = 1 } = options;

    const charge = METHOD_MAP[methodKey];
    if (!charge) return { success: false, error: "Metode pembayaran tidak valid." };
    if (!packageId) return { success: false, error: "ID Paket wajib disertakan." };

    const pkg = await findPackageById(packageId);
    if (!pkg) return { success: false, error: "Paket tidak ditemukan atau tidak aktif." };

    const isReseller = pkg.saleType === "RESELLER";
    let qty = 1;
    let amount = pkg.price;

    if (isReseller) {
      if (user.role !== ROLES.AGENCY && user.role !== ROLES.SUPER_ADMIN) {
        return { success: false, error: "Pembelian kredit reseller hanya untuk akun Agency." };
      }
      qty = Math.max(1, parseInt(quantity) || 1);
      const unit = pkg.wholesalePrice ?? pkg.price;
      amount = unit * qty;
    }

    if (amount <= 0) {
      return { success: false, error: "Paket ini tidak memerlukan pembayaran." };
    }

    // Mode eceran: pastikan undangan milik user ini.
    const effectiveInvitationId = isReseller ? null : invitationId;
    if (effectiveInvitationId) {
      const invitation = await getInvitationOwner(effectiveInvitationId);
      if (!invitation || invitation.userId !== user.id) {
        return { success: false, error: "Undangan tidak ditemukan atau bukan milik Anda." };
      }
    }

    const shortUserId = user.id.substring(0, 6).toUpperCase();
    const orderId = `IKARA-${shortUserId}-${Date.now()}`;
    const itemName = isReseller ? `${pkg.name} x${qty}` : pkg.name;

    const result = await createCoreCharge({
      orderId,
      amount,
      userEmail: user.email,
      userName: user.name,
      itemName,
      method: charge.method,
      bank: charge.bank,
    });

    await createTransaction({
      userId: user.id,
      packageId: pkg.id,
      invitationId: effectiveInvitationId,
      amount,
      quantity: qty,
      midtransOrderId: orderId,
      paymentType: result.paymentType,
      paymentUrl: result.qrImageUrl || null,
      paymentMeta: result,
      status: "PENDING",
    });

    return { success: true, data: { orderId } };
  } catch (error) {
    console.error("Error createCustomCheckoutAction:", error);
    return { success: false, error: error.message || "Terjadi kesalahan saat memproses pembayaran." };
  }
}

/**
 * Server Action: cek & rekonsiliasi status pembayaran (dipanggil polling di
 * halaman pembayaran). Memastikan hanya pemilik transaksi yang bisa memeriksa.
 */
export async function checkPaymentStatusAction(orderId) {
  try {
    const user = await requireSession();
    if (!orderId) return { success: false, error: "Order ID wajib diisi." };

    const tx = await findTransactionByOrderId(orderId);
    if (!tx || tx.userId !== user.id) {
      return { success: false, error: "Transaksi tidak ditemukan." };
    }

    const result = await reconcilePaymentByOrderId(orderId, { transaction: tx });
    return { success: true, status: result.status };
  } catch (error) {
    console.error("Error checkPaymentStatusAction:", error);
    return { success: false, error: error.message || "Gagal memeriksa status pembayaran." };
  }
}
