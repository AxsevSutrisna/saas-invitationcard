"use client";

import { Copy, Check } from "lucide-react";
import { formatAccountNumber } from "@/lib/format";

/**
 * Overlay dekoratif kartu, sesuai identitas tiap tema (dipulihkan verbatim).
 * - "stripes-circles" : classic (garis 45° + 3 lingkaran) — default
 * - "glass"           : floral-blossom & nature-harmony (glassmorphism + 3 lingkaran)
 * - "wave"            : floral-blue (SVG ombak + 1 lingkaran)
 * - "grid-glow"       : modern-minimalist (grid + glow blur)
 */
function CardOverlay({ overlay }) {
  switch (overlay) {
    case "wave":
      return (
        <>
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 300 180" preserveAspectRatio="none">
            <path d="M0 60 C60 20, 120 100, 180 60 S260 20, 300 60 L300 180 L0 180 Z" fill="white" />
          </svg>
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-white/10" />
        </>
      );
    case "grid-glow":
      return (
        <>
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute top-0 left-0 w-40 h-40 rounded-full -translate-x-1/2 -translate-y-1/2 bg-white/5 blur-2xl" />
        </>
      );
    case "glass":
      return (
        <>
          <div className="absolute inset-0 opacity-10 bg-gradient-to-tr from-white/30 via-transparent to-white/10" />
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border border-white/10" />
          <div className="absolute -top-5 -right-5 w-32 h-32 rounded-full border border-white/10" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full border border-white/10" />
        </>
      );
    case "stripes-circles":
    default:
      return (
        <>
          <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(45deg,white,white_1px,transparent_0,transparent_12px)]" />
          <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white/30 to-transparent" />
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-white/15" />
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full border border-white/10" />
          <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full border border-white/10" />
        </>
      );
  }
}

/**
 * BankCard bersama — struktur dasar dari GoldBankCard classic, overlay per-tema.
 * Props:
 * - gift, copiedId, onCopy
 * - gradient: string `background` inline untuk kartu
 * - overlay: "stripes-circles" | "glass" | "wave" | "grid-glow"
 * - chipClass: { base, inner, cell } class Tailwind untuk chip
 * - providerFont: "cormorant" | null (font nama provider)
 * - resolveGradient?: (providerName) => gradientString (mis. cabang isRose floral-blossom)
 */
export function BankCard({ gift, copiedId, onCopy, gradient, overlay = "stripes-circles", chipClass = {}, providerFont, resolveGradient }) {
  const background = resolveGradient ? resolveGradient(gift.providerName) : gradient;
  const providerFontClass = providerFont === "cormorant" ? "font-cormorant" : "";

  return (
    <div
      className="relative w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl"
      style={{ background, minHeight: 180 }}
    >
      <CardOverlay overlay={overlay} />

      <div className="relative z-10 p-6 flex flex-col gap-4">
        {/* Top: bank name + chip */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] text-white/60 tracking-[0.25em] uppercase">Bank Transfer</p>
            <p className={`text-white font-bold text-lg tracking-wide ${providerFontClass}`}>{gift.providerName}</p>
          </div>
          {/* Chip */}
          <div className={`w-10 h-8 rounded-md shadow-inner flex items-center justify-center ${chipClass.base || ""}`}>
            <div className={`w-6 h-5 rounded border grid grid-cols-2 gap-[2px] p-[2px] ${chipClass.inner || ""}`}>
              {[...Array(4)].map((_, i) => <div key={i} className={`rounded-[1px] ${chipClass.cell || ""}`} />)}
            </div>
          </div>
        </div>

        {/* Account number */}
        <div className="space-y-1">
          <p className="text-[9px] text-white/50 tracking-[0.2em] uppercase">Nomor Rekening</p>
          <p className="text-white font-mono font-bold text-xl tracking-[0.18em] select-all">
            {formatAccountNumber(gift.accountNumber)}
          </p>
        </div>

        {/* Bottom: name + copy */}
        <div className="flex items-end justify-between pt-2">
          <div>
            <p className="text-[9px] text-white/50 tracking-[0.15em] uppercase">Atas Nama</p>
            <p className="text-white font-semibold text-sm">{gift.accountName}</p>
          </div>
          <button
            type="button"
            onClick={() => onCopy(gift.accountNumber, gift.id)}
            aria-label="Salin nomor rekening"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[10px] font-semibold transition-all cursor-pointer"
          >
            {copiedId === gift.id ? <Check className="w-3 h-3" aria-hidden="true" /> : <Copy className="w-3 h-3" aria-hidden="true" />}
            {copiedId === gift.id ? "Tersalin!" : "Salin"}
          </button>
        </div>
      </div>
    </div>
  );
}
