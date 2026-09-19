import "server-only";
import { db } from "@/lib/db";

/**
 * Repository - Analytics Data Access Layer
 */

/**
 * Mencatat log kunjungan halaman undangan.
 */
export async function createVisitorLog(data) {
  return db.visitorLog.create({ data });
}

/**
 * Mengambil daftar RSVP beserta data tamu untuk sebuah undangan.
 */
export async function getRsvpsWithGuestByInvitationId(invitationId) {
  return db.rSVP.findMany({
    where: { invitationId },
    include: { guest: true },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Menghitung jumlah tamu yang belum mengisi RSVP.
 */
export async function countGuestsWithoutRsvp(invitationId) {
  return db.guest.count({
    where: { invitationId, rsvp: null },
  });
}
