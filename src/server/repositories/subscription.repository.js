import "server-only";
import { db } from "@/lib/db";

export async function findPackageBySlug(slug) {
  return db.package.findUnique({
    where: { slug, isActive: true },
  });
}

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

export async function createSubscription(data) {
  return db.subscription.create({
    data: {
      userId: data.userId,
      packageId: data.packageId,
      validUntil: data.validUntil,
      status: "ACTIVE",
    },
  });
}

export async function updateSubscriptionStatus(id, status) {
  return db.subscription.update({
    where: { id },
    data: { status },
  });
}

export async function incrementSubscriptionQuota(id) {
  return db.subscription.update({
    where: { id },
    data: {
      quotaUsed: {
        increment: 1,
      },
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
