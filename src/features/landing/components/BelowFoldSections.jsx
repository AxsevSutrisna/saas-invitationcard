"use client";

import dynamic from "next/dynamic";

/**
 * Pembungkus CLIENT untuk section bawah lipatan yang TIDAK bergantung data DB.
 *
 * Kenapa di sini (bukan di page.jsx server): Next 16 tidak memecah bundle saat
 * Server Component meng-`dynamic`-import Client Component. Dengan dynamic import
 * di boundary client ini, tiap section jadi chunk JS terpisah yang tak membebani
 * bundle awal. `ssr` default (true) → konten tetap dirender server (aman SEO).
 *
 * Section yang butuh data (Tema, Harga, FAQ) TIDAK di sini — mereka di-stream
 * lewat <Suspense> + Server Component async di page.jsx.
 */
const InteractiveScrollSection = dynamic(() =>
  import("./InteractiveScrollSection").then((m) => m.InteractiveScrollSection)
);
const HowItWorksSection = dynamic(() =>
  import("./HowItWorksSection").then((m) => m.HowItWorksSection)
);
const RealtimeEditorSection = dynamic(() =>
  import("./RealtimeEditorSection").then((m) => m.RealtimeEditorSection)
);

export function BelowFoldSections() {
  return (
    <>
      {/* Interactive Scroll Showcase (LIGHT) */}
      <InteractiveScrollSection />

      {/* How It Works (DARK) */}
      <HowItWorksSection />

      {/* Realtime Editor Showcase (LIGHT) */}
      <RealtimeEditorSection />
    </>
  );
}
