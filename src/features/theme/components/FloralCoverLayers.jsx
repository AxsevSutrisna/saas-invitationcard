"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { FLORAL_ASSETS } from "@/features/theme/floral-assets";

// Sembunyikan <img> yang gagal dimuat (file belum disediakan) → fallback aman.
const hideOnError = (e) => {
  e.currentTarget.style.display = "none";
};

/**
 * FloralCoverLayers — lapisan PNG floral untuk sampul (teknik mengundanganda):
 * latar taman + dedaunan menjuntai + karangan bunga sudut kiri/kanan, masing-
 * masing <img> absolut dengan transform sendiri, dianimasikan GSAP (muncul
 * bertahap dari bawah + float lembut). Menghormati prefers-reduced-motion.
 *
 * Dipakai hanya bila FLORAL_USE_PNG = true. Jika file aset belum ada, tiap <img>
 * menyembunyikan diri (onError) sehingga tak ada layar kosong/rusak.
 */
export function FloralCoverLayers() {
  const ref = useRef(null);
  const A = FLORAL_ASSETS;

  useEffect(() => {
    const root = ref.current;
    if (!root || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-cover-flower]", {
        autoAlpha: 0,
        yPercent: 35,
        scale: 0.6,
        duration: 1,
        ease: "back.out(1.4)",
        stagger: 0.07,
        delay: 0.2,
      });
      gsap.from("[data-cover-leaf]", {
        autoAlpha: 0,
        yPercent: -20,
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.1,
      });
      // Float ambient lembut (terus-menerus) setelah muncul.
      gsap.to("[data-cover-flower]", {
        yPercent: "-=4",
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.2,
        stagger: { each: 0.3, from: "random" },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
      {/* Latar taman (opsional; jika tak ada → gradient sampul yang tampil) */}
      {A.coverBg && (
        <img
          src={A.coverBg}
          onError={hideOnError}
          alt=""
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />
      )}

      {/* Dedaunan menjuntai dari atas */}
      {A.coverLeaves.map((l, i) => (
        <img
          key={`leaf-${i}`}
          data-cover-leaf
          src={A.leaf}
          onError={hideOnError}
          alt=""
          style={{
            position: "absolute",
            top: l.top,
            [l.side]: l.offset,
            width: l.width,
            zIndex: 6,
            transform: `rotate(${l.rotate}deg)${l.flip ? " scaleX(-1)" : ""}`,
            transformOrigin: "center top",
          }}
        />
      ))}

      {/* Karangan bunga sudut KIRI */}
      {A.coverFlowers.map((f, i) => (
        <img
          key={`fl-${i}`}
          data-cover-flower
          src={`${A.base}/${f.src}`}
          onError={hideOnError}
          alt=""
          style={{
            position: "absolute",
            bottom: f.bottom,
            left: f.offset,
            width: f.width,
            zIndex: f.z,
            transform: `rotate(${f.rotate}deg)`,
            transformOrigin: "center bottom",
          }}
        />
      ))}

      {/* Karangan bunga sudut KANAN (cermin) */}
      {A.coverFlowers.map((f, i) => (
        <img
          key={`fr-${i}`}
          data-cover-flower
          src={`${A.base}/${f.src}`}
          onError={hideOnError}
          alt=""
          style={{
            position: "absolute",
            bottom: f.bottom,
            right: f.offset,
            width: f.width,
            zIndex: f.z,
            transform: `rotate(${-f.rotate}deg) scaleX(-1)`,
            transformOrigin: "center bottom",
          }}
        />
      ))}
    </div>
  );
}
