"use client";

import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { CreditCard, Plus, Trash2, Gift, Music, Sparkles, CheckCircle2, Volume2, VolumeX, Upload, Disc, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const MUSIC_PRESETS = [
  { title: "Nadhif Basalamah - Bergema Sampai Selamanya", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Judika - Sampai Akhir", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "Payung Teduh - Akad", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { title: "Shane Filan - Beautiful in White", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
];

export function Step5ReviewPublish({ register, control, watch, setValue, isSubmitting }) {
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
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="space-y-1">
        <h3 className="font-heading text-xl font-bold text-foreground">
          Step 5: Finalisasi Undangan
        </h3>
        <p className="text-xs text-muted-foreground font-light">
          Lengkapi informasi rekening amplop digital, pengiriman kado fisik, dan musik latar.
        </p>
      </div>

      {/* Modul A: 💳 Informasi Bank (Gift) (Maksimal 2 Rekening) */}
      <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/60 space-y-4">
        <div className="space-y-0.5">
          <h4 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#C8A96A]" />
            <span>Informasi Bank (Gift)</span>
          </h4>
          <p className="text-xs text-muted-foreground font-light">
            Rekening untuk amplop digital. Bisa lebih dari satu (Maksimal 2 rekening).
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs flex items-start gap-2">
          <p className="font-light leading-relaxed">
            ℹ️ Tamu bisa mengirim hadiah uang digital. Klik <span className="font-bold">&quot;+ Tambah Rekening&quot;</span> lalu isi nama bank, nomor rekening, dan atas nama. Maksimal 2 rekening.
          </p>
        </div>

        <div className="space-y-3">
          {giftFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-border/60 space-y-3 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Rekening #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeGift(index)}
                  className="w-7 h-7 rounded-full bg-rose-50 text-rose-500 hover:text-rose-700 flex items-center justify-center text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Jenis</label>
                  <select
                    {...register(`gifts.${index}.type`)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-border/60 text-xs focus:outline-none"
                  >
                    <option value="BANK">Bank Transfer</option>
                    <option value="EWALLET">E-Wallet (GoPay/OVO/ShopeePay)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Nama Bank / E-Wallet</label>
                  <input
                    type="text"
                    placeholder="BCA / Mandiri / GoPay"
                    {...register(`gifts.${index}.providerName`)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-border/60 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Nomor Rekening / HP</label>
                  <input
                    type="text"
                    placeholder="1234567890"
                    {...register(`gifts.${index}.accountNumber`)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-border/60 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Atas Nama Pemilik</label>
                <input
                  type="text"
                  placeholder="Asep Sutrisna"
                  {...register(`gifts.${index}.accountName`)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-border/60 text-xs focus:outline-none"
                />
              </div>
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
                accountName: "Asep Sutrisna",
                accountNumber: "1234567890",
              })
            }
            variant="outline"
            size="sm"
            className="rounded-xl text-xs flex items-center gap-1.5 border-[#C8A96A]/40 text-[#C8A96A] hover:bg-[#C8A96A]/10"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Rekening (Maks. 2)</span>
          </Button>
        )}
      </div>

      {/* Modul B: 📦 Alamat Pengiriman Kado Fisik (Opsional) */}
      <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/60 space-y-4">
        <div className="space-y-0.5">
          <h4 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#C8A96A]" />
            <span>Alamat Pengiriman Kado Fisik (Opsional)</span>
          </h4>
          <p className="text-xs text-muted-foreground font-light">
            Alamat bagi tamu yang ingin mengirim kado fisik/paket secara langsung.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-muted-foreground">
            Alamat Lengkap Penerima
          </label>
          <textarea
            rows={3}
            placeholder="Contoh: Jl. Mawar No. 12, RT 01/RW 02, Kec. Coblong, Kota Bandung, Jawa Barat (40135)"
            {...register("physicalGiftAddress")}
            className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50 transition-all leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground">Nama Penerima</label>
            <input
              type="text"
              placeholder="Contoh: Asep & Salsa"
              {...register("physicalGiftReceiver")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-border/60 text-xs focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground">No. Telepon Penerima</label>
            <input
              type="text"
              placeholder="Contoh: 081234567890"
              {...register("physicalGiftPhone")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-border/60 text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Modul C: 🎵 Musik Latar */}
      <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/60 space-y-4">
        <div className="space-y-0.5">
          <h4 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
            <Music className="w-4 h-4 text-[#C8A96A]" />
            <span>Musik Latar</span>
          </h4>
          <p className="text-xs text-muted-foreground font-light">
            Lagu yang berputar otomatis saat undangan dibuka.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs">
          <p className="font-light leading-relaxed">
            ℹ️ Setiap tema sudah memiliki musik default. Kamu bisa menggantinya dengan upload lagu sendiri, music default, atau dari pustaka lagu.
          </p>
        </div>

        {/* Audio Player Preview Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-border/60 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#C8A96A]">
            <Disc className="w-4 h-4 animate-spin" />
            <span>Musik Default Tema: {musicTitle}</span>
          </div>

          {isMusicEnabled ? (
            <audio controls src={musicUrl} className="w-full h-9 rounded-xl" />
          ) : (
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 text-xs font-semibold text-center">
              🔇 Musik Dipatikan (Tanpa Musik)
            </div>
          )}
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            onClick={() => {
              const url = prompt("Masukkan URL File MP3:");
              if (url) {
                setValue("musicUrl", url);
                setValue("musicTitle", "Custom Song Upload");
                setValue("isMusicEnabled", true);
              }
            }}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Lagu</span>
          </Button>

          <Button
            type="button"
            onClick={() => setShowMusicModal(true)}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs flex items-center gap-1.5 border-[#C8A96A]/40 text-[#C8A96A]"
          >
            <Music className="w-3.5 h-3.5" />
            <span>Pustaka Lagu</span>
          </Button>

          <Button
            type="button"
            onClick={() => setValue("isMusicEnabled", !isMusicEnabled)}
            variant={isMusicEnabled ? "outline" : "destructive"}
            size="sm"
            className="rounded-xl text-xs flex items-center gap-1.5"
          >
            {isMusicEnabled ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isMusicEnabled ? "Tanpa Lagu" : "Aktifkan Musik"}</span>
          </Button>
        </div>
      </div>

      {/* Modal Popup Pustaka Lagu */}
      {showMusicModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-md rounded-3xl border border-border/60 shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <h3 className="font-heading text-base font-bold text-foreground">
                Pustaka Lagu Pernikahan
              </h3>
              <button
                type="button"
                onClick={() => setShowMusicModal(false)}
                className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-muted-foreground flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {MUSIC_PRESETS.map((m, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setValue("musicTitle", m.title);
                    setValue("musicUrl", m.url);
                    setValue("isMusicEnabled", true);
                    setShowMusicModal(false);
                  }}
                  className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-border/60 hover:border-[#C8A96A] cursor-pointer flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-[#C8A96A]" />
                    <span className="text-xs font-semibold text-foreground">{m.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modul D: Tombol Final Publikasi Undangan */}
      <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground font-light">
          Data dapat diubah kapan saja lewat menu edit di Dashboard.
        </p>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-gradient-to-r from-[#C8A96A] to-[#b39150] hover:from-[#b39150] hover:to-[#9e7e40] text-white font-semibold text-sm shadow-lg shadow-[#C8A96A]/25 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          {isSubmitting ? "Memproses..." : "Publikasikan Undangan"}
        </Button>
      </div>
    </div>
  );
}
