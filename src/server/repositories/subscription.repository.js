import "server-only";
import { db } from "@/lib/db";

export async function findPackageBySlug(slug) {
  return db.package.findUnique({
    where: { slug, isActive: true },
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
