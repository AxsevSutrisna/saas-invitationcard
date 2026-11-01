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
  countGuestsByInvitationId,
} from "@/features/guest/repository";
import { getInvitationOwner } from "@/features/invitation/repository";
import { getFeaturesForInvitation } from "@/features/entitlement/service";
import { getQuota } from "@/features/entitlement/featureMap";
import { FEATURE_KEYS } from "@/features/entitlement/constants";
import {
  guestSchema,
  updateGuestSchema,
  bulkGuestSchema,
} from "@/features/guest/schema";

/**
 * Cek sisa kuota tamu sebuah undangan (MAX_GUESTS pada peta fitur efektifnya).
 * @returns {Promise<{ allowed: boolean, used: number, limit: number }>}
 */
async function checkGuestQuota(invitation, adding = 1) {
  const map = await getFeaturesForInvitation(invitation);
  const limit = getQuota(map, FEATURE_KEYS.MAX_GUESTS);
  const used = await countGuestsByInvitationId(invitation.id);
  return { allowed: used + adding <= limit, used, limit };
}

/** Label kuota tamu untuk pesan error (∞ bila tak terbatas). */
function guestLimitLabel(limit) {
  return limit === Infinity ? "∞" : limit;
}

/**
 * Action: Create a single guest
 */
export async function createGuestAction(payload) {
  try {
    const validatedData = guestSchema.parse(payload);

    // Otorisasi: hanya pemilik undangan induk yang boleh menambah tamu.
    const invitation = await getInvitationOwner(validatedData.invitationId);
    await authorize("guest:create", invitation);

    // Penegakan kuota tamu (MAX_GUESTS) sesuai hak akses undangan.
    const quota = await checkGuestQuota(
      { id: validatedData.invitationId, userId: invitation.userId },
      1
    );
    if (!quota.allowed) {
      return {
        success: false,
        error: `Kuota tamu undangan ini sudah penuh (${quota.used}/${guestLimitLabel(quota.limit)}). Upgrade paket untuk menambah tamu.`,
      };
    }

    const newGuest = await createGuest(validatedData);

    revalidatePath("/dashboard/guests");
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

    // Penegakan kuota tamu (MAX_GUESTS) untuk seluruh batch sekaligus.
    const quota = await checkGuestQuota(
      { id: invitationId, userId: invitation.userId },
      lines.length
    );
    if (!quota.allowed) {
      const sisa = quota.limit === Infinity ? "∞" : Math.max(0, quota.limit - quota.used);
      return {
        success: false,
        error: `Melebihi kuota tamu undangan ini (${quota.used}/${guestLimitLabel(quota.limit)}). Sisa slot: ${sisa}, sedang menambah ${lines.length}. Upgrade paket untuk menambah lebih banyak.`,
      };
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

    revalidatePath("/dashboard/guests");
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

    revalidatePath("/dashboard/guests");
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

    revalidatePath("/dashboard/guests");
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
    // Best-effort (fire-and-forget dari halaman publik). count 0 = sudah dibuka
    // atau kode tak dikenal — bukan error yang perlu dilaporkan ke pengunjung.
    await trackGuestOpen(uniqueCode);
    return { success: true };
  } catch (error) {
    console.error("Error trackGuestOpenAction:", error);
    return { success: false, error: "Gagal melacak pembukaan undangan." };
  }
}
