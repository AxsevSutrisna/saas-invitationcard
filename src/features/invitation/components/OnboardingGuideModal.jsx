"use client";

import { useState, useEffect } from "react";
import { BookOpen, X, Check, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "ikara_guide_dismissed";

/**
 * OnboardingGuideModal Component
 * Popup modal panduan 4 langkah membuat undangan digital sesuai gambar referensi mengundanganda.com
 */
export function OnboardingGuideModal({ forceOpen = false, onClose }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }
    const isDismissed = localStorage.getItem(STORAGE_KEY);
    if (!isDismissed) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-2xl border border-border/60 p-6 sm:p-8 space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Icon */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#C8A96A]/15 text-[#C8A96A] mx-auto flex items-center justify-center shadow-inner">
            <BookOpen className="w-7 h-7" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground tracking-tight">
            Panduan Membuat Undangan
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-light max-w-md mx-auto">
            Ikuti langkah-langkah berikut untuk membuat undangan pernikahan digital Anda
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/50 flex gap-3 items-start">
            <div className="w-8 h-8 rounded-xl bg-[#C8A96A] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
              1
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-foreground">
                Pilih Tema & Buat URL
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Pilih desain undangan, lalu buat alamat unik, contoh:{" "}
                <span className="italic font-medium text-foreground">budi-rani</span>
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/50 flex gap-3 items-start">
            <div className="w-8 h-8 rounded-xl bg-[#C8A96A] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
              2
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-foreground">
                Isi Data Mempelai
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Nama panggilan wajib diisi. Nama lengkap & orang tua opsional.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/50 flex gap-3 items-start">
            <div className="w-8 h-8 rounded-xl bg-[#C8A96A] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
              3
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-foreground">
                Upload Foto & Isi Acara
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Foto sampul, detail akad/resepsi, galeri, dan musik latar.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/50 flex gap-3 items-start">
            <div className="w-8 h-8 rounded-xl bg-[#C8A96A] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
              4
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-foreground">
                Klik &quot;Publikasikan&quot;
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Setelah selesai, klik tombol publikasikan. Undangan langsung bisa disebar!
              </p>
            </div>
          </div>
        </div>

        {/* Lightbulb Callout Box */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex gap-2.5 items-start text-xs text-amber-700 dark:text-amber-300">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-light">
            Yang bertanda <span className="font-semibold text-amber-600 dark:text-amber-400">*</span> wajib diisi. Sisanya opsional — bisa dilengkapi nanti lewat menu Edit.
          </p>
        </div>

        {/* Primary CTA Button */}
        <Button
          onClick={handleClose}
          className="w-full h-12 rounded-2xl bg-[#C8A96A] hover:bg-[#b39150] text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          Oke, Saya Paham
        </Button>
      </div>
    </div>
  );
}
