"use client";

import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { Heart, Plus, Trash2, LayoutGrid, Quote, Image as ImageIcon, Sparkles, BookOpen, Info, Check, X } from "lucide-react";
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
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="space-y-1">
        <h3 className="font-heading text-xl font-bold text-foreground">
          Step 4: Konten Undangan
        </h3>
        <p className="text-xs text-muted-foreground font-light">
          Lengkapi linimasa cerita cinta, galeri foto prewedding, dan kutipan ayat suci.
        </p>
      </div>

      {/* Modul A: ♡ Love Story (Kisah Cinta) */}
      <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/60 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-current" />
              <span>Love Story</span>
            </h4>
            <p className="text-xs text-muted-foreground font-light">
              Ceritakan perjalanan cinta kalian (opsional).
            </p>
          </div>
        </div>

        {/* Info Callout Banner */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="font-light leading-relaxed">
            Klik <span className="font-bold">&quot;+ Tambah Cerita&quot;</span> untuk menambahkan momen, misalnya: <span className="font-bold">&quot;2020 — Pertama Bertemu&quot;</span>, <span className="font-bold">&quot;2023 — Lamaran&quot;</span>. Bagian ini opsional.
          </p>
        </div>

        {/* Dynamic Story Cards List */}
        <div className="space-y-3">
          {storyFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-border/60 space-y-3 relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#C8A96A]/20 text-[#C8A96A] font-bold text-xs flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold text-foreground">Momen #{index + 1}</span>
                </div>

                <button
                  type="button"
                  onClick={() => removeStory(index)}
                  className="w-7 h-7 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 hover:text-rose-700 flex items-center justify-center text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Tahun / Tanggal</label>
                  <input
                    type="text"
                    placeholder="Contoh: 2025"
                    {...register(`loveStories.${index}.date`)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Judul Momen</label>
                  <input
                    type="text"
                    placeholder="Contoh: Menuju Pelaminan"
                    {...register(`loveStories.${index}.title`)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Deskripsi Cerita</label>
                <textarea
                  rows={2}
                  placeholder="Setelah melewati banyak cerita bersama, kami memantapkan hati..."
                  {...register(`loveStories.${index}.description`)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50 leading-relaxed"
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
            className="rounded-xl text-xs flex items-center gap-1.5 border-[#C8A96A]/40 text-[#C8A96A] hover:bg-[#C8A96A]/10"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Cerita</span>
          </Button>

          {storyFields.length === 0 && (
            <Button
              type="button"
              onClick={handleApplyStoryPresets}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Pilih Template Cerita</span>
            </Button>
          )}
        </div>
      </div>

      {/* Modul B: 🖼️ Galeri Foto (Photo Gallery) */}
      <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/60 space-y-4">
        <div className="space-y-0.5">
          <h4 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#C8A96A]" />
            <span>Galeri Foto</span>
          </h4>
          <p className="text-xs text-muted-foreground font-light">
            Upload foto-foto prewedding atau momen spesial.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="font-light leading-relaxed">
            Bisa upload banyak foto sekaligus. Pilih mode <span className="font-bold">Carousel</span> (slideshow) atau <span className="font-bold">Masonry</span> (grid bertumpuk). Bagian ini opsional.
          </p>
        </div>

        {/* Tipe Tampilan Galeri Selector Cards */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground">Tipe Tampilan Galeri</label>
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => setValue("galleryLayout", "CAROUSEL")}
              className={`p-4 rounded-2xl border cursor-pointer text-center space-y-1 transition-all ${
                galleryLayout === "CAROUSEL"
                  ? "bg-[#C8A96A] text-white border-[#C8A96A] shadow-md"
                  : "bg-white dark:bg-zinc-800 border-border/60 text-muted-foreground hover:border-[#C8A96A]"
              }`}
            >
              <Sparkles className="w-5 h-5 mx-auto" />
              <p className="text-xs font-bold">Carousel</p>
              <span className="text-[10px] block opacity-80">Slideshow satu per satu</span>
            </div>

            <div
              onClick={() => setValue("galleryLayout", "MASONRY")}
              className={`p-4 rounded-2xl border cursor-pointer text-center space-y-1 transition-all ${
                galleryLayout === "MASONRY"
                  ? "bg-[#C8A96A] text-white border-[#C8A96A] shadow-md"
                  : "bg-white dark:bg-zinc-800 border-border/60 text-muted-foreground hover:border-[#C8A96A]"
              }`}
            >
              <LayoutGrid className="w-5 h-5 mx-auto" />
              <p className="text-xs font-bold">Masonry</p>
              <span className="text-[10px] block opacity-80">Grid bertumpuk estetik</span>
            </div>
          </div>
        </div>

        {/* Multi-Photo Input */}
        <div className="p-4 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">Daftar Foto Galeri ({galleryFields.length})</span>
            <Button
              type="button"
              onClick={() => appendGallery({ mediaUrl: "", type: "PHOTO" })}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs flex items-center gap-1 border-[#C8A96A]/40 text-[#C8A96A]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Foto</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {galleryFields.map((field, index) => (
              <div key={field.id} className="relative p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-border/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Foto Galeri #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeGallery(index)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 text-[10px] font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
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

      {/* Modul C: 💬 Kutipan / Ayat (Quotes) */}
      <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/60 space-y-3">
        <div className="space-y-0.5">
          <h4 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
            <Quote className="w-4 h-4 text-[#C8A96A]" />
            <span>Kutipan / Ayat</span>
          </h4>
          <p className="text-xs text-muted-foreground font-light">
            Kutipan atau ayat yang ditampilkan di undangan.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="font-light leading-relaxed">
            Contoh: Kutipan dari film, puisi, atau kitab suci (Ar-Rum ayat 21). Kosongkan jika tidak diperlukan.
          </p>
        </div>

        <textarea
          rows={4}
          placeholder="Tuliskan ayat suci atau kutipan romantis..."
          {...register("quotes")}
          className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50 transition-all leading-relaxed"
        />

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => setShowQuotesModal(true)}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs flex items-center gap-1.5 border-[#C8A96A]/40 text-[#C8A96A] hover:bg-[#C8A96A]/10"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pilih dari Template</span>
          </Button>
        </div>
      </div>

      {/* Modal Popup Preset Kutipan / Ayat */}
      {showQuotesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-lg rounded-3xl border border-border/60 shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <h3 className="font-heading text-base font-bold text-foreground">
                Pilihan Template Ayat &amp; Kutipan
              </h3>
              <button
                type="button"
                onClick={() => setShowQuotesModal(false)}
                className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-muted-foreground flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {displayQuotes.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setValue("quotes", preset.text, { shouldValidate: true });
                    setShowQuotesModal(false);
                  }}
                  className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-border/60 hover:border-[#C8A96A] cursor-pointer space-y-1 transition-all"
                >
                  <p className="text-xs font-bold text-[#C8A96A]">{preset.title}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                    &ldquo;{preset.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
