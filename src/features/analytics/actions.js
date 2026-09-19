"use server";

import crypto from "crypto";
import { headers } from "next/headers";
import { createVisitorLog } from "@/features/analytics/repository";

/**
 * Server Action: Mencatat kunjungan halaman undangan.
 * Menggantikan endpoint POST /api/v1/analytics/visit.
 * IP di-hash (SHA256) sebelum disimpan demi privasi.
 */
export async function logVisitAction({ invitationId, referrer } = {}) {
  try {
    if (!invitationId) {
      return { success: false, error: "Invitation ID wajib disertakan." };
    }

    const h = await headers();
    const rawIp =
      h.get("cf-connecting-ip") ||
      h.get("x-real-ip") ||
      h.get("x-forwarded-for")?.split(",")[0].trim() ||
      "127.0.0.1";

    const hashedIp = crypto.createHash("sha256").update(rawIp).digest("hex");
    const userAgent = h.get("user-agent") || "Unknown Device";

    await createVisitorLog({
      invitationId,
      ipAddress: hashedIp,
      userAgent,
      referrer: referrer || "Direct Visit",
    });

    return { success: true };
  } catch (error) {
    console.error("Error logVisitAction:", error);
    return { success: false, error: "Gagal mencatat kunjungan." };
  }
}
