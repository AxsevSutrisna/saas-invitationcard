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
  midtransToken = null,
  paymentType = null,
  paymentUrl = null,
  paymentMeta = null,
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
      ...(paymentType ? { paymentType } : {}),
      ...(paymentMeta ? { paymentMeta } : {}),
    },
  });
}

/**
 * Klaim transisi status transaksi secara atomik (idempotensi "exactly-once").
 * Hanya berhasil bila status saat ini masih `fromStatus` — mencegah pemenuhan
 * ganda saat webhook & polling status berjalan bersamaan.
 * @returns {Promise<number>} 1 bila berhasil mengklaim, 0 bila sudah diproses pihak lain
 */
export async function claimTransactionTransition(orderId, fromStatus, toStatus, meta = {}) {
  const { paidAt = null, midtransTransactionId, paymentType } = meta;
  const result = await db.transaction.updateMany({
    where: { midtransOrderId: orderId, status: fromStatus },
    data: {
      status: toStatus,
      paidAt,
      ...(midtransTransactionId ? { midtransTransactionId } : {}),
      ...(paymentType ? { paymentType } : {}),
    },
  });
  return result.count;
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
