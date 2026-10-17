import "server-only";
import { db } from "@/lib/db";

/**
 * Repository - Reseller Credit Data Access Layer.
 * Kredit = lisensi yang dibeli AGENCY (harga grosir) untuk dialokasikan ke
 * undangan klien. Satu baris ResellerCredit = satu batch pembelian.
 */

/** Seluruh batch kredit milik sebuah agency, beserta info paket. */
export async function findResellerCreditsByAgency(agencyUserId) {
  return db.resellerCredit.findMany({
    where: { agencyUserId },
    include: {
      package: {
        select: { id: true, name: true, slug: true, durationDays: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Batch kredit TERLAMA milik agency untuk sebuah paket yang masih punya sisa
 * (quantityUsed < quantityTotal). Dipakai saat alokasi.
 */
export async function findAvailableCreditBatch(agencyUserId, packageId) {
  const batches = await db.resellerCredit.findMany({
    where: { agencyUserId, packageId },
    orderBy: { createdAt: "asc" },
  });
  return batches.find((b) => b.quantityUsed < b.quantityTotal) || null;
}

/** Ringkasan sisa kredit per paket milik agency: { packageId: available }. */
export async function getCreditSummaryByAgency(agencyUserId) {
  const batches = await db.resellerCredit.findMany({
    where: { agencyUserId },
    select: { packageId: true, quantityTotal: true, quantityUsed: true },
  });
  const summary = {};
  for (const b of batches) {
    summary[b.packageId] = (summary[b.packageId] || 0) + (b.quantityTotal - b.quantityUsed);
  }
  return summary;
}

/** Buat batch kredit baru (dipanggil webhook saat pembayaran reseller sukses). */
export async function createResellerCredit({ agencyUserId, packageId, quantityTotal, transactionId }) {
  return db.resellerCredit.create({
    data: {
      agencyUserId,
      packageId,
      quantityTotal: Math.max(1, quantityTotal || 1),
      transactionId: transactionId || null,
    },
  });
}

/** Naikkan pemakaian sebuah batch kredit sebanyak 1 (saat alokasi). */
export async function incrementCreditUsed(creditId) {
  return db.resellerCredit.update({
    where: { id: creditId },
    data: { quantityUsed: { increment: 1 } },
  });
}
