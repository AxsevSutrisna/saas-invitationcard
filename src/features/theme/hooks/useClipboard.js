"use client";

import { useState } from "react";

/**
 * Hook clipboard bersama untuk kartu rekening/amplop digital.
 * Mengembalikan id yang baru disalin (untuk state tombol "Tersalin!").
 * @param {number} resetMs - durasi sebelum status "tersalin" direset
 */
export function useClipboard(resetMs = 2500) {
  const [copiedId, setCopiedId] = useState(null);

  const copy = (text, id) => {
    try {
      navigator.clipboard.writeText(text ?? "");
    } catch {
      // abaikan (mis. konteks non-secure)
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), resetMs);
  };

  return { copiedId, copy };
}
