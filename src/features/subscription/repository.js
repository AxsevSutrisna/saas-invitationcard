import "server-only";
import { db } from "@/lib/db";

export async function findPackageById(id) {
  return db.package.findUnique({
    where: { id, isActive: true },
  });
}

export async function findAllActivePackages() {
  return db.package.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });
}

export async function findActiveSubscriptionByUserId(userId) {
  return db.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      validUntil: {
        gt: new Date(),
      },
    },
    include: {
      package: true,
    },
  });
}

export async function upsertActiveSubscription({ userId, packageId, durationDays }) {
  const now = new Date();
  const validUntil = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

  // Cari jika ada langganan aktif saat ini
  const activeSub = await db.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      validUntil: { gt: now },
    },
  });

  if (activeSub) {
    if (activeSub.packageId === packageId) {
      // Jika paket sama, perpanjang masa aktifnya
      const newValidUntil = new Date(activeSub.validUntil.getTime() + durationDays * 24 * 60 * 60 * 1000);
      return db.subscription.update({
        where: { id: activeSub.id },
        data: { validUntil: newValidUntil },
      });
    } else {
      // Jika paket berbeda (upgrade/migrasi), nonaktifkan langganan lama
      await db.subscription.update({
        where: { id: activeSub.id },
        data: { status: "EXPIRED" },
      });
    }
  }

  // Buat langganan baru yang aktif
  return db.subscription.create({
    data: {
      userId,
      packageId,
      startDate: now,
      validUntil,
      status: "ACTIVE",
      quotaUsed: 0,
    },
  });
}

/**
 * Mencabut (membatalkan) langganan aktif milik user untuk paket tertentu.
 * Dipakai saat transaksi di-refund/chargeback. Aman/no-op bila tidak ada
 * langganan aktif yang cocok.
 * @returns {Promise<number>} jumlah langganan yang dibatalkan
 */
export async function revokeActiveSubscription({ userId, packageId }) {
  const result = await db.subscription.updateMany({
    where: {
      userId,
      packageId,
      status: "ACTIVE",
    },
    data: { status: "CANCELLED" },
  });
  return result.count;
}
