"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Sembunyikan <img> yang gagal dimuat (file belum disediakan) → fallback aman.
const hideOnError = (e) => {
  e.currentTarget.style.display = "none";
};

/**
 * CoverLayers — lapisan PNG dekoratif untuk SAMPUL (teknik mengundanganda),
 * generik untuk SEMUA tema. Membaca config aset per-tema (lihat cover-assets.js):
 * latar opsional + ornamen/daun menjuntai di atas + elemen sudut bawah kiri/kanan.
 *
 * Tiap <img> absolut dengan transform sendiri; dianimasikan GSAP (muncul bertahap
 * dari bawah + float lembut). Menghormati prefers-reduced-motion. Jika file aset
 * belum ada, tiap <img> menyembunyikan diri (onError) → tak ada layar kosong.
 */
export function CoverLayers({ assets }) {
  const ref = useRef(null);

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

  if (!assets) return null;
  const A = assets;

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
      {/* Latar (opsional; jika tak ada → latar bawaan tema yang tampil) */}
      {A.coverBg && (
        <img
          src={A.coverBg}
          onError={hideOnError}
          alt=""
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />
      )}

      {/* Ornamen/daun menjuntai dari atas */}
      {(A.coverLeaves || []).map((l, i) => (
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

      {/* Elemen sudut bawah KIRI */}
      {(A.coverFlowers || []).map((f, i) => (
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

      {/* Elemen sudut bawah KANAN (cermin) */}
      {(A.coverFlowers || []).map((f, i) => (
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
