"use client";

import { useEffect, useRef, useState } from "react";

const OFFSET = {
  up: "translateY(28px)",
  down: "translateY(-28px)",
  left: "translateX(28px)",
  right: "translateX(-28px)",
  none: "none",
};

/**
 * Reveal — animasi masuk ringan berbasis CSS + IntersectionObserver
 * (pengganti framer-motion untuk fade/slide sederhana saat scroll).
 *
 * Props:
 * - as: elemen (default "div")
 * - direction: "up" | "down" | "left" | "right" | "none"
 * - delay: detik (stagger)
 * - duration: detik (default 0.6)
 * - immediate: animasikan saat mount (hero, tanpa menunggu scroll)
 * - amount: threshold IO (0..1, default 0.15)
 */
export function Reveal({
  as: Tag = "div",
  direction = "up",
  delay = 0,
  duration = 0.6,
  immediate = false,
  amount = 0.15,
  className,
  style,
  children,
  ...props
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (immediate) {
      // aman: dijadwalkan (bukan setState sinkron di body effect)
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    const el = ref.current;
    if (!el) return;
    // hormati prefers-reduced-motion
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: amount, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [immediate, amount]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : OFFSET[direction] || OFFSET.up,
        transition: `opacity ${duration}s ease ${delay}s, transform ${duration}s ease ${delay}s`,
        willChange: "opacity, transform",
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
