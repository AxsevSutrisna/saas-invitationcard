"use client";

/**
 * Setup GSAP terpusat — register ScrollTrigger sekali saja (di client).
 * Dipakai hook animasi tema (mis. useFloralGsap). GSAP 3.13+ menjadikan semua
 * plugin gratis, termasuk ScrollTrigger.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined" && !gsap.core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
