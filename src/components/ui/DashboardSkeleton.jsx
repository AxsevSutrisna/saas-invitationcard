/**
 * DashboardSkeleton — loading UI instan untuk route dashboard.
 * Dipakai oleh file `loading.jsx` tiap segmen: Next membungkus page async dalam
 * <Suspense> otomatis, sehingga kerangka ini tampil seketika saat data DB dimuat
 * (navigasi terasa cepat, tak ada layar kosong).
 */
export function DashboardSkeleton({ cards = 6 }) {
  const block = "bg-black/5 dark:bg-white/10 animate-pulse rounded-2xl";

  return (
    <div className="space-y-8" aria-hidden="true">
      {/* Header */}
      <div className="space-y-2">
        <div className={`h-8 w-56 max-w-full ${block}`} />
        <div className={`h-4 w-80 max-w-full ${block}`} />
      </div>

      {/* Grid kartu */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className={`h-44 ${block}`} />
        ))}
      </div>
    </div>
  );
}
