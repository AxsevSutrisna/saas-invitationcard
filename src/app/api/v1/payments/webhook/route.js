import { NextResponse } from "next/server";
import {
  verifyWebhookSignature,
  getTransactionStatus,
} from "@/features/payment/services/midtrans";
import {
  findTransactionByOrderId,
  updateTransactionStatus,
} from "@/features/payment/repository";
import {
  upsertActiveSubscription,
  revokeActiveSubscription,
} from "@/features/subscription/repository";

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

export async function POST(request) {
  try {
    const payload = await request.json().catch(() => ({}));

    const {
      order_id: orderId,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: signatureKey,
      transaction_status: transactionStatus,
      fraud_status: fraudStatus,
    } = payload;

    // 1. Validasi Keberadaan Payload Utama
    if (!orderId || !statusCode || !grossAmount || !signatureKey) {
      return NextResponse.json(
        { success: false, message: "Payload notifikasi tidak lengkap." },
        { status: 400 }
      );
    }

    // 2. Verifikasi Keamanan Signature Key (Mencegah Webhook Palsu)
    const isSignatureValid = verifyWebhookSignature({
      signatureKey,
      orderId,
      statusCode,
      grossAmount,
    });

    if (!isSignatureValid) {
      console.warn(`[WARNING] Webhook Signature Mismatch for Order ID: ${orderId}`);
      return NextResponse.json(
        { success: false, message: "Signature Key tidak valid." },
        { status: 403 }
      );
    }

    // 3. Cari Data Transaksi Terkait di Database Neon
    const transaction = await findTransactionByOrderId(orderId);
    if (!transaction) {
      console.warn(`[WARNING] Webhook Transaction Not Found for Order ID: ${orderId}`);
      return NextResponse.json(
        { success: false, message: "Data transaksi tidak ditemukan." },
        { status: 404 }
      );
    }

    // REFUNDED bersifat terminal — refund tidak bisa dibatalkan lagi.
    // (SUCCESS TIDAK di-early-return agar transisi SUCCESS -> REFUNDED tetap diproses.)
    if (transaction.status === "REFUNDED") {
      return NextResponse.json({
        success: true,
        message: "Transaksi ini sudah di-refund sebelumnya.",
      });
    }

    // 4. RE-VERIFIKASI OTORITATIF: jangan percaya body notifikasi, ambil status
    //    langsung dari Get Status API. Fallback ke body bila API gagal dihubungi.
    let authStatus = transactionStatus;
    let authFraud = fraudStatus;
    let authStatusCode = statusCode;
    let authGrossAmount = grossAmount;
    try {
      const verified = await getTransactionStatus(orderId);
      if (verified && verified.transaction_status) {
        authStatus = verified.transaction_status;
        authFraud = verified.fraud_status ?? authFraud;
        authStatusCode = verified.status_code ?? authStatusCode;
        authGrossAmount = verified.gross_amount ?? authGrossAmount;
      }
    } catch (verifyError) {
      console.warn(`[WARNING] Get Status gagal untuk ${orderId}, fallback ke body notifikasi:`, verifyError.message);
    }

    // 5. Validasi nominal sesuai catatan transaksi (proteksi tambahan)
    if (Math.round(parseFloat(authGrossAmount)) !== transaction.amount) {
      console.warn(`[WARNING] Gross amount mismatch untuk ${orderId}: notif=${authGrossAmount} vs db=${transaction.amount}`);
      return NextResponse.json(
        { success: false, message: "Nominal transaksi tidak cocok." },
        { status: 200 } // 200 agar Midtrans berhenti retry; transaksi tidak diaktifkan
      );
    }

    // 6. Petakan status. SUCCESS hanya bila status_code Midtrans "200".
    let finalStatus = mapMidtransStatus(authStatus, authFraud);
    if (finalStatus === "SUCCESS" && String(authStatusCode) !== "200") {
      finalStatus = "PENDING";
    }

    // Idempotensi: jika status tidak berubah, tidak perlu proses ulang.
    if (finalStatus === transaction.status) {
      return NextResponse.json({
        success: true,
        message: `Tidak ada perubahan status (${finalStatus}).`,
      });
    }

    // 7. Update Status Transaksi di Database
    const paidAt = finalStatus === "SUCCESS" ? new Date() : null;
    await updateTransactionStatus(orderId, finalStatus, paidAt);

    // 8. Efek samping pada langganan sesuai status akhir
    if (finalStatus === "SUCCESS") {
      const pkg = transaction.package;
      await upsertActiveSubscription({
        userId: transaction.userId,
        packageId: transaction.packageId,
        durationDays: pkg.durationDays,
      });
      console.log(`[SUCCESS] Subscription activated for User ID: ${transaction.userId} (Order ID: ${orderId})`);
    } else if (finalStatus === "REFUNDED") {
      // Refund/chargeback -> cabut langganan yang sebelumnya aktif untuk paket ini
      const revokedCount = await revokeActiveSubscription({
        userId: transaction.userId,
        packageId: transaction.packageId,
      });
      console.log(`[REFUNDED] ${revokedCount} langganan dicabut untuk User ID: ${transaction.userId} (Order ID: ${orderId})`);
    }

    // 9. Kembalikan HTTP 200 OK agar Midtrans menghentikan pengiriman notifikasi ulang
    return NextResponse.json({
      success: true,
      message: `Webhook berhasil diproses dengan status akhir: ${finalStatus}`,
    });
  } catch (error) {
    console.error("Payment Webhook Handler Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan internal saat memproses webhook.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
