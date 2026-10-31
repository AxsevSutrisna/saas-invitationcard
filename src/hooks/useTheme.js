"use client";

import { useCallback, useEffect, useState } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

/** Baca tema efektif saat ini (pilihan tersimpan → fallback preferensi sistem). */
function readInitialTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

function applyTheme(theme) {
  const el = document.documentElement;
  el.classList.toggle("dark", theme === "dark");
  el.style.colorScheme = theme === "dark" ? "dark" : "light";
}

/**
 * useTheme — state tema dark/light + persistensi localStorage.
 *
 * Skrip anti-flash di Root Layout sudah menerapkan class `.dark` sebelum paint,
 * jadi hook ini hanya menyinkronkan state React setelah mount dan menyediakan
 * aksi `setTheme` / `toggleTheme`.
 *
 * @returns {{ theme: "light"|"dark", setTheme: (t: "light"|"dark") => void, toggleTheme: () => void, mounted: boolean }}
 */
export function useTheme() {
  // Default "light" agar render server & render client pertama cocok (anti
  // hydration mismatch). Nilai sebenarnya disinkronkan di useEffect.
  const [theme, setThemeState] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setThemeState(readInitialTheme());
    setMounted(true);
  }, []);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage tidak tersedia */
    }
    applyTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        /* storage tidak tersedia */
      }
      applyTheme(next);
      return next;
    });
  }, []);

  return { theme, setTheme, toggleTheme, mounted };
}
