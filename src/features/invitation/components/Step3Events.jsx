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
    <div className="animate-in fade-in space-y-6 duration-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-heading text-xl font-bold text-foreground">
            Step 3: Jadwal & Lokasi Acara
          </h3>
          <p className="text-xs font-light text-muted-foreground">
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
        >
          <Plus aria-hidden="true" />
          <span>Tambah Acara</span>
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="group relative space-y-4 rounded-2xl border border-border/60 bg-zinc-50 p-5 dark:bg-zinc-900/60"
          >
            {fields.length > 1 && (
              <Button
                type="button"
                onClick={() => remove(index)}
                variant="ghost"
                size="icon-sm"
                aria-label={`Hapus acara ${index + 1}`}
                className="absolute right-3 top-3 text-destructive hover:text-destructive/80"
              >
                <Trash2 aria-hidden="true" />
              </Button>
            )}

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gold-500" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Acara #{index + 1}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Nama Acara */}
              <div className="space-y-1">
                <label htmlFor={`events-${index}-name`} className="text-[11px] font-semibold text-muted-foreground">
                  Nama Acara <span className="text-destructive">*</span>
                </label>
                <input
                  id={`events-${index}-name`}
                  type="text"
                  placeholder="misal: Akad Nikah"
                  {...register(`events.${index}.name`)}
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-800"
                />
              </div>

              {/* Tanggal */}
              <div className="space-y-1">
                <label htmlFor={`events-${index}-date`} className="text-[11px] font-semibold text-muted-foreground">
                  Tanggal <span className="text-destructive">*</span>
                </label>
                <input
                  id={`events-${index}-date`}
                  type="date"
                  {...register(`events.${index}.date`)}
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-800"
                />
              </div>

              {/* Jam Mulai */}
              <div className="space-y-1">
                <label htmlFor={`events-${index}-startTime`} className="text-[11px] font-semibold text-muted-foreground">
                  Jam Mulai <span className="text-destructive">*</span>
                </label>
                <input
                  id={`events-${index}-startTime`}
                  type="time"
                  {...register(`events.${index}.startTime`)}
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Nama Tempat */}
              <div className="space-y-1">
                <label htmlFor={`events-${index}-locationName`} className="text-[11px] font-semibold text-muted-foreground">
                  Nama Tempat / Gedung <span className="text-destructive">*</span>
                </label>
                <input
                  id={`events-${index}-locationName`}
                  type="text"
                  placeholder="misal: Hotel Indonesia Kempinski"
                  {...register(`events.${index}.locationName`)}
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-800"
                />
              </div>

              {/* Link Google Maps */}
              <div className="space-y-1">
                <label htmlFor={`events-${index}-mapUrl`} className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                  <MapPin className="h-3 w-3 text-gold-500" aria-hidden="true" />
                  <span>Link Google Maps</span>
                </label>
                <input
                  id={`events-${index}-mapUrl`}
                  type="url"
                  placeholder="https://maps.google.com/..."
                  {...register(`events.${index}.mapUrl`)}
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-800"
                />
              </div>
            </div>

            {/* Alamat Lengkap */}
            <div className="space-y-1">
              <label htmlFor={`events-${index}-address`} className="text-[11px] font-semibold text-muted-foreground">
                Alamat Lengkap <span className="text-destructive">*</span>
              </label>
              <textarea
                id={`events-${index}-address`}
                rows={2}
                placeholder="Jl. M.H. Thamrin No.1, Menteng, Jakarta Pusat"
                {...register(`events.${index}.address`)}
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-800"
              />
            </div>
          </div>
        ))}
      </div>
      {errors.events && (
        <p className="text-xs text-destructive">{errors.events.message}</p>
      )}
    </div>
  );
}
