/**
 * EmptyState - Shared Component
 * Tampilan default ketika tidak ada data untuk ditampilkan.
 * @param {{ title: string, description?: string, action?: React.ReactNode }} props
 */
export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-6xl mb-4">📭</div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
