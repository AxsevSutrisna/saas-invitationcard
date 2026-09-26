"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Eye, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Surface } from "@/components/ui/Surface";
import {
  getThemeCatalog,
  THEME_FILTERS,
  DEFAULT_THUMBNAILS,
} from "@/features/theme/theme-catalog";

export function ThemesListClient({ initialThemes = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = THEME_FILTERS;

  // Mapping data tema database dengan meta-style visual (dari katalog terpusat)
  const themes = initialThemes.map((theme) => {
    const meta = getThemeCatalog(theme);
    const previewUrl = theme.thumbnailUrl || DEFAULT_THUMBNAILS[theme.slug] || null;
    return {
      ...theme,
      ...meta,
      previewUrl,
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
      <PageHeader title="Koleksi Tema Undangan" />

      {/* Filter Bar & Search Input */}
      <Surface padding="md" className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search
            className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-light"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Cari tema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Cari tema"
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-border/60 text-xs transition-all font-light focus-visible:ring-2 focus-visible:ring-gold-400/60 focus-visible:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-gold-400/60 focus-visible:outline-none ${
                  selectedCategory === cat
                    ? "bg-gold-400 text-white shadow-md shadow-gold-400/20"
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
      </Surface>

      {/* Theme Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThemes.map((theme) => (
          <ThemeCard key={theme.id} theme={theme} />
        ))}
      </div>
    </div>
  );
}

/**
 * Kartu tema dashboard dengan galeri preview: gambar utama di phone-mockup
 * bisa diganti lewat strip thumbnail (thumbnail + previewImages).
 */
function ThemeCard({ theme }) {
  const images = [...new Set([theme.previewUrl, ...(theme.previewImages || [])].filter(Boolean))];
  const [active, setActive] = useState(0);
  const current = images[active] ?? theme.previewUrl;

  return (
    <Surface as="article" padding="none" hover className="overflow-hidden flex flex-col justify-between group">
      {/* Phone Mockup Frame */}
      <div className={`p-6 bg-linear-to-b ${theme.gradient} flex flex-col items-center gap-3 relative`}>
        <div className="relative w-52 h-108 bg-[#1C1C1E] rounded-[36px] border-8 border-[#1C1C1E] shadow-2xl flex flex-col items-center justify-center text-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
          {current ? (
            <Image
              src={current}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover"
              alt={`Pratinjau tampilan tema undangan ${theme.name}`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-white/10 shadow-md flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-gold-400" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">{theme.name}</h3>
              <span className="text-[10px] text-white/70 font-light uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full">
                {theme.isPremium ? "Premium" : "Populer"}
              </span>
            </div>
          )}
        </div>

        {/* Strip thumbnail — muncul bila ada lebih dari 1 gambar */}
        {images.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Lihat gambar ${i + 1}`}
                className={`relative h-12 w-9 shrink-0 overflow-hidden rounded-md border-2 transition-all cursor-pointer ${
                  active === i ? "border-gold-400" : "border-white/40 opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img} fill sizes="36px" className="object-cover" alt={`Thumbnail ${i + 1} tema ${theme.name}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Theme Meta & Buttons */}
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-heading text-sm font-bold text-foreground">{theme.name}</span>
          <Badge className={theme.badgeColor}>{theme.tag}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link href={`/theme/preview/${theme.slug}`} target="_blank">
            <Button variant="outline" size="sm" className="w-full">
              <Eye aria-hidden="true" />
              Lihat
            </Button>
          </Link>

          <Link href={`/dashboard/invitations/new?themeId=${theme.id}`}>
            <Button size="sm" className="w-full">
              <Check aria-hidden="true" />
              Pakai
            </Button>
          </Link>
        </div>
      </div>
    </Surface>
  );
}
