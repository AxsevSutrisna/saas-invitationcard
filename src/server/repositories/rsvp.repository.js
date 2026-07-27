import "server-only";
import { db } from "@/lib/db";

/**
 * Repository - RSVP & Guest Messages Data Access Layer
 * Mengelola penyimpanan konfirmasi kehadiran tamu (RSVP) ke database Neon PostgreSQL.
 */

/**
 * Menyimpan data RSVP baru yang dikirimkan tamu secara publik
 */
export async function createPublicRsvp(data) {
  const { invitationId, name, attendance, pax = 1, message } = data;

  return db.rsvp.create({
    data: {
      invitationId,
      name,
      attendance, // "YES" | "NO" | "MAYBE"
      pax: parseInt(pax) || 1,
      message: message || null,
    },
  });
}

/**
 * Mengambil daftar ucapan/doa restu tamu berdasarkan ID Undangan (diurutkan terbaru dahulu)
 */
export async function getRsvpsByInvitationId(invitationId) {
  return db.rsvp.findMany({
    where: { invitationId },
    orderBy: { createdAt: "desc" },
  });
}
