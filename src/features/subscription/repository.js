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

/**
 * Paket ECERAN (dibeli per undangan): PLAN/BUNDLE/ADDON berbayar sekali-bayar
 * yang aktif. Dipakai pemilih "Upgrade undangan ini" di dashboard — add-on
 * bersifat menumpuk pada entitlement yang ada.
 */
export async function findEceranPackages() {
  return db.package.findMany({
    where: {
      isActive: true,
      kind: { in: ["PLAN", "BUNDLE", "ADDON"] },
      saleType: "ONE_TIME",
      price: { gt: 0 },
    },
    orderBy: { sortOrder: "asc" },
  });
}

/**
 * Paket RESELLER aktif (dijual dengan harga grosir, dibeli sebagai kredit/batch).
 */
export async function findResellerPackages() {
  return db.package.findMany({
    where: { isActive: true, saleType: "RESELLER" },
    orderBy: { sortOrder: "asc" },
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
 * Menaikkan penghitung kuota terpakai (quotaUsed) sebuah langganan sebanyak 1.
 * Dipanggil saat sebuah undangan dibuat di bawah langganan tersebut.
 * @param {string} subscriptionId
 */
export async function incrementSubscriptionQuota(subscriptionId) {
  return db.subscription.update({
    where: { id: subscriptionId },
    data: { quotaUsed: { increment: 1 } },
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
