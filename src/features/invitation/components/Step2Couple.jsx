"use client";

import { useState } from "react";
import { User, Image as ImageIcon, Info, Trash2 } from "lucide-react";
import { FileUploader } from "@/components/shared/FileUploader";

export function Step2Couple({ register, errors, watch, setValue }) {
  const groomPhotoUrl = watch("groomPhotoUrl");
  const bridePhotoUrl = watch("bridePhotoUrl");
  const coverUrl = watch("coverUrl");

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="space-y-1">
        <h3 className="font-heading text-xl font-bold text-foreground">
          Step 2: Data Mempelai &amp; Foto Sampul
        </h3>
        <p className="text-xs text-muted-foreground font-light">
          Isi informasi pasangan pengantin pria dan wanita yang berbahagia.
        </p>
      </div>

      {/* Callout Banner Info */}
      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-light">
          Hanya <span className="font-bold">Nama Panggilan &amp; Nama Lengkap</span> yang wajib. Data orang tua dan foto opsional, namun akan terlihat lebih berkesan jika diisi lengkap.
        </p>
      </div>

      {/* Grid 2 Kolom Mempelai Pria & Mempelai Wanita */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kolom Mempelai Pria */}
        <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/60 space-y-4">
          <h4 className="font-heading text-base font-bold text-[#C8A96A] flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Mempelai Pria</span>
          </h4>

          {/* Upload Avatar Pria */}
          <div className="py-2">
            <FileUploader
              value={groomPhotoUrl}
              onChange={(url) => setValue("groomPhotoUrl", url)}
              accept="image/*"
              maxSize={5 * 1024 * 1024}
              helperText="Format JPG, PNG, atau WEBP (Maks 5MB)"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground">
              Nama Panggilan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: William"
              {...register("groomNickname")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50 transition-all"
            />
            {errors.groomNickname && (
              <p className="text-[10px] text-rose-500">{errors.groomNickname.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: William Jonathan Tanuwijaya"
              {...register("groomFullName")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50 transition-all"
            />
            {errors.groomFullName && (
              <p className="text-[10px] text-rose-500">{errors.groomFullName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground">
              Putra dari Bapak
            </label>
            <input
              type="text"
              placeholder="Contoh: Bapak William Jonathan"
              {...register("groomFather")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground">
              dan Ibu
            </label>
            <input
              type="text"
              placeholder="Contoh: Ibu William Jonathan"
              {...register("groomMother")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50 transition-all"
            />
          </div>
        </div>

        {/* Kolom Mempelai Wanita */}
        <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/60 space-y-4">
          <h4 className="font-heading text-base font-bold text-[#C8A96A] flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Mempelai Wanita</span>
          </h4>

          {/* Upload Avatar Wanita */}
          <div className="py-2">
            <FileUploader
              value={bridePhotoUrl}
              onChange={(url) => setValue("bridePhotoUrl", url)}
              accept="image/*"
              maxSize={5 * 1024 * 1024}
              helperText="Format JPG, PNG, atau WEBP (Maks 5MB)"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground">
              Nama Panggilan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Eleanor"
              {...register("brideNickname")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50 transition-all"
            />
            {errors.brideNickname && (
              <p className="text-[10px] text-rose-500">{errors.brideNickname.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Eleanor Grace Tanuwidjaja"
              {...register("brideFullName")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50 transition-all"
            />
            {errors.brideFullName && (
              <p className="text-[10px] text-rose-500">{errors.brideFullName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground">
              Putri dari Bapak
            </label>
            <input
              type="text"
              placeholder="Contoh: Bapak William Jonathan"
              {...register("brideFather")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground">
              dan Ibu
            </label>
            <input
              type="text"
              placeholder="Contoh: Ibu William Jonathan"
              {...register("brideMother")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Card Section Foto Sampul */}
      <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/60 space-y-4">
        <div className="space-y-1">
          <h4 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#C8A96A]" />
            <span>Foto Sampul</span>
          </h4>
          <p className="text-xs text-muted-foreground font-light">
            Foto utama yang ditampilkan di halaman depan undangan.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="font-light">
            Gunakan foto <span className="font-bold">portrait</span> (tegak) untuk hasil terbaik. Foto prewedding sangat direkomendasikan!
          </p>
        </div>

        <div className="py-2">
          <FileUploader
            value={coverUrl}
            onChange={(url) => setValue("coverUrl", url)}
            accept="image/*"
            maxSize={5 * 1024 * 1024}
            helperText="Gunakan foto portrait (tegak) untuk hasil terbaik. Maks 5MB."
          />
        </div>
      </div>
    </div>
  );
}
