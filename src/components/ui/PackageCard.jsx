import { FeatureList } from "./FeatureList";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * PackageCard — kartu paket seragam: nama + badge + harga/periode + daftar fitur
 * + slot aksi. Fleksibel lewat slot `headerRight` (tombol di samping harga) dan
 * `footer` (tombol di bawah), agar muat beragam layout kartu paket.
 *
 * @param {object} props
 * @param {import("react").ReactNode} props.name
 * @param {import("react").ReactNode} [props.badges] badge di samping nama
 * @param {number|string} props.price  angka (diformat Rupiah) atau node
 * @param {import("react").ReactNode} [props.period] teks kecil setelah harga
 * @param {import("react").ReactNode} [props.headerRight] elemen di kanan header (mis. tombol)
 * @param {string[]} [props.features] daftar fitur (FeatureList)
 * @param {number} [props.featuresMax]
 * @param {string} [props.featuresClassName]
 * @param {import("react").ReactNode} [props.footer] elemen aksi di bawah
 * @param {boolean} [props.highlighted]
 * @param {string} [props.className]
 */
export function PackageCard({
  name,
  badges,
  price,
  period,
  headerRight,
  features = [],
  featuresMax,
  featuresClassName,
  footer,
  highlighted = false,
  className,
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 p-4 transition-colors hover:border-gold-400/60",
        highlighted && "border-gold-400 ring-1 ring-gold-400/30",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
              {name}
            </h4>
            {badges}
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-heading text-xl font-extrabold text-foreground">
              {typeof price === "number" ? formatRupiah(price) : price}
            </span>
            {period && <span className="text-[11px] text-muted-foreground">{period}</span>}
          </div>
        </div>
        {headerRight}
      </div>

      {features.length > 0 && (
        <FeatureList
          items={features}
          max={featuresMax}
          className={cn("mt-3 space-y-1.5", featuresClassName)}
          itemClassName="text-[11px]"
        />
      )}

      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}
