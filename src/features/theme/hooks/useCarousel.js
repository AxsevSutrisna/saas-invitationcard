"use client";

import { useState, useEffect } from "react";

/**
 * Hook carousel bersama: index aktif + auto-play.
 * @param {number} length - jumlah slide
 * @param {number} interval - jeda auto-play (ms); 0 menonaktifkan auto-play
 */
export function useCarousel(length, interval = 4500) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!interval || length <= 1) return;
    const t = setInterval(() => setIndex((p) => (p + 1) % length), interval);
    return () => clearInterval(t);
  }, [length, interval]);

  const next = () => setIndex((p) => (p + 1) % length);
  const prev = () => setIndex((p) => (p - 1 + length) % length);

  return { index, setIndex, next, prev };
}
