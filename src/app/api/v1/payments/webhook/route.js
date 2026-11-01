import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/features/payment/services/midtrans";
import { reconcilePaymentByOrderId } from "@/features/payment/reconcile";

/**
 * Webhook notifikasi Midtrans (server-to-server).
 *
 * Alur: validasi payload → verifikasi signature (anti-palsu) → delegasikan ke
 * `reconcilePaymentByOrderId` yang mengambil status OTORITATIF dari Get Status
 * API lalu memenuhi langganan/entitlement/kredit secara exactly-once.
 *
 * Logika pemetaan status & pemenuhan sengaja TIDAK di sini agar dipakai bersama
 * dengan polling status di halaman pembayaran (Core API custom).
 */
export async function POST(request) {
  try {
    const payload = await request.json().catch(() => ({}));

    const {
      order_id: orderId,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: signatureKey,
    } = payload;

    // 1. Validasi keberadaan payload utama
    if (!orderId || !statusCode || !grossAmount || !signatureKey) {
      return NextResponse.json(
        { success: false, message: "Payload notifikasi tidak lengkap." },
        { status: 400 }
      );
    }

    // 2. Verifikasi signature (mencegah webhook palsu)
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

    // 3. Rekonsiliasi otoritatif + pemenuhan (exactly-once)
    const result = await reconcilePaymentByOrderId(orderId);

    if (result.notFound) {
      console.warn(`[WARNING] Webhook Transaction Not Found for Order ID: ${orderId}`);
      return NextResponse.json(
        { success: false, message: "Data transaksi tidak ditemukan." },
        { status: 404 }
      );
    }
    if (result.mismatch) {
      // 200 agar Midtrans berhenti retry; transaksi tidak diaktifkan.
      return NextResponse.json(
        { success: false, message: "Nominal transaksi tidak cocok." },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Webhook diproses. Status akhir: ${result.status}`,
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
