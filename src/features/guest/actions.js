"use server";

import { revalidatePath } from "next/cache";
import { authorize } from "@/features/auth/guard";
import {
  createGuest,
  createGuestsBulk,
  updateGuest,
  deleteGuest,
  trackGuestOpen,
  getGuestByCode,
  getGuestWithOwner,
} from "@/features/guest/repository";
import { getInvitationOwner } from "@/features/invitation/repository";
import {
  guestSchema,
  updateGuestSchema,
  bulkGuestSchema,
} from "@/features/guest/schema";

/**
 * Action: Create a single guest
 */
export async function createGuestAction(payload) {
  try {
    const validatedData = guestSchema.parse(payload);

    // Otorisasi: hanya pemilik undangan induk yang boleh menambah tamu.
    const invitation = await getInvitationOwner(validatedData.invitationId);
    await authorize("guest:create", invitation);

    const newGuest = await createGuest(validatedData);

    revalidatePath("/dashboard/invitations/new");
    return { success: true, data: newGuest };
  } catch (error) {
    console.error("Error createGuestAction:", error);
    return {
      success: false,
      error: error.errors?.[0]?.message || error.message || "Gagal menambah tamu.",
    };
  }
}

/**
 * Action: Create guests in bulk from raw text (one per line, supports "Name, WA")
 */
export async function createGuestsBulkAction(payload) {
  try {
    const { invitationId, rawNames } = bulkGuestSchema.parse(payload);

    // Otorisasi: hanya pemilik undangan induk yang boleh menambah tamu.
    const invitation = await getInvitationOwner(invitationId);
    await authorize("guest:create", invitation);

    // Parse names from text lines
    const lines = rawNames
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      return { success: false, error: "Tidak ada Tamu Undangan yang valid." };
    }

    const guestsList = lines.map((line) => {
      const parts = line.split(",");
      if (parts.length > 1) {
        return {
          name: parts[0].trim(),
          whatsapp: parts[1].trim(),
        };
      }
      return {
        name: line,
        whatsapp: null,
      };
    });

    await createGuestsBulk(invitationId, guestsList);

    revalidatePath("/dashboard/invitations/new");
    return { success: true };
  } catch (error) {
    console.error("Error createGuestsBulkAction:", error);
    return {
      success: false,
      error: error.errors?.[0]?.message || error.message || "Gagal menambah tamu massal.",
    };
  }
}

/**
 * Action: Update guest info
 */
export async function updateGuestAction(guestId, payload) {
  try {
    const validatedData = updateGuestSchema.parse(payload);

    // Otorisasi: hanya pemilik undangan induk yang boleh mengubah tamu.
    const guest = await getGuestWithOwner(guestId);
    await authorize("guest:update", guest);

    const updated = await updateGuest(guestId, validatedData);

    revalidatePath("/dashboard/invitations/new");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updateGuestAction:", error);
    return {
      success: false,
      error: error.errors?.[0]?.message || error.message || "Gagal memperbarui data tamu.",
    };
  }
}

/**
 * Action: Delete guest
 */
export async function deleteGuestAction(guestId) {
  try {
    // Otorisasi: hanya pemilik undangan induk yang boleh menghapus tamu.
    const guest = await getGuestWithOwner(guestId);
    await authorize("guest:delete", guest);

    await deleteGuest(guestId);

    revalidatePath("/dashboard/invitations/new");
    return { success: true };
  } catch (error) {
    console.error("Error deleteGuestAction:", error);
    return { success: false, error: "Gagal menghapus tamu." };
  }
}

/**
 * Action: Get guest details by uniqueCode (Public)
 */
export async function getGuestByCodeAction(uniqueCode) {
  try {
    const guest = await getGuestByCode(uniqueCode);
    if (!guest) {
      return { success: false, error: "Tamu tidak ditemukan." };
    }
    return { success: true, data: guest };
  } catch (error) {
    console.error("Error getGuestByCodeAction:", error);
    return { success: false, error: "Gagal mengambil data tamu." };
  }
}

/**
 * Action: Track guest opening the invitation (Public)
 */
export async function trackGuestOpenAction(uniqueCode) {
  try {
    const result = await trackGuestOpen(uniqueCode);
    if (!result) {
      return { success: false, error: "Tamu tidak ditemukan." };
    }
    return { success: true };
  } catch (error) {
    console.error("Error trackGuestOpenAction:", error);
    return { success: false, error: "Gagal melacak pembukaan undangan." };
  }
}
