import "server-only";
import { db } from "@/lib/db";

/**
 * Membuat data transaksi baru di database
 */
export async function createTransaction({
  userId,
  packageId,
  amount,
  midtransOrderId,
  midtransToken,
  paymentUrl,
  status = "PENDING",
}) {
  return db.transaction.create({
    data: {
      userId,
      packageId,
      amount,
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
    include: {
      package: true,
      user: true,
    },
  });
}

/**
 * Memperbarui status transaksi
 */
export async function updateTransactionStatus(midtransOrderId, status, paidAt = null) {
  return db.transaction.update({
    where: { midtransOrderId },
    data: {
      status,
      paidAt,
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
