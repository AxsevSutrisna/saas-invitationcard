import { cn } from "@/lib/utils";

/**
 * Surface — panel/kartu putih standar dashboard.
 * Menyeragamkan container yang selama ini ditulis manual:
 *   rounded-3xl bg-white/#1A1A1A border shadow.
 *
 * Props:
 * - as: elemen (default "div", boleh "section"/"article" untuk SEO/semantik).
 * - padding: "none" | "sm" | "md" | "lg".
 * - hover: efek angkat halus (untuk kartu yang bisa diklik).
 */
export function Surface({
  as: Tag = "div",
  padding = "md",
  hover = false,
  className,
  children,
  ...props
}) {
  const pad = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8 sm:p-10",
  }[padding];

  return (
    <Tag
      className={cn(
        "rounded-3xl border border-border/60 bg-card shadow-(--shadow-gold-sm)",
        hover &&
          "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-(--shadow-gold-lg)",
        pad,
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
