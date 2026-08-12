"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORY_MAP = {
  "classic-elegance": {
    category: "Elegant",
    tag: "Populer",
    badgeColor: "bg-amber-100 text-[#C8A96A] dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50",
    gradient: "from-amber-100 to-amber-50 dark:from-zinc-800 dark:to-zinc-900",
  },
  "floral-blossom": {
    category: "Floral",
    tag: "Eksklusif",
    badgeColor: "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50",
    gradient: "from-rose-100 to-rose-50 dark:from-zinc-800 dark:to-zinc-900",
  },
  "modern-minimalist": {
    category: "Minimalist",
    tag: "Favorit",
    badgeColor: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50",
    gradient: "from-emerald-100 to-emerald-50 dark:from-zinc-800 dark:to-zinc-900",
  },
  "floral-blue": {
    category: "Blue",
    tag: "Baru",
    badgeColor: "bg-sky-100 text-sky-600 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200 dark:border-sky-900/50",
    gradient: "from-sky-100 to-sky-50 dark:from-zinc-800 dark:to-zinc-900",
  },
};

export function ThemesClient({ initialThemes = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = ["Semua", "Elegant", "Floral", "Minimalist", "Blue"];

  // Mapping data tema database dengan meta-style visual
  const themes = initialThemes.map((theme) => {
    const meta = CATEGORY_MAP[theme.slug] || {
      category: "Elegant",
      tag: "Premium",
      badgeColor: "bg-zinc-100 text-zinc-600",
      gradient: "from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900",
    };
    return {
      ...theme,
      ...meta,
    };
  });

  const filteredThemes = themes.filter((t) => {
    const matchesCategory =
      selectedCategory === "Semua" || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="text-center space-y-3 pb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A96A]">
          Koleksi Desain Premium
        </span>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#1F1F1F] dark:text-zinc-50 font-cormorant leading-tight">
          Visual Indah yang Mencerminkan<br />Kisah Anda
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto pt-2">
          Setiap desain dirancang khusus oleh desainer profesional untuk membuat tamu undangan Anda terkesan dari pandangan pertama.
        </p>
      </div>

      {/* Filter Bar & Search Input */}
      <div className="p-6 rounded-3xl bg-white/60 dark:bg-[#1A1A1A]/60 backdrop-blur-md border border-border/60 shadow-sm space-y-4 max-w-4xl mx-auto">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-light" />
          <input
            type="text"
            placeholder="Cari tema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50 transition-all font-light"
          />
        </div>

        {/* Category Pills & Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#C8A96A] text-white shadow-md shadow-[#C8A96A]/20"
                    : "bg-white dark:bg-zinc-800 border border-border/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Menampilkan {filteredThemes.length} dari {themes.length} tema
          </p>
        </div>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
        {filteredThemes.map((theme) => (
          <div
            key={theme.id}
            className="rounded-[2rem] bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            {/* Phone Mockup Frame (Taller Android Style) */}
            <div className="p-8 bg-zinc-50 dark:bg-zinc-800/40 flex justify-center relative">
              <div className="relative w-[240px] h-[500px] bg-[#1C1C1E] dark:bg-[#1C1C1E] rounded-[40px] border-[10px] border-[#1C1C1E] shadow-2xl flex flex-col items-center justify-center text-center overflow-hidden group-hover:-translate-y-2 transition-transform duration-500">
                {theme.thumbnailUrl ? (
                  <Image
                    src={theme.thumbnailUrl}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover"
                    alt={`Preview tema ${theme.name}`}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 space-y-4">
                    <div className={`w-14 h-14 rounded-full bg-white/10 shadow-md flex items-center justify-center`}>
                      <Sparkles className="w-6 h-6 text-[#C8A96A]" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-white">
                      {theme.name}
                    </h3>
                    <span className="text-[10px] text-white/70 font-light uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full">
                      {theme.isPremium ? "Premium" : "Populer"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Theme Meta & Buttons */}
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#C8A96A]" />
                  <span className="font-heading text-base font-bold text-foreground">
                    {theme.name}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {theme.description || "Desain undangan eksklusif dengan sentuhan estetika tinggi."}
                </p>
              </div>

              {/* Actions: Lihat & Pakai */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link href={`/theme/preview/${theme.slug}`} target="_blank">
                  <Button
                    variant="outline"
                    className="w-full h-10 rounded-xl bg-transparent border border-border/60 text-muted-foreground hover:text-[#C8A96A] hover:border-[#C8A96A] hover:bg-[#C8A96A]/5 font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Lihat Contoh
                  </Button>
                </Link>

                <Link href={`/dashboard/invitations/new?themeId=${theme.id}`}>
                  <Button
                    className="w-full h-10 rounded-xl bg-[#C8A96A] hover:bg-[#b39150] text-white font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:shadow-lg transition-all active:scale-95"
                  >
                    Pakai Tema Ini
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
