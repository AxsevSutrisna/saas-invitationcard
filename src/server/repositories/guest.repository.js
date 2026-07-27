import "server-only";
import { db } from "@/lib/db";
import crypto from "crypto";

/**
 * Generate a random 8-character unique hex code for guest identification
 */
export function generateUniqueCode() {
  return crypto.randomBytes(4).toString("hex");
}

/**
 * Create a single guest
 */
export async function createGuest({ invitationId, name, whatsapp }) {
  return db.guest.create({
    data: {
      invitationId,
      name,
      whatsapp: whatsapp || null,
      uniqueCode: generateUniqueCode(),
      isOpened: false,
    },
  });
}

/**
 * Create multiple guests in bulk
 * guestsList is an array of objects: { name, whatsapp }
 */
export async function createGuestsBulk(invitationId, guestsList) {
  // Generate codes and construct data
  const data = guestsList.map((g) => ({
    invitationId,
    name: g.name.trim(),
    whatsapp: g.whatsapp ? g.whatsapp.trim() : null,
    uniqueCode: generateUniqueCode(),
  }));

  // Prisma createMany is supported on PostgreSQL
  return db.guest.createMany({
    data,
    skipDuplicates: true,
  });
}

/**
 * Get all guests for an invitation, including their RSVP status
 */
export async function getGuestsByInvitationId(invitationId) {
  return db.guest.findMany({
    where: { invitationId },
    include: {
      rsvp: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Find a guest by uniqueCode
 */
export async function getGuestByCode(uniqueCode) {
  return db.guest.findUnique({
    where: { uniqueCode },
    include: { rsvp: true },
  });
}

/**
 * Update a guest's basic info (name, whatsapp)
 */
export async function updateGuest(guestId, data) {
  const { name, whatsapp } = data;
  return db.guest.update({
    where: { id: guestId },
    data: {
      name,
      whatsapp: whatsapp || null,
    },
  });
}

/**
 * Delete a guest
 */
export async function deleteGuest(guestId) {
  return db.guest.delete({
    where: { id: guestId },
  });
}

/**
 * Track when a guest opens the invitation
 */
export async function trackGuestOpen(uniqueCode) {
  // Find first to avoid crashing if uniqueCode is invalid
  const guest = await db.guest.findUnique({
    where: { uniqueCode },
  });

  if (!guest) return null;

  // Only update if not already opened to preserve the first open timestamp
  if (!guest.isOpened) {
    return db.guest.update({
      where: { uniqueCode },
      data: {
        isOpened: true,
        openedAt: new Date(),
      },
    });
  }

  return guest;
}
