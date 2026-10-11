"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * Modal — shell dialog aksesibel BERSAMA (overlay + panel + perilaku).
 *
 * Menyediakan yang dulu HILANG di modal-modal hand-built: tutup via Esc, klik
 * backdrop, body-scroll-lock, focus-trap (Tab berputar di dalam panel), dan
 * pengembalian fokus ke pemicu saat ditutup — plus role/aria dialog.
 *
 * Sengaja TIDAK mendikte isi panel: markup header/body tiap pemakai dibiarkan
 * apa adanya (dilewatkan sebagai children) + `panelClassName` memakai kelas
 * panel yang persis sama → tampilan tak berubah, hanya perilaku & boilerplate
 * overlay yang disatukan.
 *
 * @param {boolean} open
 * @param {() => void} onClose dipanggil saat Esc / klik backdrop / tombol X
 * @param {string} [labelledBy] id elemen judul (untuk aria-labelledby)
 * @param {string} [overlayClassName] kelas lapisan latar (default gelap + blur)
 * @param {string} [panelClassName] kelas panel (max-w, padding, rounded, bg, dst)
 * @param {boolean} [showClose] render tombol X default di kanan-atas panel
 * @param {string} [closeLabel] aria-label tombol X
 * @param {import("react").RefObject<HTMLElement>} [initialFocusRef] elemen yang difokus saat dibuka
 */
export function Modal({
  open,
  onClose,
  children,
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${overlayClassName}`}
      // mousedown di backdrop (bukan panel) → tutup. Pakai mousedown agar drag
      // yang berakhir di luar panel tidak salah-tutup.
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
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
    </div>
  );
}
