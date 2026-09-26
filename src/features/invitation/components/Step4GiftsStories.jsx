"use client";

import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { Heart, Plus, Trash2, LayoutGrid, Quote, Image as ImageIcon, Sparkles, BookOpen, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/shared/FileUploader";

const QUOTES_PRESETS = [
  {
    title: "QS. Ar-Rum Ayat 21 (Islami)",
    text: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang. (QS. Ar-Rum: 21)",
  },
  {
    title: "QS. An-Nisa Ayat 1 (Islami)",
    text: "Hai sekalian manusia, bertakwalah kepada Tuhan-mu yang telah menciptakan kamu dari seorang diri, dan dari padanya Allah menciptakan isterinya; dan dari pada keduanya Allah memperkembangbiakkan laki-laki dan perempuan yang banyak.",
  },
  {
    title: "1 Korintus 13:4-7 (Kristiani)",
    text: "Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong. Ia tidak melakukan yang tidak sopan dan tidak mencari keuntungan diri sendiri.",
  },
  {
    title: "Puisi Cinta Romantis (Modern)",
    text: "Dalam setiap detak jantung dan ribuan kisah yang kita lewati bersama, cinta ini tumbuh menjadijanji suci untuk saling menggenggam sepanjang usia.",
  },
];

const STORY_PRESETS = [
  { title: "Pertama Bertemu", date: "2020", description: "Awal mula takdir mempertemukan kami di sebuah acara kampus." },
  { title: "Lamaran", date: "2024", description: "Momen membahagiakan saat keluarga besar saling bertemu dan mengikat janji." },
  { title: "Menuju Pelaminan", date: "2026", description: "Setelah melewati banyak cerita bersama, kami memantapkan hati untuk melangkah ke pernikahan." },
];

export function Step4GiftsStories({ register, control, watch, setValue, quoteTemplates = [] }) {
  const displayQuotes = quoteTemplates.length > 0
    ? quoteTemplates.map((q) => ({ title: q.title, text: q.content }))
    : QUOTES_PRESETS;
  const [showQuotesModal, setShowQuotesModal] = useState(false);
  const galleryLayout = watch("galleryLayout") || "CAROUSEL";

  const {
    fields: storyFields,
    append: appendStory,
    remove: removeStory,
  } = useFieldArray({
    control,
    name: "loveStories",
  });

  const {
    fields: galleryFields,
    append: appendGallery,
    remove: removeGallery,
  } = useFieldArray({
    control,
    name: "galleries",
  });

  const handleApplyStoryPresets = () => {
    STORY_PRESETS.forEach((story) => appendStory(story));
  };

  return (
    <div className="animate-in fade-in space-y-6 duration-200">
      <div className="space-y-1">
        <h3 className="font-heading text-xl font-bold text-foreground">
          Step 4: Konten Undangan
        </h3>
        <p className="text-xs font-light text-muted-foreground">
          Lengkapi linimasa cerita cinta, galeri foto prewedding, dan kutipan ayat suci.
        </p>
      </div>

      {/* Modul A: Love Story (Kisah Cinta) */}
      <div className="space-y-4 rounded-3xl border border-border/60 bg-zinc-50 p-5 dark:bg-zinc-900/60">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="flex items-center gap-2 font-heading text-base font-bold text-foreground">
              <Heart className="h-4 w-4 fill-current text-accent" aria-hidden="true" />
              <span>Love Story</span>
            </h4>
            <p className="text-xs font-light text-muted-foreground">
              Ceritakan perjalanan cinta kalian (opsional).
            </p>
          </div>
        </div>

        {/* Info Callout Banner */}
        <div className="flex items-start gap-2 rounded-2xl border border-gold-400/25 bg-gold-50 p-3.5 text-xs text-gold-800 dark:border-gold-400/20 dark:bg-gold-400/10 dark:text-gold-200">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
          <p className="font-light leading-relaxed">
            Klik <span className="font-bold">&quot;+ Tambah Cerita&quot;</span> untuk menambahkan momen, misalnya: <span className="font-bold">&quot;2020 — Pertama Bertemu&quot;</span>, <span className="font-bold">&quot;2023 — Lamaran&quot;</span>. Bagian ini opsional.
          </p>
        </div>

        {/* Dynamic Story Cards List */}
        <div className="space-y-3">
          {storyFields.map((field, index) => (
            <div
              key={field.id}
              className="relative space-y-3 rounded-2xl border border-border/60 bg-white p-4 dark:bg-zinc-800"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-400/20 text-xs font-bold text-gold-500">
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold text-foreground">Momen #{index + 1}</span>
                </div>

                <Button
                  type="button"
                  onClick={() => removeStory(index)}
                  variant="destructive"
                  size="icon-sm"
                  aria-label={`Hapus momen ${index + 1}`}
                  className="rounded-full"
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                  <label htmlFor={`loveStories-${index}-date`} className="text-[11px] font-semibold text-muted-foreground">Tahun / Tanggal</label>
                  <input
                    id={`loveStories-${index}-date`}
                    type="text"
                    placeholder="Contoh: 2025"
                    {...register(`loveStories.${index}.date`)}
                    className="w-full rounded-xl border border-border bg-zinc-50 px-3 py-2 text-xs focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-900"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label htmlFor={`loveStories-${index}-title`} className="text-[11px] font-semibold text-muted-foreground">Judul Momen</label>
                  <input
                    id={`loveStories-${index}-title`}
                    type="text"
                    placeholder="Contoh: Menuju Pelaminan"
                    {...register(`loveStories.${index}.title`)}
                    className="w-full rounded-xl border border-border bg-zinc-50 px-3 py-2 text-xs focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor={`loveStories-${index}-description`} className="text-[11px] font-semibold text-muted-foreground">Deskripsi Cerita</label>
                <textarea
                  id={`loveStories-${index}-description`}
                  rows={2}
                  placeholder="Setelah melewati banyak cerita bersama, kami memantapkan hati..."
                  {...register(`loveStories.${index}.description`)}
                  className="w-full rounded-xl border border-border bg-zinc-50 px-3 py-2 text-xs leading-relaxed focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-900"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Story Action Bar */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            type="button"
            onClick={() =>
              appendStory({
                title: "Momen Baru",
                date: "2026",
                description: "Tuliskan momen indah perjalanan cinta Anda di sini.",
              })
            }
            variant="outline"
            size="sm"
          >
            <Plus aria-hidden="true" />
            <span>Tambah Cerita</span>
          </Button>

          {storyFields.length === 0 && (
            <Button
              type="button"
              onClick={handleApplyStoryPresets}
              variant="outline"
              size="sm"
            >
              <Sparkles className="text-gold-500" aria-hidden="true" />
              <span>Pilih Template Cerita</span>
            </Button>
          )}
        </div>
      </div>

      {/* Modul B: Galeri Foto (Photo Gallery) */}
      <div className="space-y-4 rounded-3xl border border-border/60 bg-zinc-50 p-5 dark:bg-zinc-900/60">
        <div className="space-y-0.5">
          <h4 className="flex items-center gap-2 font-heading text-base font-bold text-foreground">
            <ImageIcon className="h-4 w-4 text-gold-500" aria-hidden="true" />
            <span>Galeri Foto</span>
          </h4>
          <p className="text-xs font-light text-muted-foreground">
            Upload foto-foto prewedding atau momen spesial.
          </p>
        </div>

        <div className="flex items-start gap-2 rounded-2xl border border-gold-400/25 bg-gold-50 p-3.5 text-xs text-gold-800 dark:border-gold-400/20 dark:bg-gold-400/10 dark:text-gold-200">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
          <p className="font-light leading-relaxed">
            Bisa upload banyak foto sekaligus. Pilih mode <span className="font-bold">Carousel</span> (slideshow) atau <span className="font-bold">Masonry</span> (grid bertumpuk). Bagian ini opsional.
          </p>
        </div>

        {/* Tipe Tampilan Galeri Selector Cards */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-foreground">Tipe Tampilan Galeri</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              aria-pressed={galleryLayout === "CAROUSEL"}
              onClick={() => setValue("galleryLayout", "CAROUSEL")}
              className={`space-y-1 rounded-2xl border p-4 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 ${
                galleryLayout === "CAROUSEL"
                  ? "border-gold-400 bg-gold-400 text-white shadow-md"
                  : "border-border/60 bg-white text-muted-foreground hover:border-gold-400 dark:bg-zinc-800"
              }`}
            >
              <Sparkles className="mx-auto h-5 w-5" aria-hidden="true" />
              <span className="block text-xs font-bold">Carousel</span>
              <span className="block text-[10px] opacity-80">Slideshow satu per satu</span>
            </button>

            <button
              type="button"
              aria-pressed={galleryLayout === "MASONRY"}
              onClick={() => setValue("galleryLayout", "MASONRY")}
              className={`space-y-1 rounded-2xl border p-4 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 ${
                galleryLayout === "MASONRY"
                  ? "border-gold-400 bg-gold-400 text-white shadow-md"
                  : "border-border/60 bg-white text-muted-foreground hover:border-gold-400 dark:bg-zinc-800"
              }`}
            >
              <LayoutGrid className="mx-auto h-5 w-5" aria-hidden="true" />
              <span className="block text-xs font-bold">Masonry</span>
              <span className="block text-[10px] opacity-80">Grid bertumpuk estetik</span>
            </button>
          </div>
        </div>

        {/* Multi-Photo Input */}
        <div className="space-y-3 rounded-2xl border-2 border-dashed border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">Daftar Foto Galeri ({galleryFields.length})</span>
            <Button
              type="button"
              onClick={() => appendGallery({ mediaUrl: "", type: "PHOTO" })}
              variant="outline"
              size="sm"
            >
              <Plus aria-hidden="true" />
              <span>Tambah Foto</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {galleryFields.map((field, index) => (
              <div key={field.id} className="relative space-y-3 rounded-2xl border border-border/60 bg-zinc-50 p-4 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Foto Galeri #{index + 1}
                  </span>
                  <Button
                    type="button"
                    onClick={() => removeGallery(index)}
                    variant="ghost"
                    size="sm"
                    aria-label={`Hapus foto galeri ${index + 1}`}
                    className="gap-1 text-[10px] font-semibold uppercase tracking-wider text-destructive hover:text-destructive/80"
                  >
                    <Trash2 aria-hidden="true" />
                    <span>Hapus</span>
                  </Button>
                </div>
                <FileUploader
                  value={watch(`galleries.${index}.mediaUrl`)}
                  onChange={(url) => setValue(`galleries.${index}.mediaUrl`, url)}
                  accept="image/*"
                  maxSize={5 * 1024 * 1024}
                  helperText="Format JPG, PNG, atau WEBP (Maks 5MB)"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modul C: Kutipan / Ayat (Quotes) */}
      <div className="space-y-3 rounded-3xl border border-border/60 bg-zinc-50 p-5 dark:bg-zinc-900/60">
        <div className="space-y-0.5">
          <h4 className="flex items-center gap-2 font-heading text-base font-bold text-foreground">
            <Quote className="h-4 w-4 text-gold-500" aria-hidden="true" />
            <span>Kutipan / Ayat</span>
          </h4>
          <p className="text-xs font-light text-muted-foreground">
            Kutipan atau ayat yang ditampilkan di undangan.
          </p>
        </div>

        <div className="flex items-start gap-2 rounded-2xl border border-gold-400/25 bg-gold-50 p-3.5 text-xs text-gold-800 dark:border-gold-400/20 dark:bg-gold-400/10 dark:text-gold-200">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
          <p className="font-light leading-relaxed">
            Contoh: Kutipan dari film, puisi, atau kitab suci (Ar-Rum ayat 21). Kosongkan jika tidak diperlukan.
          </p>
        </div>

        <label htmlFor="quotes" className="sr-only">
          Kutipan atau ayat undangan
        </label>
        <textarea
          id="quotes"
          rows={4}
          placeholder="Tuliskan ayat suci atau kutipan romantis..."
          {...register("quotes")}
          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-xs leading-relaxed transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-800"
        />

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => setShowQuotesModal(true)}
            variant="outline"
            size="sm"
          >
            <BookOpen aria-hidden="true" />
            <span>Pilih dari Template</span>
          </Button>
        </div>
      </div>

      {/* Modal Popup Preset Kutipan / Ayat */}
      {showQuotesModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="quotes-modal-title"
          className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200"
        >
          <div className="max-h-[85vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-3xl border border-border/60 bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <h3 id="quotes-modal-title" className="font-heading text-base font-bold text-foreground">
                Pilihan Template Ayat &amp; Kutipan
              </h3>
              <button
                type="button"
                onClick={() => setShowQuotesModal(false)}
                aria-label="Tutup dialog template kutipan"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 dark:bg-zinc-800"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-3">
              {displayQuotes.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setValue("quotes", preset.text, { shouldValidate: true });
                    setShowQuotesModal(false);
                  }}
                  className="w-full space-y-1 rounded-2xl border border-border/60 bg-zinc-50 p-3.5 text-left transition-all hover:border-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 dark:bg-zinc-900"
                >
                  <p className="text-xs font-bold text-gold-500">{preset.title}</p>
                  <p className="text-[11px] italic leading-relaxed text-muted-foreground">
                    &ldquo;{preset.text}&rdquo;
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
