"use client";

import { User, Image as ImageIcon, Info } from "lucide-react";
import { FileUploader } from "@/components/shared/FileUploader";
import { TextField } from "@/components/ui/Field";

export function Step2Couple({ register, errors, watch, setValue, invitationId }) {
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
              invitationId={invitationId}
              helperText="Format JPG, PNG, atau WEBP (Maks 5MB)"
            />
          </div>

          <TextField
            label="Nama Panggilan"
            htmlFor="groomNickname"
            required
            error={errors.groomNickname?.message}
            type="text"
            placeholder="Contoh: William"
            {...register("groomNickname")}
          />

          <TextField
            label="Nama Lengkap"
            htmlFor="groomFullName"
            required
            error={errors.groomFullName?.message}
            type="text"
            placeholder="Contoh: William Jonathan Tanuwijaya"
            {...register("groomFullName")}
          />

          <TextField
            label="Putra dari Bapak"
            htmlFor="groomFather"
            type="text"
            placeholder="Contoh: Bapak William Jonathan"
            {...register("groomFather")}
          />

          <TextField
            label="dan Ibu"
            htmlFor="groomMother"
            type="text"
            placeholder="Contoh: Ibu William Jonathan"
            {...register("groomMother")}
          />
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
              invitationId={invitationId}
              helperText="Format JPG, PNG, atau WEBP (Maks 5MB)"
            />
          </div>

          <TextField
            label="Nama Panggilan"
            htmlFor="brideNickname"
            required
            error={errors.brideNickname?.message}
            type="text"
            placeholder="Contoh: Eleanor"
            {...register("brideNickname")}
          />

          <TextField
            label="Nama Lengkap"
            htmlFor="brideFullName"
            required
            error={errors.brideFullName?.message}
            type="text"
            placeholder="Contoh: Eleanor Grace Tanuwidjaja"
            {...register("brideFullName")}
          />

          <TextField
            label="Putri dari Bapak"
            htmlFor="brideFather"
            type="text"
            placeholder="Contoh: Bapak William Jonathan"
            {...register("brideFather")}
          />

          <TextField
            label="dan Ibu"
            htmlFor="brideMother"
            type="text"
            placeholder="Contoh: Ibu William Jonathan"
            {...register("brideMother")}
          />
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
            invitationId={invitationId}
            helperText="Gunakan foto portrait (tegak) untuk hasil terbaik. Maks 5MB."
          />
        </div>
      </div>
    </div>
  );
}
