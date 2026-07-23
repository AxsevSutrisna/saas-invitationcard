"use client";

import { useFieldArray } from "react-hook-form";
import { Calendar, Plus, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Step3Events({ register, errors, control }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "events",
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-heading text-xl font-bold text-foreground">
            Step 3: Jadwal & Lokasi Acara
          </h3>
          <p className="text-xs text-muted-foreground font-light">
            Tambahkan detail rincian acara pernikahan Anda (Akad Nikah, Resepsi, dll).
          </p>
        </div>

        <Button
          type="button"
          onClick={() =>
            append({
              name: "Resepsi Pernikahan",
              date: new Date().toISOString().split("T")[0],
              startTime: "11:00",
              locationName: "Grand Ballroom",
              address: "Jl. Jend. Sudirman No. 1, Jakarta",
              mapUrl: "",
            })
          }
          variant="outline"
          size="sm"
          className="rounded-xl text-xs flex items-center gap-1.5 border-[#C8A96A]/40 text-[#C8A96A] hover:bg-[#C8A96A]/10"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Acara</span>
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/60 space-y-4 relative group"
          >
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C8A96A]" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Acara #{index + 1}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Nama Acara */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Nama Acara <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="misal: Akad Nikah"
                  {...register(`events.${index}.name`)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50 transition-all"
                />
              </div>

              {/* Tanggal */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Tanggal <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  {...register(`events.${index}.date`)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50 transition-all"
                />
              </div>

              {/* Jam Mulai */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Jam Mulai <span className="text-rose-500">*</span>
                </label>
                <input
                  type="time"
                  {...register(`events.${index}.startTime`)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Nama Tempat */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Nama Tempat / Gedung <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="misal: Hotel Indonesia Kempinski"
                  {...register(`events.${index}.locationName`)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50 transition-all"
                />
              </div>

              {/* Link Google Maps */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#C8A96A]" />
                  <span>Link Google Maps</span>
                </label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/..."
                  {...register(`events.${index}.mapUrl`)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50 transition-all"
                />
              </div>
            </div>

            {/* Alamat Lengkap */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">
                Alamat Lengkap <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="Jl. M.H. Thamrin No.1, Menteng, Jakarta Pusat"
                {...register(`events.${index}.address`)}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/50 transition-all"
              />
            </div>
          </div>
        ))}
      </div>
      {errors.events && (
        <p className="text-xs text-rose-500">{errors.events.message}</p>
      )}
    </div>
  );
}
