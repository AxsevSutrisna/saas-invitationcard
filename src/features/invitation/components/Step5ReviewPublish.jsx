"use client";

import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { CreditCard, Plus, Trash2, Gift, Music, Sparkles, Volume2, VolumeX, Disc, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/shared/FileUploader";

const MUSIC_PRESETS = [
  { title: "Nadhif Basalamah - Bergema Sampai Selamanya", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Judika - Sampai Akhir", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "Payung Teduh - Akad", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { title: "Shane Filan - Beautiful in White", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
];

export function Step5ReviewPublish({ register, control, watch, setValue, isSubmitting, musicTemplates = [], isEdit = false }) {
  const displayMusics = musicTemplates.length > 0
    ? musicTemplates.map((m) => ({ title: m.title, url: m.url }))
    : MUSIC_PRESETS;
  const [showMusicModal, setShowMusicModal] = useState(false);
  const musicTitle = watch("musicTitle") || "Nadhif Basalamah - Bergema Sampai Selamanya";
  const musicUrl = watch("musicUrl") || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  const isMusicEnabled = watch("isMusicEnabled") !== false;

  const {
    fields: giftFields,
    append: appendGift,
    remove: removeGift,
  } = useFieldArray({
    control,
    name: "gifts",
  });

  return (
    <div className="animate-in fade-in space-y-6 duration-200">
      <div className="space-y-1">
        <h3 className="font-heading text-xl font-bold text-foreground">
          Step 5: Finalisasi Undangan
        </h3>
        <p className="text-xs font-light text-muted-foreground">
          Lengkapi informasi rekening amplop digital, pengiriman kado fisik, dan musik latar.
        </p>
      </div>

      {/* Modul A: Informasi Bank (Gift) (Maksimal 2 Rekening) */}
      <div className="space-y-4 rounded-3xl border border-border/60 bg-zinc-50 p-5 dark:bg-zinc-900/60">
        <div className="space-y-0.5">
          <h4 className="flex items-center gap-2 font-heading text-base font-bold text-foreground">
            <CreditCard className="h-4 w-4 text-gold-500" aria-hidden="true" />
            <span>Informasi Bank (Gift)</span>
          </h4>
          <p className="text-xs font-light text-muted-foreground">
            Rekening untuk amplop digital. Bisa lebih dari satu (Maksimal 2 rekening).
          </p>
        </div>

        <div className="rounded-2xl border border-gold-400/25 bg-gold-50 p-3.5 text-xs text-gold-800 dark:border-gold-400/20 dark:bg-gold-400/10 dark:text-gold-200">
          <p className="font-light leading-relaxed">
            ℹ️ Tamu bisa mengirim hadiah uang digital. Klik <span className="font-bold">&quot;+ Tambah Rekening&quot;</span> lalu isi nama bank, nomor rekening, dan atas nama. Maksimal 2 rekening.
          </p>
        </div>

        <div className="space-y-3">
          {giftFields.map((field, index) => (
            <div
              key={field.id}
              className="relative space-y-3 rounded-2xl border border-border/60 bg-white p-4 dark:bg-zinc-800"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Rekening #{index + 1}
                </span>
                <Button
                  type="button"
                  onClick={() => removeGift(index)}
                  variant="destructive"
                  size="icon-sm"
                  aria-label={`Hapus rekening ${index + 1}`}
                  className="rounded-full"
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                  <label htmlFor={`gifts-${index}-type`} className="text-[11px] font-semibold text-muted-foreground">Jenis</label>
                  <select
                    id={`gifts-${index}-type`}
                    {...register(`gifts.${index}.type`)}
                    className="w-full rounded-xl border border-border bg-zinc-50 px-3 py-2 text-xs focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-900"
                  >
                    <option value="BANK">Bank Transfer</option>
                    <option value="EWALLET">E-Wallet (GoPay/OVO/ShopeePay)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor={`gifts-${index}-providerName`} className="text-[11px] font-semibold text-muted-foreground">Nama Bank / E-Wallet</label>
                  <input
                    id={`gifts-${index}-providerName`}
                    type="text"
                    placeholder="BCA / Mandiri / GoPay"
                    {...register(`gifts.${index}.providerName`)}
                    className="w-full rounded-xl border border-border bg-zinc-50 px-3.5 py-2 text-xs focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-900"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor={`gifts-${index}-accountNumber`} className="text-[11px] font-semibold text-muted-foreground">Nomor Rekening / HP</label>
                  <input
                    id={`gifts-${index}-accountNumber`}
                    type="text"
                    placeholder="1234567890"
                    {...register(`gifts.${index}.accountNumber`)}
                    className="w-full rounded-xl border border-border bg-zinc-50 px-3.5 py-2 text-xs focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor={`gifts-${index}-accountName`} className="text-[11px] font-semibold text-muted-foreground">Atas Nama Pemilik</label>
                <input
                  id={`gifts-${index}-accountName`}
                  type="text"
                  placeholder="William Jonathan Tanuwidjaja"
                  {...register(`gifts.${index}.accountName`)}
                  className="w-full rounded-xl border border-border bg-zinc-50 px-3.5 py-2 text-xs focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-900"
                />
              </div>

              {/* Upload QR muncul khusus untuk E-Wallet (QRIS/GoPay/OVO/dsb) */}
              {watch(`gifts.${index}.type`) === "EWALLET" && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    Kode QR / QRIS <span className="font-normal">(opsional)</span>
                  </label>
                  <FileUploader
                    value={watch(`gifts.${index}.qrCodeUrl`)}
                    onChange={(url) =>
                      setValue(`gifts.${index}.qrCodeUrl`, url, { shouldDirty: true })
                    }
                    accept="image/*"
                    helperText="Unggah gambar QRIS agar tamu bisa langsung scan untuk mengirim hadiah."
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {giftFields.length < 2 && (
          <Button
            type="button"
            onClick={() =>
              appendGift({
                type: "BANK",
                providerName: "BCA",
                accountName: "William Jonathan Tanuwidjaja",
                accountNumber: "1234567890",
              })
            }
            variant="outline"
            size="sm"
          >
            <Plus aria-hidden="true" />
            <span>Tambah Rekening (Maks. 2)</span>
          </Button>
        )}
      </div>

      {/* Modul B: Alamat Pengiriman Kado Fisik (Opsional) */}
      <div className="space-y-4 rounded-3xl border border-border/60 bg-zinc-50 p-5 dark:bg-zinc-900/60">
        <div className="space-y-0.5">
          <h4 className="flex items-center gap-2 font-heading text-base font-bold text-foreground">
            <Gift className="h-4 w-4 text-gold-500" aria-hidden="true" />
            <span>Alamat Pengiriman Kado Fisik (Opsional)</span>
          </h4>
          <p className="text-xs font-light text-muted-foreground">
            Alamat bagi tamu yang ingin mengirim kado fisik/paket secara langsung.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="physicalGiftAddress" className="text-[11px] font-semibold text-muted-foreground">
            Alamat Lengkap Penerima
          </label>
          <textarea
            id="physicalGiftAddress"
            rows={3}
            placeholder="Contoh: Jl. Mawar No. 12, RT 01/RW 02, Kec. Coblong, Kota Bandung, Jawa Barat (40135)"
            {...register("physicalGiftAddress")}
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-xs leading-relaxed transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-800"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="physicalGiftReceiver" className="text-[11px] font-semibold text-muted-foreground">Nama Penerima</label>
            <input
              id="physicalGiftReceiver"
              type="text"
              placeholder="Contoh: William & Elleanor"
              {...register("physicalGiftReceiver")}
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-800"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="physicalGiftPhone" className="text-[11px] font-semibold text-muted-foreground">No. Telepon Penerima</label>
            <input
              id="physicalGiftPhone"
              type="text"
              placeholder="Contoh: 081234567890"
              {...register("physicalGiftPhone")}
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-800"
            />
          </div>
        </div>
      </div>

      {/* Modul C: Musik Latar */}
      <div className="space-y-4 rounded-3xl border border-border/60 bg-zinc-50 p-5 dark:bg-zinc-900/60">
        <div className="space-y-0.5">
          <h4 className="flex items-center gap-2 font-heading text-base font-bold text-foreground">
            <Music className="h-4 w-4 text-gold-500" aria-hidden="true" />
            <span>Musik Latar</span>
          </h4>
          <p className="text-xs font-light text-muted-foreground">
            Lagu yang berputar otomatis saat undangan dibuka.
          </p>
        </div>

        <div className="rounded-2xl border border-gold-400/25 bg-gold-50 p-3.5 text-xs text-gold-800 dark:border-gold-400/20 dark:bg-gold-400/10 dark:text-gold-200">
          <p className="font-light leading-relaxed">
            ℹ️ Setiap tema sudah memiliki musik default. Kamu bisa menggantinya dengan upload lagu sendiri, music default, atau dari pustaka lagu.
          </p>
        </div>

        {/* FileUploader Area for Music */}
        <div className="space-y-4">
          <FileUploader
            value={isMusicEnabled ? musicUrl : ""}
            onChange={(url) => {
              if (url) {
                setValue("musicUrl", url);
                setValue("musicTitle", "Kustom Musik Unggahan");
                setValue("isMusicEnabled", true);
              } else {
                setValue("musicUrl", "");
                setValue("musicTitle", "Tanpa Musik");
                setValue("isMusicEnabled", false);
              }
            }}
            accept="audio/*"
            maxSize={10 * 1024 * 1024} // 10MB
            label="Unggah File Musik Latar (.mp3)"
            helperText="Mendukung format MP3 atau WAV, Maksimal 10MB."
          />

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={() => setShowMusicModal(true)}
              variant="outline"
              size="sm"
            >
              <Music aria-hidden="true" />
              <span>Pilih Dari Pustaka Lagu</span>
            </Button>

            <Button
              type="button"
              onClick={() => {
                setValue("isMusicEnabled", !isMusicEnabled);
                if (isMusicEnabled) {
                  setValue("isMusicEnabled", false);
                } else {
                  setValue("isMusicEnabled", true);
                  if (!musicUrl) {
                    setValue("musicUrl", "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
                    setValue("musicTitle", "Nadhif Basalamah - Bergema Sampai Selamanya");
                  }
                }
              }}
              variant={isMusicEnabled ? "outline" : "destructive"}
              size="sm"
            >
              {isMusicEnabled ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
              <span>{isMusicEnabled ? "Nonaktifkan Musik" : "Aktifkan Musik"}</span>
            </Button>
          </div>

          {isMusicEnabled && musicTitle && (
            <div className="flex items-center gap-1.5 rounded-xl bg-zinc-100 px-3 py-2 text-[10px] text-muted-foreground dark:bg-zinc-800">
              <Disc className="h-3.5 w-3.5 animate-spin text-gold-500" aria-hidden="true" />
              <span>Musik Aktif: <strong className="text-foreground">{musicTitle}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Modal Popup Pustaka Lagu */}
      {showMusicModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="music-modal-title"
          className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200"
        >
          <div className="max-h-[85vh] w-full max-w-md space-y-4 overflow-y-auto rounded-3xl border border-border/60 bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <h3 id="music-modal-title" className="font-heading text-base font-bold text-foreground">
                Pustaka Lagu Pernikahan
              </h3>
              <button
                type="button"
                onClick={() => setShowMusicModal(false)}
                aria-label="Tutup dialog pustaka lagu"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 dark:bg-zinc-800"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-2">
              {displayMusics.map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setValue("musicTitle", m.title);
                    setValue("musicUrl", m.url);
                    setValue("isMusicEnabled", true);
                    setShowMusicModal(false);
                  }}
                  className="flex w-full items-center justify-between rounded-2xl border border-border/60 bg-zinc-50 p-3 text-left transition-all hover:border-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 dark:bg-zinc-900"
                >
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4 text-gold-500" aria-hidden="true" />
                    <span className="text-xs font-semibold text-foreground">{m.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modul D: Tombol Final Publikasi Undangan */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-border/40 pt-4 sm:flex-row">
        <p className="text-xs font-light text-muted-foreground">
          Data dapat diubah kapan saja lewat menu edit di Dashboard.
        </p>

        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="w-full sm:w-auto"
        >
          <Sparkles className="fill-current" aria-hidden="true" />
          {isSubmitting
            ? "Memproses..."
            : isEdit
            ? "Simpan Perubahan"
            : "Publikasikan Undangan"}
        </Button>
      </div>
    </div>
  );
}
