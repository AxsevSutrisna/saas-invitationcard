"use client";

import { useState, useSyncExternalStore } from "react";
import { BookOpen, X, Check, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "ikara_guide_dismissed";

/** Baca status "sudah ditutup" dari localStorage secara SSR-safe. */
function subscribeDismissed(callback) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}
function getDismissedSnapshot() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return true;
  }
}
// Selama SSR & hydration dianggap "dismissed" agar tidak ada mismatch/flash;
// setelah hydrate, snapshot klien mengambil nilai asli tanpa memicu warning.
function getDismissedServerSnapshot() {
  return true;
}

/**
 * OnboardingGuideModal Component
 * Popup modal panduan 4 langkah membuat undangan digital sesuai gambar referensi mengundanganda.com
 */
export function OnboardingGuideModal({ forceOpen = false, onClose }) {
  const dismissed = useSyncExternalStore(
    subscribeDismissed,
    getDismissedSnapshot,
    getDismissedServerSnapshot
  );
  // Menekan tampilan-otomatis (first-time) setelah ditutup dalam sesi ini —
  // perlu karena useSyncExternalStore tidak melihat perubahan localStorage
  // di tab yang sama. Tidak mempengaruhi pembukaan eksplisit via forceOpen.
  const [autoDismissed, setAutoDismissed] = useState(false);

  // forceOpen (tombol "Panduan Petunjuk") SELALU membuka; selain itu tampil
  // otomatis hanya jika belum pernah ditutup (localStorage) & belum ditutup sesi ini.
  const isOpen = forceOpen || (!dismissed && !autoDismissed);

  const handleClose = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* localStorage tidak tersedia — abaikan */
    }
    setAutoDismissed(true);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-guide-title"
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm duration-200"
    >
      <div className="relative max-h-[90vh] w-full max-w-xl space-y-6 overflow-hidden overflow-y-auto rounded-3xl border border-border/60 bg-card p-6 shadow-2xl sm:p-8">
        {/* Close Icon */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Tutup panduan"
          className="absolute right-5 top-5 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-zinc-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 dark:hover:bg-zinc-800"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-400/15 text-gold-500 shadow-inner">
            <BookOpen className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 id="onboarding-guide-title" className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Panduan Membuat Undangan
          </h2>
          <p className="mx-auto max-w-md text-xs font-light text-muted-foreground sm:text-sm">
            Ikuti langkah-langkah berikut untuk membuat undangan pernikahan digital Anda
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {/* Step 1 */}
          <div className="flex items-start gap-3 rounded-2xl border border-border/50 bg-zinc-50 p-4 dark:bg-zinc-900/60">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold-400 text-sm font-bold text-white shadow-sm">
              1
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-foreground">
                Pilih Tema & Buat URL
              </h4>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Pilih desain undangan, lalu buat alamat unik, contoh:{" "}
                <span className="font-medium italic text-foreground">budi-rani</span>
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 rounded-2xl border border-border/50 bg-zinc-50 p-4 dark:bg-zinc-900/60">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold-400 text-sm font-bold text-white shadow-sm">
              2
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-foreground">
                Isi Data Mempelai
              </h4>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Nama panggilan wajib diisi. Nama lengkap & orang tua opsional.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 rounded-2xl border border-border/50 bg-zinc-50 p-4 dark:bg-zinc-900/60">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold-400 text-sm font-bold text-white shadow-sm">
              3
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-foreground">
                Upload Foto & Isi Acara
              </h4>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Foto sampul, detail akad/resepsi, galeri, dan musik latar.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3 rounded-2xl border border-border/50 bg-zinc-50 p-4 dark:bg-zinc-900/60">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold-400 text-sm font-bold text-white shadow-sm">
              4
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-foreground">
                Klik &quot;Publikasikan&quot;
              </h4>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Setelah selesai, klik tombol publikasikan. Undangan langsung bisa disebar!
              </p>
            </div>
          </div>
        </div>

        {/* Lightbulb Callout Box */}
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-700 dark:text-amber-300">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
          <p className="font-light leading-relaxed">
            Yang bertanda <span className="font-semibold text-amber-600 dark:text-amber-400">*</span> wajib diisi. Sisanya opsional — bisa dilengkapi nanti lewat menu Edit.
          </p>
        </div>

        {/* Primary CTA Button */}
        <Button
          type="button"
          onClick={handleClose}
          size="lg"
          className="w-full"
        >
          <Check aria-hidden="true" />
          Oke, Saya Paham
        </Button>
      </div>
    </div>
  );
}
