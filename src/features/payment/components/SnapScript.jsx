import Script from "next/script";
import { SNAP_SCRIPT_URL, SNAP_CLIENT_KEY } from "@/features/payment/snap-config";

/**
 * SnapScript — memuat SDK Midtrans Snap sekali. Taruh satu kali di halaman yang
 * memakai pembayaran (menggantikan `<Script src=...>` yang di-copy di 3 tempat).
 */
export function SnapScript() {
  return (
    <Script src={SNAP_SCRIPT_URL} data-client-key={SNAP_CLIENT_KEY} strategy="lazyOnload" />
  );
}
