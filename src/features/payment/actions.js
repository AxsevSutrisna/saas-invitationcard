"use server";

import { requireSession } from "@/features/auth/guard";
import { createSnapTransaction } from "@/features/payment/services/midtrans";
import { findPackageById } from "@/features/subscription/repository";
import { createTransaction } from "@/features/payment/repository";

/**
 * Server Action: Membuat transaksi checkout langganan (Midtrans Snap).
 * Menggantikan endpoint POST /api/v1/payments/checkout.
 */
export async function createCheckoutAction(packageId) {
  try {
    const user = await requireSession();

    if (!packageId) {
      return { success: false, error: "ID Paket langganan wajib disertakan." };
    }

    const pkg = await findPackageById(packageId);
    if (!pkg) {
      return { success: false, error: "Paket langganan tidak ditemukan atau tidak aktif." };
    }

    if (pkg.price <= 0) {
      return { success: false, error: "Paket gratis tidak memerlukan transaksi pembayaran." };
    }

    // Order ID unik: IKARA-[ShortUserID]-[Timestamp]
    const shortUserId = user.id.substring(0, 6).toUpperCase();
    const orderId = `IKARA-${shortUserId}-${Date.now()}`;

    const snapResult = await createSnapTransaction({
      orderId,
      amount: pkg.price,
      userEmail: user.email,
      userName: user.name,
      packageName: pkg.name,
    });

    await createTransaction({
      userId: user.id,
      packageId: pkg.id,
      amount: pkg.price,
      midtransOrderId: orderId,
      midtransToken: snapResult.token,
      paymentUrl: snapResult.redirect_url,
      status: "PENDING",
    });

    return {
      success: true,
      data: {
        token: snapResult.token,
        redirectUrl: snapResult.redirect_url,
        orderId,
      },
    };
  } catch (error) {
    console.error("Error createCheckoutAction:", error);
    return { success: false, error: error.message || "Terjadi kesalahan saat memproses pembayaran." };
  }
}
