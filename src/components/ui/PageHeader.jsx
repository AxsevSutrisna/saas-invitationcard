import { cn } from "@/lib/utils";

/**
 * PageHeader — kepala halaman konsisten untuk seluruh menu dashboard.
 * Menyeragamkan hierarki: <h1> font-heading + subjudul muted + slot aksi.
 * Menggantikan blok "h1 + p" yang diduplikasi di tiap halaman.
 */
export function PageHeader({ title, description, action, className, as = "h1" }) {
  const Heading = as;
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="space-y-1.5">
        <Heading className="font-heading text-3xl font-bold tracking-tight text-foreground">
          {title}
        </Heading>
        {description && (
          <p className="max-w-2xl text-sm font-light leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
