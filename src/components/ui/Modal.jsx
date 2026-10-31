"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Modal — shell dialog aksesibel BERSAMA (overlay + panel + perilaku).
 *
 * Perilaku: tutup via Esc, klik backdrop, body-scroll-lock, focus-trap, dan
 * pengembalian fokus ke pemicu saat ditutup — plus role/aria dialog.
 *
 * DUA MODE:
 *  1) Bebas (default): markup panel sepenuhnya dari `children` + `panelClassName`.
 *     Dipakai untuk modal non-form (preview, konfirmasi, dsb).
 *  2) Terstruktur (bila `title` atau `footer` diberikan): panel responsif dengan
 *     HEADER sticky (judul + tombol X), BODY yang bisa di-scroll, dan FOOTER
 *     sticky opsional. Tinggi dibatasi `max-h-[90dvh]` (aman iOS, bukan `vh`),
 *     sehingga header & tombol aksi tak pernah terpotong di layar kecil.
 *     `panelClassName` di mode ini cukup diisi lebar (mis. `max-w-lg`).
 *
 * @param {boolean} open
 * @param {() => void} onClose
 * @param {import("react").ReactNode} [title] judul → mengaktifkan mode terstruktur
 * @param {import("react").ReactNode} [footer] area aksi sticky → mode terstruktur
 * @param {string} [labelledBy] id judul (aria-labelledby). Di mode terstruktur,
 *   dipakai sebagai id elemen judul yang dirender otomatis.
 * @param {string} [overlayClassName]
 * @param {string} [panelClassName]
 * @param {boolean} [showClose] (mode bebas) render tombol X default
 * @param {string} [closeLabel]
 * @param {import("react").RefObject<HTMLElement>} [initialFocusRef]
 */
export function Modal({
  open,
  onClose,
  children,
  title,
  footer,
  labelledBy,
  overlayClassName = "bg-zinc-950/60 backdrop-blur-sm",
  panelClassName = "",
  showClose = false,
  closeLabel = "Tutup",
  initialFocusRef,
}) {
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement;

    // Kunci scroll latar.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Fokus awal: elemen yang diminta, atau panel itu sendiri.
    const toFocus = initialFocusRef?.current || panelRef.current;
    toFocus?.focus?.();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key !== "Tab") return;
      // Focus-trap: jaga Tab tetap di dalam panel.
      const focusables = panelRef.current?.querySelectorAll(
        'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose, initialFocusRef]);

  if (!open) return null;

  const structured = title != null || footer != null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 ${overlayClassName}`}
      // mousedown di backdrop (bukan panel) → tutup. Pakai mousedown agar drag
      // yang berakhir di luar panel tidak salah-tutup.
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      {structured ? (
        <div
          ref={panelRef}
          tabIndex={-1}
          className={cn(
            "relative flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl outline-none",
            panelClassName
          )}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header sticky */}
          <div className="flex items-start justify-between gap-4 border-b border-border/60 px-5 py-4 sm:px-7">
            {title != null ? (
              <h2 id={labelledBy} className="font-heading text-base font-bold text-foreground sm:text-lg">
                {title}
              </h2>
            ) : (
              <span aria-hidden="true" />
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="-mr-1 -mt-0.5 shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-zinc-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 dark:hover:bg-zinc-800"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Body scrollable */}
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">{children}</div>

          {/* Footer sticky (opsional) */}
          {footer != null && (
            <div className="border-t border-border/60 px-5 py-4 sm:px-7 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {footer}
            </div>
          )}
        </div>
      ) : (
        <div
          ref={panelRef}
          tabIndex={-1}
          className={`relative outline-none ${panelClassName}`}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {showClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="absolute right-5 top-5 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-zinc-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 dark:hover:bg-zinc-800"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
