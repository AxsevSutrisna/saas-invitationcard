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
    <div className="animate-in fade-in space-y-6 duration-200">
      <div className="space-y-1">
        <h3 className="font-heading text-xl font-bold text-foreground">
          Step 1: Info Dasar &amp; Pilih Tema
        </h3>
        <p className="text-xs font-light text-muted-foreground">
          Tentukan judul undangan, alamat link publik unik Anda, dan pilih desain tema.
        </p>
      </div>

      {/* Box Tema Saat Ini & Tombol Ubah Tema */}
      <div className="space-y-3 rounded-3xl border border-border/60 bg-zinc-50 p-5 dark:bg-zinc-900/60">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="block text-[11px] font-medium text-muted-foreground">
              Tema saat ini
            </span>
            <p className="font-heading text-lg font-bold text-gold-500">
              {selectedTheme.name}
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setShowThemeModal(true)}
            variant="outline"
            size="sm"
          >
            <RefreshCw aria-hidden="true" />
            <span>Ubah Tema</span>
          </Button>
        </div>
      </div>

      {/* Input Judul Undangan */}
      <div className="space-y-2">
        <label
          htmlFor="invitation-title"
          className="flex items-center gap-1.5 text-sm font-semibold text-foreground"
        >
          <span>Judul Undangan</span>
          <span className="text-destructive">*</span>
        </label>
        <input
          id="invitation-title"
          type="text"
          placeholder="Contoh: Pernikahan William & Elleanor"
          {...register("title")}
          className="w-full rounded-xl border border-border bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-900"
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Input Slug URL */}
      <div className="space-y-2">
        <label
          htmlFor="invitation-slug"
          className="flex items-center gap-1.5 text-sm font-semibold text-foreground"
        >
          <LinkIcon className="h-3.5 w-3.5 text-gold-500" aria-hidden="true" />
          <span>Alamat URL Publik (Slug)</span>
          <span className="text-destructive">*</span>
        </label>
        <div className="flex items-center overflow-hidden rounded-xl border border-border bg-zinc-50 transition-all focus-within:border-gold-400 focus-within:ring-2 focus-within:ring-gold-400/30 dark:bg-zinc-900">
          <span className="select-none border-r border-border/50 bg-zinc-100 px-4 py-3 text-xs font-medium text-muted-foreground dark:bg-zinc-800">
            ikara.id/
          </span>
          <input
            id="invitation-slug"
            type="text"
            placeholder="william-eleanor"
            {...register("slug")}
            className="w-full bg-transparent px-4 py-3 text-sm focus:outline-none"
          />
        </div>
        {errors.slug && (
          <p className="text-xs text-destructive">{errors.slug.message}</p>
        )}
      </div>

      {/* Modal Popup Pilih Tema Undangan (Screenshot Referensi 2) */}
      {showThemeModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="theme-modal-title"
          className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200"
        >
          <div className="max-h-[90vh] w-full max-w-2xl space-y-5 overflow-y-auto rounded-3xl border border-border/60 bg-card p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gold-400/15 text-gold-500">
                  <LayoutGrid className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 id="theme-modal-title" className="font-heading text-lg font-bold text-foreground">
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
                aria-label="Tutup dialog pilih tema"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 dark:bg-zinc-800"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <label htmlFor="theme-search" className="sr-only">
                Cari tema
              </label>
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input
                id="theme-search"
                type="text"
                placeholder="Cari tema..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-zinc-50 py-2.5 pl-10 pr-4 text-xs focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-900"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 ${
                    selectedCategory === cat
                      ? "bg-gold-400 text-white shadow-sm"
                      : "bg-zinc-100 text-muted-foreground hover:bg-zinc-200 dark:bg-zinc-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Theme Grid Cards */}
            <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-3">
              {filteredThemes.map((theme) => {
                const isSelected = selectedThemeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      setValue("themeId", theme.id, { shouldValidate: true });
                      setShowThemeModal(false);
                    }}
                    className={`group relative flex cursor-pointer flex-col justify-between space-y-2 rounded-2xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 ${
                      isSelected
                        ? "border-gold-400 bg-gold-400/10 shadow-md ring-2 ring-gold-400/40"
                        : "border-border/60 bg-zinc-50 hover:border-gold-400 dark:bg-zinc-900/60"
                    }`}
                  >
                    {/* Mockup Preview Card */}
                    <div className="relative flex aspect-3/4 w-full items-center justify-center overflow-hidden rounded-xl bg-zinc-200 dark:bg-zinc-800">
                      <div className="p-2 text-center">
                        <Sparkles className="mx-auto mb-1 h-6 w-6 text-gold-500" aria-hidden="true" />
                        <span className="text-[10px] font-bold text-foreground">
                          {theme.name}
                        </span>
                      </div>

                      {theme.isPremium && (
                        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-linear-to-r from-gold-400 to-gold-600 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                          <Sparkles className="h-2 w-2 fill-current" aria-hidden="true" />
                          <span>PREMIUM</span>
                        </div>
                      )}

                      {isSelected && (
                        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-gold-400 px-2 py-0.5 text-[9px] font-bold text-white">
                          <Check className="h-2.5 w-2.5" aria-hidden="true" />
                          <span>Aktif</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>{theme.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
