import { cn } from "@/lib/utils";

/**
 * SectionHeading — judul section seragam: ikon + judul (+ jumlah) + aksi opsional.
 * Menyatukan dua gaya header yang sebelumnya di-copy (border-bawah tebal vs
 * judul + hitungan + tombol "Tambah").
 *
 * @param {object} props
 * @param {import("react").ElementType} [props.icon] komponen ikon lucide
 * @param {import("react").ReactNode} props.title
 * @param {number|string} [props.count] angka kecil di samping judul
 * @param {import("react").ReactNode} [props.action] elemen aksi (mis. tombol) di kanan
 * @param {boolean} [props.divider] garis bawah + ukuran lebih besar (gaya kartu)
 * @param {string} [props.className]
 */
export function SectionHeading({ icon: Icon, title, count, action, divider = false, className }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3",
        divider && "border-b border-border/60 pb-3",
        className
      )}
    >
      <h3
        className={cn(
          "flex items-center gap-2 font-semibold text-foreground",
          divider ? "font-heading text-lg font-bold" : "text-sm"
        )}
      >
        {Icon && <Icon className="h-4 w-4 text-gold-500" aria-hidden="true" />}
        <span>{title}</span>
        {count != null && (
          <span className="text-xs font-normal text-muted-foreground">({count})</span>
        )}
      </h3>
      {action}
    </div>
  );
}
