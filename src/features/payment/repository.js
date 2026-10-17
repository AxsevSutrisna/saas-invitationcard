import "server-only";
import { db } from "@/lib/db";

/**
 * Membuat data transaksi baru di database
 */
export async function createTransaction({
  userId,
  packageId,
  invitationId = null,
  amount,
  quantity = 1,
  midtransOrderId,
  midtransToken,
  paymentUrl,
  status = "PENDING",
}) {
  return db.transaction.create({
    data: {
      userId,
      packageId,
      invitationId,
      amount,
      quantity,
      midtransOrderId,
      midtransToken,
      paymentUrl,
      status,
    },
  });
}

/**
 * Mencari data transaksi berdasarkan ID pesanan Midtrans
 */
export async function findTransactionByOrderId(midtransOrderId) {
  return db.transaction.findUnique({
    where: { midtransOrderId },
    // `user` tak dipakai handler webhook (hanya userId/packageId/amount/status +
    // package.durationDays) → jangan ikut tarik baris user penuh.
    include: { package: true },
  });
}

/**
 * Memperbarui status transaksi beserta metadata pembayaran opsional.
 * @param {string} midtransOrderId
 * @param {string} status - PENDING | SUCCESS | FAILED | REFUNDED
 * @param {{ paidAt?: Date|null, midtransTransactionId?: string, paymentType?: string }} [meta]
 */
export async function updateTransactionStatus(midtransOrderId, status, meta = {}) {
  const { paidAt = null, midtransTransactionId, paymentType } = meta;
  return db.transaction.update({
    where: { midtransOrderId },
    data: {
      status,
      paidAt,
      // Hanya set bila tersedia (hindari menimpa nilai lama dengan undefined/null)
      ...(midtransTransactionId ? { midtransTransactionId } : {}),
      ...(paymentType ? { paymentType } : {}),
    },
  });
}

/**
 * Mengambil seluruh riwayat transaksi milik pengguna tertentu
 */
export async function findTransactionsByUserId(userId) {
  return db.transaction.findMany({
    where: { userId },
    include: {
      package: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
