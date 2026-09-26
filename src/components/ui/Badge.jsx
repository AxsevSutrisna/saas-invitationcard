import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Badge — pill status seragam (PUBLISHED/DRAFT, nama tema, status transaksi).
 * Desain sendiri berbasis token; tidak memakai style komponen bawaan.
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide leading-none",
  {
    variants: {
      variant: {
        gold: "bg-gold-400 text-white",
        goldSoft: "bg-gold-100 text-gold-700 dark:bg-gold-400/15 dark:text-gold-300",
        success:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
        neutral:
          "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
        danger: "bg-destructive/10 text-destructive dark:bg-destructive/20",
        info: "bg-accent/10 text-accent dark:bg-accent/20",
      },
    },
    defaultVariants: { variant: "goldSoft" },
  }
);

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
