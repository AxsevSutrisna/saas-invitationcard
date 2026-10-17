import "server-only";
import { db } from "@/lib/db";

/**
 * Repository - Entitlement Data Access Layer.
 * Mengelola akses tabel Entitlement, Feature, PackageFeature via Prisma.
 */

// Bentuk relasi paket + fitur yang dipakai berulang untuk membangun snapshot.
// Untuk BUNDLE, ikut tarik fitur tiap item agar bisa digabung.
const packageFeatureInclude = {
  packageFeatures: { include: { feature: true } },
  bundleItems: {
    include: {
      item: { include: { packageFeatures: { include: { feature: true } } } },
    },
  },
};

/** Ambil paket beserta relasi fitur (untuk membangun peta/snapshot fitur). */
export async function findPackageWithFeatures(packageId) {
  if (!packageId) return null;
  return db.package.findUnique({
    where: { id: packageId },
    include: packageFeatureInclude,
  });
}

/**
 * Entitlement AKTIF (belum kedaluwarsa) untuk sebuah undangan — sumber gating
 * per-undangan. Mengembalikan yang masa berlakunya paling panjang bila ada > 1.
 */
export async function findActiveEntitlementByInvitationId(invitationId) {
  return db.entitlement.findFirst({
    where: {
      invitationId,
      status: "ACTIVE",
      validUntil: { gt: new Date() },
    },
    orderBy: { validUntil: "desc" },
  });
}

/**
 * SELURUH entitlement aktif sebuah undangan — dipakai untuk menggabungkan hak
 * dari paket dasar + add-on (fitur bertumpuk).
 */
export async function findActiveEntitlementsByInvitationId(invitationId) {
  return db.entitlement.findMany({
    where: {
      invitationId,
      status: "ACTIVE",
      validUntil: { gt: new Date() },
    },
    orderBy: { validUntil: "desc" },
  });
}

/** Buat satu baris entitlement baru. */
export async function createEntitlement(data) {
  return db.entitlement.create({ data });
}

/**
 * Cabut (REVOKE) seluruh entitlement aktif milik sebuah undangan.
 * Dipakai mis. saat transaksi di-refund. Aman/no-op bila tidak ada yang aktif.
 * @returns {Promise<number>} jumlah entitlement yang dicabut
 */
export async function revokeEntitlementsByInvitationId(invitationId) {
  const result = await db.entitlement.updateMany({
    where: { invitationId, status: "ACTIVE" },
    data: { status: "REVOKED" },
  });
  return result.count;
}

/**
 * Cabut (REVOKE) entitlement aktif yang berasal dari sebuah transaksi.
 * Dipakai saat pembelian eceran di-refund. Aman/no-op bila tidak ada yang cocok.
 * @returns {Promise<number>} jumlah entitlement yang dicabut
 */
export async function revokeEntitlementsByTransactionId(transactionId) {
  if (!transactionId) return 0;
  const result = await db.entitlement.updateMany({
    where: { transactionId, status: "ACTIVE" },
    data: { status: "REVOKED" },
  });
  return result.count;
}

/**
 * Hitung entitlement aktif milik seorang owner (mis. kuota lisensi reseller).
 * Bisa difilter per sumber (PURCHASE/SUBSCRIPTION/RESELLER/ADMIN).
 */
export async function countActiveEntitlementsByOwner(ownerUserId, source) {
  return db.entitlement.count({
    where: {
      ownerUserId,
      status: "ACTIVE",
      validUntil: { gt: new Date() },
      ...(source ? { source } : {}),
    },
  });
}
