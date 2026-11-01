"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * ThemePreviewFrame — membungkus pratinjau undangan ("Lihat Contoh") di dalam
 * MOCKUP HANDPHONE (seperti tampilan sampel), berlaku untuk semua tema.
 *
 * Trik agar isi undangan (yang memakai `fixed`/`min-h-screen` berbasis viewport)
 * tetap TERKURUNG di dalam layar HP:
 *  1) `transform: translateZ(0)` pada LAPISAN LUAR (tanpa scroll) → menjadikannya
 *     containing block bagi seluruh descendant `position: fixed` (partikel,
 *     tombol musik, dsb). Scroll ditangani LAPISAN DALAM yang terpisah.
 *     Penting: jika `transform` + `overflow:auto` ada di elemen yang SAMA,
 *     elemen `fixed` ikut ter-scroll. Dengan memisahkannya, tombol musik &
 *     partikel tetap DIAM di layar HP saat konten di-scroll.
 *  2) CSS scoped (`[data-phone-frame] .min-h-screen → 100%`) → tinggi 100vh
 *     dipetakan ke tinggi layar HP, sehingga cover amplop mengisi layar penuh.
 */
const PHONE_SCOPE_CSS = `
[data-phone-frame] .min-h-screen{min-height:100%!important}
[data-phone-frame] .h-screen{height:100%!important}
[data-phone-frame] .min-h-dvh{min-height:100%!important}
[data-phone-frame] .h-dvh{height:100%!important}
`;

export function ThemePreviewFrame({ children, themeName, backHref = "/#tema" }) {
  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center gap-4 overflow-hidden px-4 py-16 bg-[radial-gradient(120%_120%_at_50%_0%,#f4f2ed_0%,#e7e4de_55%,#dbd7cf_100%)] dark:bg-[radial-gradient(120%_120%_at_50%_0%,#16171b_0%,#0e0f12_60%,#0a0b0d_100%)]">
      <style dangerouslySetInnerHTML={{ __html: PHONE_SCOPE_CSS }} />

      {/* Top bar */}
      <div className="absolute left-0 top-0 z-20 flex w-full items-center justify-between px-5 py-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1.5 text-xs font-medium text-zinc-700 backdrop-blur transition-colors hover:bg-black/10 dark:bg-white/10 dark:text-zinc-200 dark:hover:bg-white/15"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali
        </Link>
        <span className="font-heading text-sm font-bold tracking-wide text-zinc-500 dark:text-zinc-300">
          IKARA
        </span>
      </div>

      {/* Mockup handphone */}
      <div className="relative">
        {/* Rangka titanium */}
        <div className="relative h-[min(84dvh,820px)] w-[min(90vw,380px)] rounded-[3.3rem] bg-linear-to-b from-zinc-300 via-zinc-600 to-zinc-500 p-0.75 shadow-[0_40px_80px_-24px_rgba(0,0,0,0.55)] ring-1 ring-white/20">
          {/* Tombol samping */}
          <div className="absolute -left-0.75 top-28 h-7 w-0.75 rounded-l-md bg-linear-to-b from-zinc-200 via-zinc-500 to-zinc-200" />
          <div className="absolute -left-0.75 top-40 h-12 w-0.75 rounded-l-md bg-linear-to-b from-zinc-200 via-zinc-500 to-zinc-200" />
          <div className="absolute -right-0.75 top-48 h-16 w-0.75 rounded-r-md bg-linear-to-b from-zinc-200 via-zinc-500 to-zinc-200" />

          {/* Bezel */}
          <div className="relative h-full w-full rounded-[3.15rem] bg-black p-2.5">
            {/* Dynamic island */}
            <div className="pointer-events-none absolute left-1/2 top-4 z-30 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

            {/* Layar (lapisan luar): containing block untuk elemen `fixed`
                (transform) TANPA scroll → tombol musik & partikel tetap diam. */}
            <div
              data-phone-frame
              className="relative h-full w-full overflow-hidden rounded-[2.65rem] bg-white dark:bg-zinc-950"
              style={{ transform: "translateZ(0)" }}
            >
              {/* Lapisan dalam: scroll container */}
              <div className="h-full w-full overflow-x-hidden overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>

      {themeName && (
        <p className="z-20 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Pratinjau tema{" "}
          <span className="font-semibold text-zinc-700 dark:text-zinc-200">{themeName}</span>
        </p>
      )}
    </div>
  );
}
