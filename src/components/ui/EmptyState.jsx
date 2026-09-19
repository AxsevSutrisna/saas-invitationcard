import { cn } from "@/lib/utils";

/**
 * EmptyState — kartu "kosong" seragam (mis. "Belum Ada Undangan").
 * Menggantikan tiga salinan blok empty-state di dashboard/guests/analytics.
 *
 * Props:
 * - icon: komponen ikon Lucide (bukan elemen) — dirender di dalam medali emas.
 * - title, description: teks.
 * - action: node tombol/CTA (opsional).
 */
export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex min-h-105 flex-col items-center justify-center gap-6 rounded-3xl border border-border/60 bg-card p-8 text-center shadow-(--shadow-gold-sm) sm:p-12",
        className
      )}
    >
      {Icon && (
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-gold-400/30 bg-linear-to-tr from-gold-400/20 to-gold-100 text-gold-500 shadow-inner dark:from-gold-400/20 dark:to-zinc-800">
          <Icon className="h-10 w-10 stroke-[1.5]" aria-hidden="true" />
        </div>
      )}
      <div className="max-w-md space-y-2">
        <h2 className="font-heading text-2xl font-bold text-foreground">{title}</h2>
        {description && (
          <p className="text-sm font-light leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}
