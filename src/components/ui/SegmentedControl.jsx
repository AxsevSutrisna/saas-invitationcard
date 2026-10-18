import { cn } from "@/lib/utils";

/**
 * SegmentedControl — pengalih bergaya segmen (tab) untuk pilihan singkat
 * (mis. sumber gambar: Unggah / URL). Menggantikan tombol role="tab" manual.
 *
 * @param {object} props
 * @param {(string|{value:string,label:import("react").ReactNode})[]} props.options
 * @param {string} props.value
 * @param {(value:string)=>void} props.onChange
 * @param {boolean} [props.fullWidth] regangkan segmen memenuhi lebar induk
 * @param {string} [props.ariaLabel]
 * @param {string} [props.className]
 */
export function SegmentedControl({ options = [], value, onChange, fullWidth = false, ariaLabel, className }) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn("rounded-xl border border-border bg-muted/40 p-0.5", fullWidth ? "flex w-full" : "inline-flex", className)}
    >
      {options.map((opt) => {
        const val = typeof opt === "string" ? opt : opt.value;
        const label = typeof opt === "string" ? opt : opt.label;
        const active = val === value;
        return (
          <button
            key={val}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(val)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60",
              fullWidth && "flex-1",
              active
                ? "bg-gold-400 text-white shadow-sm"
                : "text-muted-foreground hover:text-gold-600 dark:hover:text-gold-300"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
