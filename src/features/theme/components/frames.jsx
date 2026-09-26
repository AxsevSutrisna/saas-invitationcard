"use client";

import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

// ─────────── Gold Wreath SVG (laurel-style, classic) ───────────
export function GoldWreath({ color = "#C8A96A", size = 160 }) {
  const r = size / 2;
  const cr = r * 0.65; // photo circle radius
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Double ring */}
      <circle cx="80" cy="80" r={cr} stroke={color} strokeWidth="2" strokeDasharray="5 4" opacity="0.6" />
      <circle cx="80" cy="80" r={cr - 6} stroke={color} strokeWidth="0.8" opacity="0.35" />
      {/* 8 petal ornaments */}
      {[0,45,90,135,180,225,270,315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const px = 80 + 55 * Math.cos(rad);
        const py = 80 + 55 * Math.sin(rad);
        return (
          <g key={i}>
            <ellipse cx={px} cy={py} rx="6" ry="9" fill={color} opacity="0.25" style={{ transformOrigin: `${px}px ${py}px`, transform: `rotate(${angle + 90}deg)` }} />
            <circle cx={px} cy={py} r="3" fill={color} opacity="0.45" />
          </g>
        );
      })}
      {/* Corner laurel leaves */}
      {[20,70,110,160,200,250,290,340].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const lx = 80 + 60 * Math.cos(rad);
        const ly = 80 + 60 * Math.sin(rad);
        return <circle key={`l-${i}`} cx={lx} cy={ly} r="2.5" fill={color} opacity="0.3" />;
      })}
      {/* Center star sparkles */}
      <circle cx="80" cy="80" r={cr} fill="white" opacity="0" />
    </svg>
  );
}

// ─────────── Floral Wreath SVG ornament (Bunga Melingkar) ───────────
export function FloralWreath({ color = "#B76E79", size = 160 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Central photo circle */}
      <circle cx="80" cy="80" r="52" fill="white" stroke={color} strokeWidth="2.5" strokeDasharray="6 4" />
      {/* Petal cluster top */}
      <ellipse cx="80" cy="18" rx="8" ry="13" fill={color} opacity="0.25" transform="rotate(0 80 80)" />
      <ellipse cx="80" cy="18" rx="6" ry="10" fill={color} opacity="0.45" />
      {/* Rotate 8 petal clusters */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <g key={i} style={{ transformOrigin: "80px 80px", transform: `rotate(${angle}deg)` }}>
          <ellipse cx="80" cy="22" rx="6" ry="10" fill={color} opacity="0.22" />
          <circle cx="80" cy="14" r="4" fill={color} opacity="0.35" />
        </g>
      ))}
      {/* Leaves (4 diagonal) */}
      {[30, 120, 210, 300].map((angle, i) => (
        <g key={`leaf-${i}`} style={{ transformOrigin: "80px 80px", transform: `rotate(${angle}deg)` }}>
          <ellipse cx="80" cy="16" rx="4" ry="8" fill={color} opacity="0.3" />
        </g>
      ))}
      {/* Small accent dots */}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 80 + 58 * Math.cos(rad);
        const cy = 80 + 58 * Math.sin(rad);
        return <circle key={`dot-${i}`} cx={cx} cy={cy} r="3" fill={color} opacity="0.4" />;
      })}
    </svg>
  );
}

// ─────────── Blue Leaf Wreath SVG ───────────
export function BlueLeafWreath({ color = "#1A365D", size = 160 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" aria-hidden>
      {/* Outer ring */}
      <circle cx="80" cy="80" r="56" stroke={color} strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
      {/* Inner circle */}
      <circle cx="80" cy="80" r="48" stroke={color} strokeWidth="0.5" opacity="0.2" />
      {/* 8 leaf clusters */}
      {[0,45,90,135,180,225,270,315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const lx = 80 + 60 * Math.cos(rad);
        const ly = 80 + 60 * Math.sin(rad);
        return (
          <g key={i} style={{ transformOrigin: `${lx}px ${ly}px`, transform: `rotate(${angle + 90}deg)` }}>
            <ellipse cx={lx} cy={ly} rx="5" ry="9" fill={color} opacity="0.2" />
            <ellipse cx={lx} cy={ly} rx="3" ry="6" fill={color} opacity="0.35" />
          </g>
        );
      })}
      {/* Small dot accents */}
      {[22,67,112,157,202,247,292,337].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 80 + 62 * Math.cos(rad);
        const cy = 80 + 62 * Math.sin(rad);
        return <circle key={`d-${i}`} cx={cx} cy={cy} r="2.5" fill={color} opacity="0.35" />;
      })}
    </svg>
  );
}

// ─────────── Circular Geometric Frame (modern minimalist) ───────────
export function GeometricFrame({ color = "#1E293B", size = 144 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 144 144" fill="none" aria-hidden>
      {/* Outer octagon */}
      <polygon points="72,4 116,28 140,72 116,116 72,140 28,116 4,72 28,28"
        stroke={color} strokeWidth="1.5" strokeDasharray="8 5" opacity="0.35" />
      {/* Middle circle */}
      <circle cx="72" cy="72" r="52" stroke={color} strokeWidth="1" opacity="0.25" />
      {/* Inner circle */}
      <circle cx="72" cy="72" r="44" stroke={color} strokeWidth="0.5" opacity="0.2" />
      {/* 4 corner diamond accents */}
      {[0,90,180,270].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 72 + 56 * Math.cos(rad);
        const cy = 72 + 56 * Math.sin(rad);
        return <rect key={i} x={cx - 4} y={cy - 4} width="8" height="8" fill={color} opacity="0.25" style={{ transformOrigin: `${cx}px ${cy}px`, transform: "rotate(45deg)" }} />;
      })}
      {/* Center fill */}
      <circle cx="72" cy="72" r="42" fill="white" opacity="0" />
    </svg>
  );
}

// ─────────── Organic Blob Photo Frame (nature harmony — owns its own <img> + fallback) ───────────
export function BlobFrame({ src, alt = "", className = "w-56 h-56", color = "#4A6B3D", fallbackText = "" }) {
  return (
    <div className={`relative shrink-0 ${className}`}>
      <motion.div
        className="absolute inset-0 overflow-hidden shadow-2xl border-[6px] border-white"
        style={{ borderRadius: "63% 37% 54% 46% / 55% 45% 55% 45%" }}
        animate={{
          borderRadius: [
            "63% 37% 54% 46% / 55% 45% 55% 45%",
            "40% 60% 62% 38% / 48% 45% 55% 52%",
            "63% 37% 54% 46% / 55% 45% 55% 45%",
          ],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        {src ? (
          <motion.img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center font-cormorant text-4xl font-black"
            style={{ background: `${color}15`, color }}
          >
            {fallbackText}
          </div>
        )}
      </motion.div>
      <Leaf className="absolute -bottom-1 -right-1 w-8 h-8 @[1024px]:w-9 @[1024px]:h-9 rotate-[15deg] drop-shadow" style={{ color, opacity: 0.55 }} />
    </div>
  );
}

/**
 * Frame helper — pilih ornamen bingkai foto berdasarkan `kind`.
 * kind: "gold-wreath" | "floral" | "blue-leaf" | "geometric" | "blob".
 * Catatan: "blob" memiliki kontrak berbeda (BlobFrame memuat <img>/fallback sendiri),
 * jadi teruskan props BlobFrame (src/alt/className/color/fallbackText).
 */
export function Frame({ kind = "gold-wreath", ...props }) {
  switch (kind) {
    case "floral":
      return <FloralWreath {...props} />;
    case "blue-leaf":
      return <BlueLeafWreath {...props} />;
    case "geometric":
      return <GeometricFrame {...props} />;
    case "blob":
      return <BlobFrame {...props} />;
    case "gold-wreath":
    default:
      return <GoldWreath {...props} />;
  }
}
