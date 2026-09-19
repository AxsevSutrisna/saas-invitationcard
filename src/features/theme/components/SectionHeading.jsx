"use client";

import { Reveal } from "@/features/theme/components/Reveal";
import { Divider } from "@/features/theme/components/Divider";

/**
 * SectionHeading bersama (basis classic) — dipakai TraditionalLayout.
 * Props: title, subtitle, color, glyph (divider), fontClass (font judul).
 */
export function SectionHeading({ title, subtitle, color = "#C8A96A", glyph = "gold-star", fontClass = "font-cormorant" }) {
  return (
    <Reveal direction="up">
      <div className="text-center space-y-3">
        <Divider glyph={glyph} color={color} />
        <h2 className={`${fontClass} text-4xl font-bold`} style={{ color }}>{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 font-light max-w-xs mx-auto leading-relaxed">{subtitle}</p>}
        <Divider glyph={glyph} color={color} />
      </div>
    </Reveal>
  );
}
