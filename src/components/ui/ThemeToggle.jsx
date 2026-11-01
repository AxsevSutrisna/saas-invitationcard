"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

/**
 * ThemeToggle — tombol ganti mode gelap/terang.
 * Warna ikon mengikuti `currentColor`, jadi gaya warna/latar diatur lewat
 * `className` sesuai konteks (header dashboard, navbar landing, dll).
 *
 * @param {{ className?: string }} props
 */
export function ThemeToggle({ className }) {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === "dark";
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      title={isDark ? "Mode terang" : "Mode gelap"}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50",
        className
      )}
    >
      {/* Sampai mounted, ikon mengikuti default "light" (Moon) agar cocok dengan
          render server — menghindari hydration mismatch. */}
      <Icon className="h-[18px] w-[18px]" aria-hidden="true" suppressHydrationWarning />
      <span className="sr-only">{mounted && isDark ? "Mode terang" : "Mode gelap"}</span>
    </button>
  );
}
