import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createSnapTransaction } from "@/lib/midtrans";
import { findPackageById } from "@/server/repositories/subscription.repository";
import { createTransaction } from "@/server/repositories/transaction.repository";

export async function POST(request) {
  try {
    // 1. Verifikasi Autentikasi Pengguna
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Akses ditolak. Silakan login terlebih dahulu.",
        },
        { status: 401 }
      );
    }

    // 2. Baca Payload Request
    const body = await request.json().catch(() => ({}));
    const { packageId } = body;

    if (!packageId) {
      return NextResponse.json(
        {
          success: false,
          message: "ID Paket langganan wajib disertakan.",
        },
        { status: 400 }
      );
    }

    // 3. Cari Detail Paket di Database
    const pkg = await findPackageById(packageId);
    if (!pkg) {
      return NextResponse.json(
        {
          success: false,
          message: "Paket langganan tidak ditemukan atau tidak aktif.",
        },
        { status: 404 }
      );
    }

    // 4. Batasi Jika Harga Paket adalah 0 (Paket Free tidak perlu checkout)
    if (pkg.price <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Paket gratis tidak memerlukan transaksi pembayaran.",
        },
        { status: 400 }
      );
    }

    // 5. Rancang Order ID Unik (Format: IKARA-[ShortUserID]-[Timestamp])
    const shortUserId = session.user.id.substring(0, 6).toUpperCase();
    const orderId = `IKARA-${shortUserId}-${Date.now()}`;

    // 6. Hubungi Midtrans Snap API
    const snapResult = await createSnapTransaction({
      orderId,
      amount: pkg.price,
      userEmail: session.user.email,
      userName: session.user.name,
      packageName: pkg.name,
    });

    // 7. Simpan Riwayat Transaksi Awal (PENDING) ke Neon DB
    await createTransaction({
      userId: session.user.id,
      packageId: pkg.id,
      amount: pkg.price,
      midtransOrderId: orderId,
      midtransToken: snapResult.token,
      paymentUrl: snapResult.redirect_url,
      status: "PENDING",
    });

    // 8. Kembalikan snap token ke frontend
    return NextResponse.json({
      success: true,
      message: "Transaksi pembayaran berhasil dibuat.",
      data: {
        token: snapResult.token,
        redirectUrl: snapResult.redirect_url,
        orderId,
      },
    });
  } catch (error) {
    console.error("Payment Checkout API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan internal saat memproses pembayaran.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
