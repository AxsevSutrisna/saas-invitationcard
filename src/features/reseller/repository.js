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
  // Agregasi di DB (groupBy + _sum) alih-alih menjumlah di JS.
  const grouped = await db.resellerCredit.groupBy({
    by: ["packageId"],
    where: { agencyUserId },
    _sum: { quantityTotal: true, quantityUsed: true },
  });
  const summary = {};
  for (const g of grouped) {
    summary[g.packageId] = (g._sum.quantityTotal || 0) - (g._sum.quantityUsed || 0);
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

// Catatan: pemakaian kredit (quantityUsed++) di-update langsung di dalam
// transaksi `allocateResellerCreditAction` memakai klien `tx`, jadi tidak ada
// helper terpisah di sini (agar operasi tetap atomik dengan pembuatan entitlement).
