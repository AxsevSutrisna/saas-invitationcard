import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/midtrans";
import {
  findTransactionByOrderId,
  updateTransactionStatus,
} from "@/server/repositories/transaction.repository";
import { upsertActiveSubscription } from "@/server/repositories/subscription.repository";

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

    // Hindari memproses ulang transaksi yang sudah diselesaikan sebelumnya
    if (transaction.status === "SUCCESS") {
      return NextResponse.json({
        success: true,
        message: "Transaksi ini sudah sukses diproses sebelumnya.",
      });
    }

    let finalStatus = "PENDING";
    let isSuccess = false;

    // 4. Analisis Status Pembayaran Berdasarkan Parameter Midtrans
    if (
      transactionStatus === "settlement" ||
      (transactionStatus === "capture" && fraudStatus === "accept")
    ) {
      finalStatus = "SUCCESS";
      isSuccess = true;
    } else if (
      transactionStatus === "deny" ||
      transactionStatus === "cancel" ||
      transactionStatus === "expire"
    ) {
      finalStatus = "FAILED";
    }

    // 5. Update Status Transaksi di Database
    const paidAt = isSuccess ? new Date() : null;
    await updateTransactionStatus(orderId, finalStatus, paidAt);

    // 6. Jika Pembayaran Sukses, Buat / Perpanjang Sesi Langganan Pengguna
    if (isSuccess) {
      const pkg = transaction.package;
      await upsertActiveSubscription({
        userId: transaction.userId,
        packageId: transaction.packageId,
        durationDays: pkg.durationDays,
      });
      console.log(`[SUCCESS] Subscription activated for User ID: ${transaction.userId} (Order ID: ${orderId})`);
    }

    // 7. Kembalikan HTTP 200 OK agar Midtrans menghentikan pengiriman notifikasi ulang
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
