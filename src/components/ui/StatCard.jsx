import { Surface } from "./Surface";
import { cn } from "@/lib/utils";

/**
 * StatCard — kartu metrik seragam: medali ikon + label uppercase + nilai (+ suffix).
 * Menggantikan kartu statistik yang di-copy di Analytics & Admin.
 *
 * @param {object} props
 * @param {import("react").ElementType} [props.icon]
 * @param {import("react").ReactNode} props.label
 * @param {import("react").ReactNode} props.value  angka atau node kustom
 * @param {import("react").ReactNode} [props.suffix]  teks kecil setelah nilai
 * @param {"gold"|"accent"} [props.tone]  warna medali ikon
 * @param {string} [props.valueClassName]
 * @param {string} [props.className]
 */
const TONES = {
  gold: "bg-gold-100 text-gold-700 dark:bg-gold-400/15 dark:text-gold-300",
  accent: "bg-accent/10 text-accent dark:bg-accent/15",
};

export function StatCard({ icon: Icon, label, value, suffix, tone = "gold", valueClassName, className }) {
  return (
    <Surface as="article" className={cn("relative space-y-4 overflow-hidden", className)}>
      {Icon && (
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", TONES[tone] || TONES.gold)}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      )}
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className={cn("font-heading text-2xl font-bold text-foreground", valueClassName)}>
            {value}
          </span>
          {suffix && <span className="text-xs font-normal text-muted-foreground">{suffix}</span>}
        </div>
      </div>
    </Surface>
  );
}
