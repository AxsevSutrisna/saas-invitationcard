"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { createCheckoutAction } from "@/features/payment/actions";

/**
 * useMidtransSnap — orkestrasi checkout Snap seragam (menggantikan handler
 * `createCheckoutAction → window.snap.pay` yang di-copy di 3 komponen).
 *
 * @returns {{ pay: Function, loadingId: string|null }}
 *   `pay(packageId, { quantity?, invitationId?, onError?, onSuccess? })`
 *   `loadingId` = packageId yang sedang diproses (untuk state tombol).
 */
export function useMidtransSnap() {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState(null);

  const pay = useCallback(
    async (packageId, { quantity, invitationId, onError, onSuccess } = {}) => {
      try {
        setLoadingId(packageId);

        const result = await createCheckoutAction(packageId, { quantity, invitationId });
        if (!result.success) {
          throw new Error(result.error || "Gagal membuat transaksi.");
        }

        if (typeof window === "undefined" || !window.snap) {
          throw new Error("Midtrans Snap belum siap. Muat ulang halaman lalu coba lagi.");
        }

        window.snap.pay(result.data.token, {
          onSuccess: () => {
            onSuccess?.();
            router.refresh();
          },
          onPending: () => {
            onSuccess?.();
            router.refresh();
          },
          onError: () => onError?.("Pembayaran gagal diproses oleh Midtrans."),
          onClose: () => {},
        });
      } catch (e) {
        onError?.(e.message || "Terjadi kesalahan pembayaran.");
      } finally {
        setLoadingId(null);
      }
    },
    [router]
  );

  return { pay, loadingId };
}
