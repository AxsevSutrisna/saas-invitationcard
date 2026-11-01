"use client";

import { useMemo, useState } from "react";
import {
  getThemeCatalog,
  THEME_FILTERS,
  DEFAULT_THUMBNAILS,
} from "@/features/theme/theme-catalog";

/**
 * Hook galeri tema BERSAMA — dipakai halaman publik `/themes` (ThemesClient)
 * dan dashboard `/dashboard/themes` (ThemesListClient). Menyatukan logika yang
 * dulu diduplikasi di kedua file: memetakan tema DB + meta katalog (previewUrl)
 * serta state pencarian & filter kategori.
 *
 * Catatan: JSX kartu (ThemeCard) sengaja DIBIARKAN per-halaman karena gayanya
 * berbeda (raw div vs Surface/Badge) — yang disatukan hanya LOGIKA-nya.
 *
 * @param {Array} initialThemes tema mentah dari database
 */
export function useThemeGallery(initialThemes = []) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Peta tema DB → tambah meta visual katalog + previewUrl (thumbnail/fallback).
  const themes = useMemo(
    () =>
      initialThemes.map((theme) => ({
        ...theme,
        ...getThemeCatalog(theme),
        previewUrl: theme.thumbnailUrl || DEFAULT_THUMBNAILS[theme.slug] || null,
      })),
    [initialThemes]
  );

  const filteredThemes = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return themes.filter(
      (t) =>
        (selectedCategory === "Semua" || t.category === selectedCategory) &&
        t.name.toLowerCase().includes(q)
    );
  }, [themes, searchQuery, selectedCategory]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories: THEME_FILTERS,
    themes,
    filteredThemes,
  };
}
