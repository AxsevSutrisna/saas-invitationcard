"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Eye, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Dashboard Themes Page - Koleksi Tema Undangan (Screenshot 3 Reference)
 * Menampilkan galeri tema undangan interaktif dengan filter kategori & pencarian.
 */
export default function ThemesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = ["Semua", "Elegant", "Floral", "Sunda", "Blue", "Minimalist"];

  const themes = [
    {
      id: "1",
      name: "Classic Elegance",
      category: "Elegant",
      previewUrl: "/IKARA_Logo_V3.png",
      tag: "Populer",
      badgeColor: "bg-amber-100 text-[#C8A96A]",
      gradient: "from-amber-100 to-amber-50 dark:from-zinc-800 dark:to-zinc-900",
    },
    {
      id: "2",
      name: "Floral Blossom",
      category: "Floral",
      previewUrl: "/IKARA_Logo_V3.png",
      tag: "Eksklusif",
      badgeColor: "bg-rose-100 text-rose-600",
      gradient: "from-rose-100 to-rose-50 dark:from-zinc-800 dark:to-zinc-900",
    },
    {
      id: "3",
      name: "Elegant Blue",
      category: "Blue",
      previewUrl: "/IKARA_Logo_V3.png",
      tag: "Baru",
      badgeColor: "bg-sky-100 text-sky-600",
      gradient: "from-sky-100 to-sky-50 dark:from-zinc-800 dark:to-zinc-900",
    },
    {
      id: "4",
      name: "Floral Blue",
      category: "Floral",
      previewUrl: "/IKARA_Logo_V3.png",
      tag: "Trending",
      badgeColor: "bg-indigo-100 text-indigo-600",
      gradient: "from-indigo-100 to-indigo-50 dark:from-zinc-800 dark:to-zinc-900",
    },
    {
      id: "5",
      name: "Modern Minimalist",
      category: "Minimalist",
      previewUrl: "/IKARA_Logo_V3.png",
      tag: "Favorit",
      badgeColor: "bg-emerald-100 text-emerald-600",
      gradient: "from-emerald-100 to-emerald-50 dark:from-zinc-800 dark:to-zinc-900",
    },
  ];

  const filteredThemes = themes.filter((t) => {
    const matchesCategory =
      selectedCategory === "Semua" || t.category === selectedCategory;
    const matchesSearch = t.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="space-y-1">
        <h1 className="font-heading text-3xl font-bold text-[#1F1F1F] dark:text-zinc-50 tracking-tight">
          Koleksi Tema Undangan
        </h1>
      </div>

      {/* Filter Bar & Search Input (Screenshot 3 Reference) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari tema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50 transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#C8A96A] text-white shadow-md shadow-[#C8A96A]/20"
                    : "bg-zinc-100 dark:bg-zinc-800 text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-light">
            Menampilkan {filteredThemes.length} dari {themes.length} tema
          </span>
        </div>
      </div>

      {/* Theme Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThemes.map((theme) => (
          <div
            key={theme.id}
            className="rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-all"
          >
            {/* Phone Mockup Frame */}
            <div className={`p-6 bg-gradient-to-b ${theme.gradient} flex justify-center relative`}>
              <div className="relative w-40 h-72 bg-white dark:bg-zinc-900 rounded-[30px] border-4 border-zinc-700/80 shadow-2xl p-2 flex flex-col items-center justify-center text-center space-y-2 group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-[#C8A96A]" />
                <p className="font-heading text-sm font-bold text-foreground">
                  {theme.name}
                </p>
                <span className="text-[10px] text-muted-foreground">
                  IKARA Theme Spec
                </span>
              </div>
            </div>

            {/* Theme Meta & Buttons */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-heading text-base font-bold text-foreground">
                  {theme.name}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${theme.badgeColor}`}>
                  {theme.tag}
                </span>
              </div>

              {/* Actions: Lihat & Pakai */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Lihat
                </Button>
                <Button
                  size="sm"
                  className="rounded-xl bg-[#C8A96A] hover:bg-[#b39150] text-white text-xs flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Pakai
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
