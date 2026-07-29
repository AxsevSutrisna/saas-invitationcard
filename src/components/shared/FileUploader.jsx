"use client";

import { useState, useRef } from "react";
import { UploadCloud, File, Trash2, Music, Check, X, AlertCircle } from "lucide-react";

export function FileUploader({
  value,
  onChange,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // Default 5MB
  label,
  helperText,
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const isAudioType = accept.includes("audio");

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const validateAndUploadFile = async (file) => {
    setError("");

    if (!file) return;

    // 1. Validasi Ukuran File
    if (file.size > maxSize) {
      const sizeInMB = (maxSize / (1024 * 1024)).toFixed(0);
      setError(`Ukuran file melebihi batas. Maksimal ${sizeInMB}MB.`);
      return;
    }

    // 2. Validasi Tipe File (Secara Sederhana)
    const matchesAccept = isAudioType 
      ? file.type.startsWith("audio/") || file.name.endsWith(".m4a") || file.name.endsWith(".mp3")
      : file.type.startsWith("image/");

    if (!matchesAccept) {
      setError(isAudioType ? "Format file harus berupa audio (MP3, WAV, M4A)." : "Format file harus berupa gambar.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 3. Request Presigned URL
      const response = await fetch("/api/v1/upload/presigned-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          fileType: file.type || (isAudioType ? "audio/mpeg" : "image/jpeg"),
          fileSize: file.size,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mendapatkan izin unggah berkas.");
      }

      const { presignedUrl, publicUrl } = result.data;

      // 4. Upload Direct to Cloudflare R2 via XMLHttpRequest (untuk tracking progress)
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", presignedUrl, true);
      xhr.setRequestHeader("Content-Type", file.type || (isAudioType ? "audio/mpeg" : "image/jpeg"));

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          onChange(publicUrl);
          setIsUploading(false);
          setUploadProgress(0);
        } else {
          setError("Gagal mengunggah berkas ke server penyimpanan R2.");
          setIsUploading(false);
        }
      };

      xhr.onerror = () => {
        setError("Koneksi bermasalah saat mengunggah berkas.");
        setIsUploading(false);
      };

      xhr.send(file);
    } catch (err) {
      console.error("[UPLOAD_ERROR]", err);
      setError(err.message || "Terjadi kesalahan saat mengunggah berkas.");
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndUploadFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
      )}

      {/* Main Drag-and-Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={!isUploading && !value ? handleButtonClick : undefined}
        className={`relative min-h-[140px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all duration-300 ${
          isDragActive
            ? "border-[#C8A96A] bg-[#C8A96A]/5"
            : value
            ? "border-emerald-500/20 bg-emerald-50/5 dark:bg-emerald-950/5"
            : "border-border/60 hover:border-zinc-400 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30"
        } ${!isUploading && !value ? "cursor-pointer" : ""}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
          disabled={isUploading}
        />

        {/* 1. STATE: Sedang Upload (Progress Loader) */}
        {isUploading && (
          <div className="w-full max-w-[200px] flex flex-col items-center space-y-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  fill="transparent"
                  className="text-zinc-200 dark:text-zinc-800"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 * (1 - uploadProgress / 100)}
                  className="text-[#C8A96A] transition-all duration-150"
                />
              </svg>
              <span className="text-[10px] font-bold text-foreground">{uploadProgress}%</span>
            </div>
            <span className="text-[10px] font-medium text-muted-foreground animate-pulse">
              Mengunggah berkas...
            </span>
          </div>
        )}

        {/* 2. STATE: Sudah Terunggah */}
        {!isUploading && value && (
          <div className="w-full flex flex-col items-center space-y-3">
            {isAudioType ? (
              // Tampilan Berhasil Unggah Audio
              <div className="flex items-center gap-3 w-full bg-white dark:bg-zinc-950 border border-emerald-500/10 p-3 rounded-xl shadow-inner max-w-sm">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Music className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <span>Musik Latar Aktif</span>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <audio src={value} controls className="w-full h-6 mt-1 text-[10px] focus:outline-none" />
                </div>
              </div>
            ) : (
              // Tampilan Berhasil Unggah Gambar
              <div className="relative w-36 h-36 rounded-xl overflow-hidden border border-border/80 shadow-md group">
                <img
                  src={value}
                  alt="Upload Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <button
                    onClick={handleRemove}
                    type="button"
                    className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg cursor-pointer"
                    title="Hapus Gambar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Tombol Hapus untuk audio */}
            {isAudioType && (
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-600 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Berkas</span>
              </button>
            )}
          </div>
        )}

        {/* 3. STATE: Siap Upload (Kosong) */}
        {!isUploading && !value && (
          <div className="flex flex-col items-center text-center space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-border/50 flex items-center justify-center text-zinc-500">
              {isAudioType ? <Music className="w-5 h-5" /> : <UploadCloud className="w-5 h-5" />}
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold text-foreground">
                Tarik & Lepas berkas di sini
              </p>
              <p className="text-[9px] text-muted-foreground">
                atau <span className="text-[#C8A96A] hover:underline font-semibold">pilih dari perangkat</span>
              </p>
            </div>
            {helperText && (
              <p className="text-[9px] text-zinc-400 font-light italic">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-1.5 text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-950/40 p-2.5 rounded-xl text-[10px] font-medium leading-relaxed">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
