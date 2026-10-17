"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/features/auth/guard";
import { db } from "@/lib/db";
import { ROLES } from "@/constants/roles";
import { getPackageFeatureMap } from "@/features/entitlement/service";
import { findAvailableCreditBatch } from "@/features/reseller/repository";

/** Hanya AGENCY (dan SUPER_ADMIN) yang boleh mengelola kredit reseller. */
function isAgencyOrAdmin(role) {
  return role === ROLES.AGENCY || role === ROLES.SUPER_ADMIN;
}

/**
 * Alokasikan 1 kredit reseller ke sebuah undangan klien → terbitkan
 * Entitlement(RESELLER) & naikkan pemakaian kredit, atomik dalam satu transaksi.
 * @param {{ invitationId: string, packageId: string }} params
 */
export async function allocateResellerCreditAction({ invitationId, packageId }) {
  try {
    const user = await requireSession();
    if (!isAgencyOrAdmin(user.role)) {
      return { success: false, error: "Hanya akun Agency/Reseller yang dapat mengalokasikan kredit." };
    }
    if (!invitationId || !packageId) {
      return { success: false, error: "Undangan dan paket wajib dipilih." };
    }

    const invitation = await db.invitation.findUnique({
      where: { id: invitationId },
      select: { id: true, userId: true },
    });
    if (!invitation || invitation.userId !== user.id) {
      return { success: false, error: "Undangan tidak ditemukan atau bukan milik Anda." };
    }

    const batch = await findAvailableCreditBatch(user.id, packageId);
    if (!batch) {
      return { success: false, error: "Kredit untuk paket ini sudah habis. Silakan beli kredit terlebih dahulu." };
    }

    // Snapshot fitur paket (termasuk gabungan BUNDLE) + masa aktif — dibaca di
    // luar transaksi agar transaksi tetap singkat.
    const featuresSnapshot = await getPackageFeatureMap(packageId);
    const pkg = await db.package.findUnique({
      where: { id: packageId },
      select: { durationDays: true },
    });
    const days = pkg?.durationDays ?? 180;
    const validUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    await db.$transaction(async (tx) => {
      // Re-cek sisa di dalam transaksi (cegah over-alokasi ringan).
      const fresh = await tx.resellerCredit.findUnique({ where: { id: batch.id } });
      if (!fresh || fresh.quantityUsed >= fresh.quantityTotal) {
        throw new Error("Kredit habis saat proses alokasi. Silakan coba lagi.");
      }
      await tx.resellerCredit.update({
        where: { id: batch.id },
        data: { quantityUsed: { increment: 1 } },
      });
      await tx.entitlement.create({
        data: {
          invitationId,
          ownerUserId: user.id,
          packageId,
          source: "RESELLER",
          status: "ACTIVE",
          validUntil,
          featuresSnapshot,
        },
      });
    });

    revalidatePath("/dashboard/reseller");
    revalidatePath("/dashboard");
    return { success: true, message: "Kredit berhasil dialokasikan ke undangan." };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
