/**
 * Field — pembungkus field form BERSAMA untuk form dashboard/wizard:
 * label + penanda wajib (*) + kontrol (children) + pesan error / hint.
 * Menghapus boilerplate `label`/`*`/`error` yang berulang di tiap input.
 *
 * Kontrolnya (input/select/textarea) tetap dilewatkan sebagai children agar
 * bebas (pakai {@link DASHBOARD_INPUT} untuk gaya input dashboard standar).
 *
 * @param {object} props
 * @param {import("react").ReactNode} [props.label]
 * @param {string} [props.htmlFor] id kontrol (menyambungkan label)
 * @param {boolean} [props.required] tampilkan asterisk wajib
 * @param {string} [props.error] pesan error (muncul bila ada)
 * @param {import("react").ReactNode} [props.hint] keterangan kecil (disembunyikan saat error)
 * @param {string} [props.className] kelas wrapper (default "space-y-1.5"; override penuh untuk parity)
 * @param {string} [props.labelClassName] override gaya label
 * @param {string} [props.errorClassName] override gaya pesan error
 * @param {import("react").ReactNode} props.children kontrol input
 */
export function Field({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  className = "space-y-1.5",
  labelClassName = "text-[11px] font-semibold text-muted-foreground",
  errorClassName = "text-[10px] text-destructive",
  children,
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className={labelClassName}>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </label>
      )}
      {children}
      {error && <p className={errorClassName}>{error}</p>}
      {hint && !error && (
        <p className="text-[10px] font-light text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

/**
 * Kelas input dashboard standar (rounded-xl + border + fokus cincin emas).
 * SATU sumber untuk menghindari duplikasi kelas yang tersebar & melenceng.
 */
export const DASHBOARD_INPUT =
  "w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-800";
