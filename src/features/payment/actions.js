"use server";

import { requireSession } from "@/features/auth/guard";
import { db } from "@/lib/db";
import { ROLES } from "@/constants/roles";
import { createSnapTransaction } from "@/features/payment/services/midtrans";
import { findPackageById } from "@/features/subscription/repository";
import { createTransaction } from "@/features/payment/repository";

/**
 * Server Action: Membuat transaksi checkout (Midtrans Snap).
 *
 * Tiga mode (ditentukan oleh options + saleType paket):
 *   - Langganan (tanpa invitationId, saleType ≠ RESELLER): aktifkan Subscription.
 *   - Eceran per-undangan (dengan invitationId): terbitkan Entitlement(PURCHASE)
 *     yang terikat ke undangan tersebut.
 *   - Reseller (paket saleType RESELLER, dengan quantity): tambah batch kredit
 *     ResellerCredit (harga grosir × quantity). Hanya AGENCY/SUPER_ADMIN.
 *
 * @param {string} packageId
 * @param {{ invitationId?: string, quantity?: number }} [options]
 */
export async function createCheckoutAction(packageId, options = {}) {
  try {
    const user = await requireSession();
    const { invitationId = null, quantity = 1 } = options;

    if (!packageId) {
      return { success: false, error: "ID Paket wajib disertakan." };
    }

    const pkg = await findPackageById(packageId);
    if (!pkg) {
      return { success: false, error: "Paket tidak ditemukan atau tidak aktif." };
    }

    const isReseller = pkg.saleType === "RESELLER";

    // Hitung nominal & jumlah lisensi sesuai mode.
    let qty = 1;
    let amount = pkg.price;

    if (isReseller) {
      if (user.role !== ROLES.AGENCY && user.role !== ROLES.SUPER_ADMIN) {
        return { success: false, error: "Pembelian kredit reseller hanya untuk akun Agency." };
      }
      qty = Math.max(1, parseInt(quantity) || 1);
      const unit = pkg.wholesalePrice ?? pkg.price; // harga grosir bila ada
      amount = unit * qty;
    }

    if (amount <= 0) {
      return { success: false, error: "Paket ini tidak memerlukan transaksi pembayaran." };
    }

    // Mode eceran: pastikan undangan ada & milik user ini (cegah beli untuk
    // undangan orang lain). Diabaikan untuk pembelian reseller.
    const effectiveInvitationId = isReseller ? null : invitationId;
    if (effectiveInvitationId) {
      const invitation = await db.invitation.findUnique({
        where: { id: effectiveInvitationId },
        select: { id: true, userId: true },
      });
      if (!invitation || invitation.userId !== user.id) {
        return { success: false, error: "Undangan tidak ditemukan atau bukan milik Anda." };
      }
    }

    // Order ID unik: IKARA-[ShortUserID]-[Timestamp]
    const shortUserId = user.id.substring(0, 6).toUpperCase();
    const orderId = `IKARA-${shortUserId}-${Date.now()}`;

    // URL redirect finish (untuk mode Snap redirect); aman jika env kosong
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    const finishUrl = appUrl ? `${appUrl}/payment/finish` : undefined;

    const snapResult = await createSnapTransaction({
      orderId,
      amount,
      userEmail: user.email,
      userName: user.name,
      packageName: isReseller ? `${pkg.name} x${qty} (Reseller)` : pkg.name,
      finishUrl,
    });

    await createTransaction({
      userId: user.id,
      packageId: pkg.id,
      invitationId: effectiveInvitationId,
      amount,
      quantity: qty,
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
