/**
 * Konfigurasi Midtrans Snap (frontend) — SATU sumber untuk URL SDK & client key,
 * menggantikan konstanta yang sebelumnya didefinisikan ulang di tiap komponen.
 */
export const SNAP_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";

export const SNAP_SCRIPT_URL = SNAP_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

export const SNAP_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
