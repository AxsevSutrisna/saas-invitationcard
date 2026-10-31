"use client";

import { Leaf } from "lucide-react";

// ─────────── Gold Ornate Divider (classic) ───────────
function GoldStarDivider({ color = "#C8A96A" }) {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-3 py-2 w-full max-w-[280px] sm:max-w-md mx-auto" aria-hidden="true" style={{ color }}>
      <div className="h-px flex-grow max-w-[24px] bg-linear-to-r from-transparent to-current opacity-50" />
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path d="M12 1L14.5 9H22L15.5 14L18 22L12 17L6 22L8.5 14L2 9H9.5Z" fill={color} opacity="0.65" />
      </svg>
      <div className="h-px flex-grow max-w-[48px] bg-current opacity-35" />
      <svg width="8" height="8" viewBox="0 0 24 24" fill={color} opacity="0.5" className="shrink-0">
        <circle cx="12" cy="12" r="6" />
      </svg>
      <div className="h-px flex-grow max-w-[48px] bg-current opacity-35" />
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path d="M12 1L14.5 9H22L15.5 14L18 22L12 17L6 22L8.5 14L2 9Z" fill={color} opacity="0.65" />
      </svg>
      <div className="h-px flex-grow max-w-[24px] bg-linear-to-l from-transparent to-current opacity-50" />
    </div>
  );
}

// ─────────── Floral Sprig Divider (floral-blossom) ───────────
function FloralSprigDivider({ color = "#5E7152" }) {
  return (
    <div
      className="flex items-center justify-center gap-2 sm:gap-3 py-2 w-full max-w-[280px] sm:max-w-md mx-auto"
      aria-hidden="true"
      style={{ color }}
    >
      <div className="h-px flex-grow max-w-[60px] bg-linear-to-r from-transparent to-current opacity-40" />
      <svg width="58" height="18" viewBox="0 0 58 18" fill="none" className="shrink-0">
        {/* dedaunan kiri */}
        <path d="M2 9 C10 4, 18 6, 23 9 C18 12, 10 14, 2 9Z" fill={color} opacity="0.4" />
        <path d="M23 9 C19 7, 14 7, 11 9" stroke={color} strokeWidth="0.6" opacity="0.5" />
        {/* mawar tengah */}
        <circle cx="29" cy="9" r="4.6" fill="#E0919E" />
        <circle cx="29" cy="9" r="2.3" fill="#C56E7D" opacity="0.9" />
        {/* kuncup */}
        <circle cx="21" cy="9" r="1.7" fill="#F1B892" />
        <circle cx="37" cy="9" r="1.7" fill="#F1B892" />
        {/* dedaunan kanan */}
        <path d="M56 9 C48 4, 40 6, 35 9 C40 12, 48 14, 56 9Z" fill={color} opacity="0.4" />
        <path d="M35 9 C39 7, 44 7, 47 9" stroke={color} strokeWidth="0.6" opacity="0.5" />
      </svg>
      <div className="h-px flex-grow max-w-[60px] bg-linear-to-l from-transparent to-current opacity-40" />
    </div>
  );
}

// ─────────── Wave Divider (floral-blue) ───────────
function WaveDivider({ color = "#1A365D" }) {
  return (
    <div className="flex items-center gap-3 py-2" aria-hidden>
      <div className="h-px flex-1 opacity-20" style={{ background: color }} />
      <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
        <path d="M0 6 C8 0, 12 12, 20 6 S32 0, 40 6" stroke={color} strokeWidth="1.5" opacity="0.5" />
      </svg>
      <svg width="8" height="8" viewBox="0 0 8 8" fill={color} opacity="0.5">
        <rect x="1" y="1" width="6" height="6" rx="1" />
      </svg>
      <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
        <path d="M0 6 C8 0, 12 12, 20 6 S32 0, 40 6" stroke={color} strokeWidth="1.5" opacity="0.5" />
      </svg>
      <div className="h-px flex-1 opacity-20" style={{ background: color }} />
    </div>
  );
}

// ─────────── Minimal Line Divider (modern-minimalist) ───────────
function LineDivider({ color = "#1E293B" }) {
  return (
    <div className="flex items-center gap-4 py-2" aria-hidden>
      <div className="flex-1 h-px" style={{ background: `${color}20` }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color, opacity: 0.5 }} />
      <div className="w-2.5 h-2.5 rotate-45 border" style={{ borderColor: color, opacity: 0.4 }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color, opacity: 0.5 }} />
      <div className="flex-1 h-px" style={{ background: `${color}20` }} />
    </div>
  );
}

// ─────────── Organic (Leaf) Divider (nature-harmony) ───────────
function LeafDivider({ color = "#4A6B3D" }) {
  return (
    <div className="flex items-center justify-center gap-1.5 @[640px]:gap-3 py-2 w-full max-w-[280px] @[640px]:max-w-md mx-auto" aria-hidden="true">
      <div className="h-px flex-grow max-w-[24px] bg-linear-to-r from-transparent to-current opacity-40" style={{ color }} />
      <Leaf className="w-4 h-4 shrink-0" style={{ color }} />
      <div className="h-px flex-grow max-w-[48px] bg-linear-to-r from-current to-transparent opacity-40" style={{ color }} />
      <svg width="10" height="10" viewBox="0 0 24 24" fill={color} opacity="0.4" className="shrink-0">
        <circle cx="12" cy="12" r="5" />
      </svg>
      <div className="h-px flex-grow max-w-[48px] bg-linear-to-l from-current to-transparent opacity-40" style={{ color }} />
      <Leaf className="w-4 h-4 shrink-0 -scale-x-100" style={{ color }} />
      <div className="h-px flex-grow max-w-[24px] bg-linear-to-l from-transparent to-current opacity-40" style={{ color }} />
    </div>
  );
}

/**
 * Divider bersama — pilih glyph via `glyph`.
 * glyph: "gold-star" | "floral-sprig" | "wave" | "line" | "leaf".
 */
export function Divider({ glyph = "gold-star", color }) {
  switch (glyph) {
    case "floral-sprig":
      return <FloralSprigDivider color={color} />;
    case "wave":
      return <WaveDivider color={color} />;
    case "line":
      return <LineDivider color={color} />;
    case "leaf":
      return <LeafDivider color={color} />;
    case "gold-star":
    default:
      return <GoldStarDivider color={color} />;
  }
}
