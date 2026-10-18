"use client";

import { useFieldArray } from "react-hook-form";
import { Calendar, Plus, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextField, TextAreaField } from "@/components/ui/Field";

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
              name: "",
              date: "",
              startTime: "",
              endTime: "",
              locationName: "",
              address: "",
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TextField
                label="Nama Acara"
                htmlFor={`events-${index}-name`}
                required
                className="space-y-1"
                type="text"
                placeholder="misal: Akad Nikah"
                {...register(`events.${index}.name`)}
              />
              <TextField
                label="Tanggal"
                htmlFor={`events-${index}-date`}
                required
                className="space-y-1"
                type="date"
                {...register(`events.${index}.date`)}
              />
              <TextField
                label="Jam Mulai"
                htmlFor={`events-${index}-startTime`}
                required
                className="space-y-1"
                type="time"
                {...register(`events.${index}.startTime`)}
              />
              <TextField
                label="Jam Selesai (opsional)"
                htmlFor={`events-${index}-endTime`}
                className="space-y-1"
                type="time"
                {...register(`events.${index}.endTime`)}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TextField
                label="Nama Tempat / Gedung"
                htmlFor={`events-${index}-locationName`}
                required
                className="space-y-1"
                type="text"
                placeholder="misal: Hotel Indonesia Kempinski"
                {...register(`events.${index}.locationName`)}
              />
              <TextField
                htmlFor={`events-${index}-mapUrl`}
                className="space-y-1"
                labelClassName="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground"
                label={
                  <>
                    <MapPin className="h-3 w-3 text-gold-500" aria-hidden="true" />
                    <span>Link Google Maps</span>
                  </>
                }
                type="url"
                placeholder="https://maps.google.com/..."
                {...register(`events.${index}.mapUrl`)}
              />
            </div>

            <TextAreaField
              label="Alamat Lengkap"
              htmlFor={`events-${index}-address`}
              required
              className="space-y-1"
              rows={2}
              placeholder="Jl. M.H. Thamrin No.1, Menteng, Jakarta Pusat"
              {...register(`events.${index}.address`)}
            />
          </div>
        ))}
      </div>
      {errors.events && (
        <p className="text-xs text-destructive">{errors.events.message}</p>
      )}
    </div>
  );
}
