"use client";

import { useRef, useState } from "react";
import { User, Image as ImageIcon, Info, Upload, Trash2, Loader2 } from "lucide-react";
import { uploadFileAction } from "@/server/actions/upload.actions";

export function Step2Couple({ register, errors, watch, setValue }) {
  const groomPhotoUrl = watch("groomPhotoUrl");
  const bridePhotoUrl = watch("bridePhotoUrl");
  const coverUrl = watch("coverUrl");

  const [uploadingField, setUploadingField] = useState("");

  const groomFileRef = useRef(null);
  const brideFileRef = useRef(null);
  const coverFileRef = useRef(null);

  // Handler upload file lokal ke folder public/uploads/ via Server Action
  const handleFileChange = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadFileAction(formData);
    setUploadingField("");

    if (res.success && res.url) {
      setValue(fieldName, res.url, { shouldValidate: true });
    } else {
      alert(res.error || "Gagal mengunggah gambar.");
    }
  };

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
          <div className="flex flex-col items-center justify-center space-y-2 py-2">
            <input
              type="file"
              ref={groomFileRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, "groomPhotoUrl")}
            />

            <div
              onClick={() => groomFileRef.current?.click()}
              className="w-24 h-24 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex flex-col items-center justify-center text-muted-foreground overflow-hidden relative group cursor-pointer hover:border-[#C8A96A] transition-all shadow-sm"
            >
              {uploadingField === "groomPhotoUrl" ? (
                <div className="flex flex-col items-center justify-center space-y-1 text-[#C8A96A]">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-[9px] font-semibold">Mengunggah...</span>
                </div>
              ) : groomPhotoUrl ? (
                <>
                  <img src={groomPhotoUrl} alt="Foto Mempelai Pria" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                    Ganti Foto
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-1">
                  <User className="w-6 h-6 stroke-[1.5]" />
                  <span className="text-[10px] font-semibold text-[#C8A96A]">Upload Foto</span>
                </div>
              )}
            </div>

            <div className="w-full flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Path / URL Foto Mempelai Pria"
                {...register("groomPhotoUrl")}
                className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-border/60 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#C8A96A]"
              />
              {groomPhotoUrl && (
                <button
                  type="button"
                  onClick={() => setValue("groomPhotoUrl", "")}
                  className="p-1.5 rounded-xl bg-rose-50 text-rose-500 hover:text-rose-700 text-xs shrink-0"
                  title="Hapus foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground">
              Nama Panggilan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Asep"
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
              placeholder="Contoh: Asep Sutrisna Suhada Putra"
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
              placeholder="Contoh: Bapak Sutrisna"
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
              placeholder="Contoh: Ibu Suhada"
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
          <div className="flex flex-col items-center justify-center space-y-2 py-2">
            <input
              type="file"
              ref={brideFileRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, "bridePhotoUrl")}
            />

            <div
              onClick={() => brideFileRef.current?.click()}
              className="w-24 h-24 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex flex-col items-center justify-center text-muted-foreground overflow-hidden relative group cursor-pointer hover:border-[#C8A96A] transition-all shadow-sm"
            >
              {uploadingField === "bridePhotoUrl" ? (
                <div className="flex flex-col items-center justify-center space-y-1 text-[#C8A96A]">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-[9px] font-semibold">Mengunggah...</span>
                </div>
              ) : bridePhotoUrl ? (
                <>
                  <img src={bridePhotoUrl} alt="Foto Mempelai Wanita" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                    Ganti Foto
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-1">
                  <User className="w-6 h-6 stroke-[1.5]" />
                  <span className="text-[10px] font-semibold text-[#C8A96A]">Upload Foto</span>
                </div>
              )}
            </div>

            <div className="w-full flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Path / URL Foto Mempelai Wanita"
                {...register("bridePhotoUrl")}
                className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-border/60 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#C8A96A]"
              />
              {bridePhotoUrl && (
                <button
                  type="button"
                  onClick={() => setValue("bridePhotoUrl", "")}
                  className="p-1.5 rounded-xl bg-rose-50 text-rose-500 hover:text-rose-700 text-xs shrink-0"
                  title="Hapus foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground">
              Nama Panggilan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Salsa"
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
              placeholder="Contoh: Salsa Camelia Azzahra"
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
              placeholder="Contoh: Bapak Camelia"
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
              placeholder="Contoh: Ibu Azzahra"
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

        <input
          type="file"
          ref={coverFileRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, "coverUrl")}
        />

        <div
          onClick={() => coverFileRef.current?.click()}
          className="p-6 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-center space-y-3 cursor-pointer hover:border-[#C8A96A] transition-all group shadow-sm"
        >
          {uploadingField === "coverUrl" ? (
            <div className="flex flex-col items-center justify-center space-y-2 py-8 text-[#C8A96A]">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs font-semibold">Mengunggah Foto Sampul...</span>
            </div>
          ) : coverUrl ? (
            <div className="w-full h-48 rounded-xl overflow-hidden relative">
              <img src={coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                Klik untuk Ganti Foto Sampul
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 py-3">
              <Upload className="w-8 h-8 text-[#C8A96A] stroke-[1.5] group-hover:scale-110 transition-transform" />
              <p className="text-xs font-semibold text-foreground">
                Klik atau drag foto ke sini
              </p>
              <span className="text-[10px] text-muted-foreground">
                JPG, PNG, WebP • Max 20MB
              </span>
            </div>
          )}

          <div className="w-full flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              placeholder="Atau tempel URL Foto Sampul Prewedding"
              {...register("coverUrl")}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50"
            />
            {coverUrl && (
              <button
                type="button"
                onClick={() => setValue("coverUrl", "")}
                className="p-2 rounded-xl bg-rose-50 text-rose-500 hover:text-rose-700 text-xs shrink-0"
                title="Hapus foto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
