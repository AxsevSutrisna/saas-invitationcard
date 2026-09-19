import { cn } from "@/lib/utils";

/**
 * SectionSkeleton — placeholder saat section landing yang bergantung data DB
 * (tema, harga, FAQ) sedang di-stream lewat <Suspense>. Mencegah lompatan layout
 * & memberi sinyal "sedang memuat" tanpa memblokir render shell/hero.
 */
export function SectionSkeleton({ tone = "light", rows = 3, className }) {
  const bg =
    tone === "dark" ? "bg-[#1F1F1F]" : "bg-[#F8F6F2] dark:bg-[#191919]";
  const block = "bg-black/5 dark:bg-white/10 animate-pulse";

  return (
    <section className={cn("w-full py-20", bg, className)} aria-hidden="true">
      <div className="mx-auto max-w-6xl space-y-8 px-6">
        <div className="space-y-3 text-center">
          <div className={cn("mx-auto h-8 w-64 rounded-full", block)} />
          <div className={cn("mx-auto h-4 w-80 max-w-full rounded-full", block)} />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className={cn("h-64 rounded-3xl", block)} />
          ))}
        </div>
      </div>
    </section>
  );
}
