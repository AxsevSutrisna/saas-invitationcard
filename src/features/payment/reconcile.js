import "server-only";
import { getTransactionStatus } from "@/features/payment/services/midtrans";
import {
  findTransactionByOrderId,
  claimTransactionTransition,
} from "@/features/payment/repository";
import {
  upsertActiveSubscription,
  revokeActiveSubscription,
} from "@/features/subscription/repository";
import { grantEntitlementFromPackage } from "@/features/entitlement/service";
import { revokeEntitlementsByTransactionId } from "@/features/entitlement/repository";
import { createResellerCredit } from "@/features/reseller/repository";

/**
 * Memetakan (transaction_status, fraud_status) Midtrans ke status internal.
 * @returns {"SUCCESS"|"FAILED"|"REFUNDED"|"PENDING"}
 */
function mapMidtransStatus(transactionStatus, fraudStatus) {
  if (
    transactionStatus === "settlement" ||
    (transactionStatus === "capture" && fraudStatus === "accept")
  ) {
    return "SUCCESS";
  }
  if (
    transactionStatus === "refund" ||
    transactionStatus === "partial_refund" ||
    transactionStatus === "chargeback" ||
    transactionStatus === "partial_chargeback"
  ) {
    return "REFUNDED";
  }
  if (
    transactionStatus === "deny" ||
    transactionStatus === "cancel" ||
    transactionStatus === "expire" ||
    transactionStatus === "failure"
  ) {
    return "FAILED";
  }
  return "PENDING"; // pending / capture(challenge) / authorize
}

/**
 * Rekonsiliasi OTORITATIF sebuah transaksi berdasarkan Get Status API Midtrans,
 * lalu jalankan efek samping pemenuhan (langganan / entitlement / kredit reseller)
 * secara "exactly-once" via klaim transisi status atomik.
 *
 * Dipakai BERSAMA oleh:
 *  - Webhook Midtrans (server-to-server, setelah verifikasi signature), dan
 *  - Polling status di halaman pembayaran (penting di dev saat webhook tak
 *    terjangkau dari internet).
 *
 * @param {string} orderId
 * @param {{ transaction?: object }} [opts] - transaksi yang sudah di-fetch (opsional)
 * @returns {Promise<{ ok: boolean, status: string|null, changed: boolean, notFound?: boolean, mismatch?: boolean }>}
 */
export async function reconcilePaymentByOrderId(orderId, { transaction: preTx } = {}) {
  const transaction = preTx || (await findTransactionByOrderId(orderId));
  if (!transaction) return { ok: false, notFound: true, status: null, changed: false };

  // Status terminal (REFUNDED/FAILED) tidak akan berubah lagi → hindari panggilan
  // Get Status API yang sia-sia. (SUCCESS sengaja TIDAK di-skip agar transisi
  // SUCCESS→REFUNDED dari webhook tetap diproses.)
  if (transaction.status === "REFUNDED" || transaction.status === "FAILED") {
    return { ok: true, status: transaction.status, changed: false };
  }

  // Ambil status otoritatif dari Midtrans. Bila gagal → tidak ubah apa pun.
  let verified = null;
  try {
    verified = await getTransactionStatus(orderId);
  } catch (error) {
    console.warn(`[reconcile] Get Status gagal untuk ${orderId}:`, error.message);
  }
  if (!verified || !verified.transaction_status) {
    return { ok: true, status: transaction.status, changed: false };
  }

  // Proteksi: nominal harus sesuai catatan transaksi.
  if (Math.round(parseFloat(verified.gross_amount)) !== transaction.amount) {
    console.warn(
      `[reconcile] Gross amount mismatch ${orderId}: notif=${verified.gross_amount} vs db=${transaction.amount}`
    );
    return { ok: false, mismatch: true, status: transaction.status, changed: false };
  }

  let finalStatus = mapMidtransStatus(verified.transaction_status, verified.fraud_status);
  if (finalStatus === "SUCCESS" && String(verified.status_code) !== "200") {
    finalStatus = "PENDING";
  }

  // Tidak ada perubahan status → selesai.
  if (finalStatus === transaction.status) {
    return { ok: true, status: finalStatus, changed: false };
  }

  // Klaim transisi secara atomik: hanya satu pemanggil yang boleh memenuhi.
  const paidAt = finalStatus === "SUCCESS" ? new Date() : null;
  const claimed = await claimTransactionTransition(orderId, transaction.status, finalStatus, {
    paidAt,
    midtransTransactionId: verified.transaction_id,
    paymentType: verified.payment_type,
  });
  if (claimed === 0) {
    // Sudah diproses pihak lain (webhook/polling bersamaan).
    return { ok: true, status: finalStatus, changed: false };
  }

  // Efek samping sesuai status akhir & mode transaksi.
  const pkg = transaction.package;
  const isPerInvitation = !!transaction.invitationId;
  const isReseller = pkg?.saleType === "RESELLER";

  if (finalStatus === "SUCCESS") {
    if (isPerInvitation) {
      await grantEntitlementFromPackage({
        invitationId: transaction.invitationId,
        ownerUserId: transaction.userId,
        packageId: transaction.packageId,
        source: "PURCHASE",
        durationDays: pkg.durationDays,
        transactionId: transaction.id,
      });
      console.log(`[SUCCESS] Entitlement eceran diterbitkan (Order ID: ${orderId})`);
    } else if (isReseller) {
      await createResellerCredit({
        agencyUserId: transaction.userId,
        packageId: transaction.packageId,
        quantityTotal: transaction.quantity,
        transactionId: transaction.id,
      });
      console.log(`[SUCCESS] ${transaction.quantity} kredit reseller ditambahkan (Order ID: ${orderId})`);
    } else {
      await upsertActiveSubscription({
        userId: transaction.userId,
        packageId: transaction.packageId,
        durationDays: pkg.durationDays,
      });
      console.log(`[SUCCESS] Subscription activated (Order ID: ${orderId})`);
    }
  } else if (finalStatus === "REFUNDED") {
    if (isPerInvitation) {
      const revoked = await revokeEntitlementsByTransactionId(transaction.id);
      console.log(`[REFUNDED] ${revoked} entitlement dicabut (Order ID: ${orderId})`);
    } else if (isReseller) {
      console.log(`[REFUNDED] Kredit reseller di-refund (Order ID: ${orderId}) — tinjau manual.`);
    } else {
      const revoked = await revokeActiveSubscription({
        userId: transaction.userId,
        packageId: transaction.packageId,
      });
      console.log(`[REFUNDED] ${revoked} langganan dicabut (Order ID: ${orderId})`);
    }
  }

  return { ok: true, status: finalStatus, changed: true };
}
