import { CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Alert — banner notifikasi seragam (sukses / error / warning / info).
 * Menggantikan blok `role="alert"` + ikon + warna yang di-copy di banyak client.
 *
 * @param {object} props
 * @param {"success"|"error"|"warning"|"info"} [props.variant]
 * @param {boolean} [props.icon] tampilkan ikon (default true)
 * @param {import("react").ReactNode} [props.title]
 * @param {import("react").ReactNode} props.children pesan
 * @param {string} [props.className]
 */
const VARIANTS = {
  success: {
    cls: "border-emerald-300/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    Icon: CheckCircle,
  },
  error: {
    cls: "border-destructive/20 bg-destructive/10 text-destructive",
    Icon: AlertCircle,
  },
  warning: {
    cls: "border-amber-300/50 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    Icon: AlertTriangle,
  },
  info: {
    cls: "border-gold-400/25 bg-gold-50 text-gold-800 dark:border-gold-400/20 dark:bg-gold-400/10 dark:text-gold-200",
    Icon: Info,
  },
};

export function Alert({ variant = "info", icon = true, title, children, className }) {
  const v = VARIANTS[variant] || VARIANTS.info;
  const Icon = v.Icon;
  return (
    <div
      role="alert"
      className={cn("flex items-start gap-2 rounded-xl border px-4 py-3 text-xs", v.cls, className)}
    >
      {icon && <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
      <div className="min-w-0 space-y-0.5">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="leading-relaxed">{children}</div>}
      </div>
    </div>
  );
}
