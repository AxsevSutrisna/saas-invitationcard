import { Badge } from "./Badge";

/**
 * Peta status transaksi → label + varian Badge (SATU sumber, menghilangkan
 * mapping yang sebelumnya di-copy & tidak konsisten antar tabel).
 */
export const TRANSACTION_STATUS_META = {
  SUCCESS: { label: "Sukses", variant: "success" },
  PENDING: { label: "Pending", variant: "neutral" },
  FAILED: { label: "Gagal", variant: "danger" },
  REFUNDED: { label: "Refund", variant: "danger" },
};

/**
 * StatusBadge — render Badge berdasarkan status + peta meta.
 * @param {object} props
 * @param {string} props.status
 * @param {Record<string,{label:string,variant:string}>} [props.meta]
 * @param {string} [props.fallbackVariant]
 */
export function StatusBadge({ status, meta = TRANSACTION_STATUS_META, fallbackVariant = "neutral" }) {
  const m = meta[status] || { label: status, variant: fallbackVariant };
  return <Badge variant={m.variant}>{m.label}</Badge>;
}
