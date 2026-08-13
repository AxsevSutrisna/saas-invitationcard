"use client";

import { useState } from "react";
import { LayoutGrid, Link as LinkIcon, Sparkles, RefreshCw, Search, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["Semua", "Elegant", "Floral", "Sunda", "Blue", "Nature"];

export function Step1InfoTheme({ register, errors, watch, setValue, themes = [] }) {
  const selectedThemeId = watch("themeId");
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const selectedTheme =
    themes.find((t) => t.id === selectedThemeId) || themes[0] || { name: "Classic Elegance" };

  const filteredThemes = themes.filter((theme) => {
    const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" ||
      theme.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      theme.slug.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="space-y-1">
        <h3 className="font-heading text-xl font-bold text-foreground">
          Step 1: Info Dasar &amp; Pilih Tema
        </h3>
        <p className="text-xs text-muted-foreground font-light">
          Tentukan judul undangan, alamat link publik unik Anda, dan pilih desain tema.
        </p>
      </div>

      {/* Box Tema Saat Ini & Tombol Ubah Tema */}
      <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/60 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-medium text-muted-foreground block">
              Tema saat ini
            </span>
            <p className="font-heading text-lg font-bold text-[#C8A96A]">
              {selectedTheme.name}
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setShowThemeModal(true)}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs flex items-center gap-1.5 border-[#C8A96A]/40 text-[#C8A96A] hover:bg-[#C8A96A]/10"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Ubah Tema</span>
          </Button>
        </div>
      </div>

      {/* Input Judul Undangan */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <span>Judul Undangan</span>
          <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Contoh: Pernikahan William & Elleanor"
          {...register("title")}
          className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50 transition-all"
        />
        {errors.title && (
          <p className="text-xs text-rose-500">{errors.title.message}</p>
        )}
      </div>

      {/* Input Slug URL */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <LinkIcon className="w-3.5 h-3.5 text-[#C8A96A]" />
          <span>Alamat URL Publik (Slug)</span>
          <span className="text-rose-500">*</span>
        </label>
        <div className="flex items-center rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-border/60 overflow-hidden focus-within:ring-2 focus-within:ring-[#C8A96A]/50 transition-all">
          <span className="px-4 py-3 text-xs font-medium text-muted-foreground bg-zinc-100 dark:bg-zinc-800 border-r border-border/50 select-none">
            ikara.id/
          </span>
          <input
            type="text"
            placeholder="william-eleanor"
            {...register("slug")}
            className="w-full px-4 py-3 bg-transparent text-sm focus:outline-none"
          />
        </div>
        {errors.slug && (
          <p className="text-xs text-rose-500">{errors.slug.message}</p>
        )}
      </div>

      {/* Modal Popup Pilih Tema Undangan (Screenshot Referensi 2) */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-2xl rounded-3xl border border-border/60 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-[#C8A96A]/15 text-[#C8A96A] flex items-center justify-center">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    Pilih Tema Undangan
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Cari, filter, dan pilih tema yang paling cocok
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowThemeModal(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-muted-foreground hover:text-foreground flex items-center justify-center text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Cari tema..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-[#C8A96A] text-white shadow-sm"
                      : "bg-zinc-100 dark:bg-zinc-800 text-muted-foreground hover:bg-zinc-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Theme Grid Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              {filteredThemes.map((theme) => {
                const isSelected = selectedThemeId === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => {
                      setValue("themeId", theme.id, { shouldValidate: true });
                      setShowThemeModal(false);
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all space-y-2 flex flex-col justify-between relative group ${
                      isSelected
                        ? "bg-[#C8A96A]/10 border-[#C8A96A] shadow-md ring-2 ring-[#C8A96A]/40"
                        : "bg-zinc-50 dark:bg-zinc-900/60 border-border/60 hover:border-[#C8A96A]"
                    }`}
                  >
                    {/* Mockup Preview Card */}
                    <div className="w-full aspect-[3/4] rounded-xl bg-zinc-200 dark:bg-zinc-800 overflow-hidden relative flex items-center justify-center">
                      <div className="text-center p-2">
                        <Sparkles className="w-6 h-6 mx-auto text-[#C8A96A] mb-1" />
                        <span className="text-[10px] font-bold text-foreground">
                          {theme.name}
                        </span>
                      </div>

                      {theme.isPremium && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#C8A96A] to-amber-600 text-white text-[8px] font-bold tracking-wider uppercase flex items-center gap-1">
                          <Sparkles className="w-2 h-2 fill-current" />
                          <span>PREMIUM</span>
                        </div>
                      )}

                      {isSelected && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#C8A96A] text-white text-[9px] font-bold flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />
                          <span>Aktif</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>{theme.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
