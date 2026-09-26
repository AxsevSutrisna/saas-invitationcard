"use client";

import { User, Image as ImageIcon, Info } from "lucide-react";
import { FileUploader } from "@/components/shared/FileUploader";

export function Step2Couple({ register, errors, watch, setValue }) {
  const groomPhotoUrl = watch("groomPhotoUrl");
  const bridePhotoUrl = watch("bridePhotoUrl");
  const coverUrl = watch("coverUrl");

  return (
    <div className="animate-in fade-in space-y-6 duration-200">
      <div className="space-y-1">
        <h3 className="font-heading text-xl font-bold text-foreground">
          Step 2: Data Mempelai &amp; Foto Sampul
        </h3>
        <p className="text-xs font-light text-muted-foreground">
          Isi informasi pasangan pengantin pria dan wanita yang berbahagia.
        </p>
      </div>

      {/* Callout Banner Info */}
      <div className="flex items-start gap-2.5 rounded-2xl border border-gold-400/25 bg-gold-50 p-4 text-xs text-gold-800 dark:border-gold-400/20 dark:bg-gold-400/10 dark:text-gold-200">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
        <p className="font-light leading-relaxed">
          Hanya <span className="font-bold">Nama Panggilan &amp; Nama Lengkap</span> yang wajib. Data orang tua dan foto opsional, namun akan terlihat lebih berkesan jika diisi lengkap.
        </p>
      </div>

      {/* Grid 2 Kolom Mempelai Pria & Mempelai Wanita */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Kolom Mempelai Pria */}
        <div className="space-y-4 rounded-3xl border border-border/60 bg-zinc-50 p-5 dark:bg-zinc-900/60">
          <h4 className="flex items-center gap-2 font-heading text-base font-bold text-gold-500">
            <User className="h-4 w-4" aria-hidden="true" />
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
            <label htmlFor="groomNickname" className="text-[11px] font-semibold text-muted-foreground">
              Nama Panggilan <span className="text-destructive">*</span>
            </label>
            <input
              id="groomNickname"
              type="text"
              placeholder="Contoh: William"
              {...register("groomNickname")}
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-800"
            />
            {errors.groomNickname && (
              <p className="text-[10px] text-destructive">{errors.groomNickname.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="groomFullName" className="text-[11px] font-semibold text-muted-foreground">
              Nama Lengkap <span className="text-destructive">*</span>
            </label>
            <input
              id="groomFullName"
              type="text"
              placeholder="Contoh: William Jonathan Tanuwijaya"
              {...register("groomFullName")}
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-800"
            />
            {errors.groomFullName && (
              <p className="text-[10px] text-destructive">{errors.groomFullName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="groomFather" className="text-[11px] font-semibold text-muted-foreground">
              Putra dari Bapak
            </label>
            <input
              id="groomFather"
              type="text"
              placeholder="Contoh: Bapak William Jonathan"
              {...register("groomFather")}
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-800"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="groomMother" className="text-[11px] font-semibold text-muted-foreground">
              dan Ibu
            </label>
            <input
              id="groomMother"
              type="text"
              placeholder="Contoh: Ibu William Jonathan"
              {...register("groomMother")}
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-800"
            />
          </div>
        </div>

        {/* Kolom Mempelai Wanita */}
        <div className="space-y-4 rounded-3xl border border-border/60 bg-zinc-50 p-5 dark:bg-zinc-900/60">
          <h4 className="flex items-center gap-2 font-heading text-base font-bold text-gold-500">
            <User className="h-4 w-4" aria-hidden="true" />
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
            <label htmlFor="brideNickname" className="text-[11px] font-semibold text-muted-foreground">
              Nama Panggilan <span className="text-destructive">*</span>
            </label>
            <input
              id="brideNickname"
              type="text"
              placeholder="Contoh: Eleanor"
              {...register("brideNickname")}
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-800"
            />
            {errors.brideNickname && (
              <p className="text-[10px] text-destructive">{errors.brideNickname.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="brideFullName" className="text-[11px] font-semibold text-muted-foreground">
              Nama Lengkap <span className="text-destructive">*</span>
            </label>
            <input
              id="brideFullName"
              type="text"
              placeholder="Contoh: Eleanor Grace Tanuwidjaja"
              {...register("brideFullName")}
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-800"
            />
            {errors.brideFullName && (
              <p className="text-[10px] text-destructive">{errors.brideFullName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="brideFather" className="text-[11px] font-semibold text-muted-foreground">
              Putri dari Bapak
            </label>
            <input
              id="brideFather"
              type="text"
              placeholder="Contoh: Bapak William Jonathan"
              {...register("brideFather")}
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-800"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="brideMother" className="text-[11px] font-semibold text-muted-foreground">
              dan Ibu
            </label>
            <input
              id="brideMother"
              type="text"
              placeholder="Contoh: Ibu William Jonathan"
              {...register("brideMother")}
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-800"
            />
          </div>
        </div>
      </div>

      {/* Card Section Foto Sampul */}
      <div className="space-y-4 rounded-3xl border border-border/60 bg-zinc-50 p-5 dark:bg-zinc-900/60">
        <div className="space-y-1">
          <h4 className="flex items-center gap-2 font-heading text-base font-bold text-foreground">
            <ImageIcon className="h-4 w-4 text-gold-500" aria-hidden="true" />
            <span>Foto Sampul</span>
          </h4>
          <p className="text-xs font-light text-muted-foreground">
            Foto utama yang ditampilkan di halaman depan undangan.
          </p>
        </div>

        <div className="flex items-start gap-2 rounded-2xl border border-gold-400/25 bg-gold-50 p-3.5 text-xs text-gold-800 dark:border-gold-400/20 dark:bg-gold-400/10 dark:text-gold-200">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
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
