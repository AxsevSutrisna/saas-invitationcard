import { cn } from "@/lib/utils";

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

/**
 * Varian "ghost" (latar transparan, padding lebih rapat) — dipakai form admin.
 */
export const DASHBOARD_INPUT_GHOST =
  "w-full rounded-xl border border-border bg-transparent px-3 py-2 text-xs text-foreground outline-none transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30";

// Props Field yang di-"forward" oleh wrapper di bawah.
function splitFieldProps({ label, htmlFor, required, error, hint, className, labelClassName, ...rest }) {
  return { fieldProps: { label, htmlFor, required, error, hint, className, labelClassName }, rest };
}

/**
 * TextField — Field + <input> ber-gaya dashboard. Props Field (label/htmlFor/
 * required/error/hint/className/labelClassName) + sisanya diteruskan ke <input>.
 * `inputClassName` menimpa/menambah gaya input (mis. DASHBOARD_INPUT_GHOST).
 */
export function TextField({ inputClassName, ...props }) {
  const { fieldProps, rest } = splitFieldProps(props);
  return (
    <Field {...fieldProps}>
      <input id={fieldProps.htmlFor} className={cn(DASHBOARD_INPUT, inputClassName)} {...rest} />
    </Field>
  );
}

/** TextAreaField — Field + <textarea> ber-gaya dashboard. */
export function TextAreaField({ inputClassName, ...props }) {
  const { fieldProps, rest } = splitFieldProps(props);
  return (
    <Field {...fieldProps}>
      <textarea id={fieldProps.htmlFor} className={cn(DASHBOARD_INPUT, inputClassName)} {...rest} />
    </Field>
  );
}

/** SelectField — Field + <select> ber-gaya dashboard. Opsi via children. */
export function SelectField({ inputClassName, children, ...props }) {
  const { fieldProps, rest } = splitFieldProps(props);
  return (
    <Field {...fieldProps}>
      <select
        id={fieldProps.htmlFor}
        className={cn(DASHBOARD_INPUT, "cursor-pointer", inputClassName)}
        {...rest}
      >
        {children}
      </select>
    </Field>
  );
}
