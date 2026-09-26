"use client";

import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * Wrapper scroll-reveal bersama (framer-motion) untuk semua tema.
 * Superset varian dari kelima desain: up/down/left/right/zoom/zoomIn/zoomOut/fade.
 */
const VARIANTS = {
  up: { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -50 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
  zoom: { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } },
  zoomIn: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
  zoomOut: { hidden: { opacity: 0, scale: 1.1 }, visible: { opacity: 1, scale: 1 } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
};

// useLayoutEffect di browser (ukur sebelum paint → tanpa flash), useEffect saat SSR.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Elemen yang SUDAH berada di viewport saat komponen mount ditampilkan statis
 * (langsung `visible`, tanpa animasi masuk). Ini penting agar transisi cover →
 * isi undangan terasa SATU gerakan mulus: tirai cover naik memperlihatkan hero
 * yang sudah komposit, bukan hero yang ikut beranimasi saat di-uncover
 * (penyebab kesan "transisi dua kali"). Elemen di bawah fold tetap beranimasi
 * saat di-scroll seperti biasa.
 */
export function Reveal({ children, delay = 0, direction = "up", className = "" }) {
  const ref = useRef(null);
  const [instant, setInstant] = useState(false);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    // Terlihat (sebagian pun) di viewport awal → tampilkan tanpa animasi masuk.
    if (rect.top < vh && rect.bottom > 0) setInstant(true);
  }, []);

  const variants = VARIANTS[direction] || VARIANTS.up;

  if (instant) {
    return (
      <motion.div
        ref={ref}
        initial={false}
        animate="visible"
        variants={variants}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
