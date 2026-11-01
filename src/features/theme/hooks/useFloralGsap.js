"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Cari ancestor yang BISA di-scroll (overflow-y auto/scroll + konten melebihi
 * tinggi). Null → berarti yang scroll adalah window (halaman asli).
 * Di preview (theme-preview / editor) ini mengembalikan div-layar HP.
 */
function getScrollParent(node) {
  let el = node?.parentElement;
  while (el && el !== document.body) {
    const oy = getComputedStyle(el).overflowY;
    if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 4) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

/**
 * useFloralGsap — menambah efek SCROLL (GSAP ScrollTrigger) + smooth-scroll
 * (Lenis) pada tema floral, tanpa mengganggu animasi framer-motion yang ada.
 *
 * Prinsip "degradasi aman":
 * - Target parallax adalah elemen dekoratif ber-atribut [data-parallax] (angka =
 *   yPercent tujuan). Nilai default elemen = posisi natural, jadi bila
 *   ScrollTrigger tak terpicu (mis. konteks scroll tak terdeteksi), elemen tetap
 *   tampil benar — hanya tanpa parallax.
 * - Lenis hanya diaktifkan saat scroll = window (halaman undangan asli). Di
 *   preview, scroll native bingkai HP dibiarkan apa adanya.
 * - Menghormati prefers-reduced-motion.
 *
 * @param {React.RefObject<HTMLElement>} rootRef  root <main> undangan
 * @param {boolean} enabled  aktif hanya untuk tema floral
 */
export function useFloralGsap(rootRef, enabled) {
  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scrollerEl = getScrollParent(root); // null → window
    const scroller = scrollerEl || undefined;

    let lenis;
    let tickerFn;

    // Smooth-scroll Lenis hanya untuk scroll window (halaman asli).
    if (!scrollerEl) {
      try {
        lenis = new Lenis({ duration: 1.1, smoothWheel: true });
        lenis.on("scroll", ScrollTrigger.update);
        tickerFn = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);
      } catch {
        lenis = undefined;
      }
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-parallax]", root).forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-parallax")) || 0;
        if (!speed) return;
        const section = el.closest("section") || root;
        // start "top top": pada posisi awal (hero di atas) elemen = posisi
        // natural (yPercent 0) → komposisi tepat saat load; parallax hanya
        // bertambah saat di-scroll melewati section.
        gsap.fromTo(
          el,
          { yPercent: 0 },
          {
            yPercent: speed,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              scroller,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    }, root);

    // Refresh posisi setelah layout/gambar settle.
    const refresh = () => ScrollTrigger.refresh();
    const t1 = setTimeout(refresh, 300);
    const t2 = setTimeout(refresh, 1200);
    window.addEventListener("load", refresh);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("load", refresh);
      if (tickerFn) gsap.ticker.remove(tickerFn);
      if (lenis) lenis.destroy();
      ctx.revert();
    };
  }, [enabled, rootRef]);
}
