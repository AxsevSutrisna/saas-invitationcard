import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Button IKARA — desain sendiri (brand gold), bukan style bawaan library.
 * ButtonPrimitive dari base-ui hanya dipakai untuk perilaku & aksesibilitas
 * (headless, tanpa gaya); seluruh tampilan didefinisikan di sini via token gold-*.
 *
 * Varian:
 * - primary     : gradient emas (CTA utama) — mengganti semua tombol gradient inline.
 * - secondary   : permukaan emas lembut (aksi sekunder di area terang).
 * - outline     : garis emas tipis, isi transparan.
 * - ghost       : tanpa garis, hover emas lembut (aksi di toolbar/menu).
 * - destructive : merah mawar untuk hapus/keluar.
 * - link        : teks emas bergaris bawah.
 */
const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium tracking-tight transition-all duration-200 ease-out outline-none select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-gold-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:translate-y-px [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-linear-to-r from-gold-400 to-gold-500 text-white shadow-[0_4px_14px_rgba(200,169,106,0.25)] hover:from-gold-500 hover:to-gold-600 hover:shadow-[0_6px_20px_rgba(200,169,106,0.40)] hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "bg-gold-100 text-gold-700 hover:bg-gold-200 dark:bg-gold-400/15 dark:text-gold-300 dark:hover:bg-gold-400/25",
        outline:
          "border border-gold-400/40 bg-transparent text-foreground hover:border-gold-400 hover:bg-gold-400/10 hover:text-gold-600 dark:hover:text-gold-300",
        ghost:
          "bg-transparent text-muted-foreground hover:bg-gold-400/10 hover:text-gold-600 dark:hover:text-gold-300",
        destructive:
          "bg-rose-50 text-rose-600 hover:bg-rose-100 focus-visible:ring-rose-400/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/50",
        link: "bg-transparent text-gold-600 underline-offset-4 hover:underline dark:text-gold-300",
      },
      size: {
        sm: "h-9 px-3.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        default: "h-10 px-4 text-sm",
        lg: "h-12 px-7 text-sm",
        icon: "size-10",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

function Button({ className, variant = "primary", size = "default", ...props }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
