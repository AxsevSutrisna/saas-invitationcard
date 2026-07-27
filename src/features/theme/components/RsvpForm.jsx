"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitRsvpAction } from "@/server/actions/rsvp.actions";
import { Check, Send, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const clientRsvpSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(50, "Nama maksimal 50 karakter"),
  attendance: z.enum(["YES", "NO", "MAYBE"], {
    errorMap: () => ({ message: "Silakan pilih salah satu konfirmasi kehadiran" }),
  }),
  pax: z.preprocess(
    (val) => parseInt(val, 10),
    z.number().min(1, "Jumlah tamu minimal 1").max(10, "Jumlah tamu maksimal 10")
  ).default(1),
  message: z.string().max(500, "Ucapan maksimal 500 karakter").optional(),
});

export function RsvpForm({ invitationId, defaultGuestName, onRsvpSuccess }) {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(clientRsvpSchema),
    defaultValues: {
      name: defaultGuestName || "",
      attendance: "YES",
      pax: 1,
      message: "",
    },
  });

  const selectedAttendance = watch("attendance");

  const onSubmit = async (data) => {
    setServerError("");
    const res = await submitRsvpAction({
      invitationId,
      ...data,
    });

    if (res.success) {
      setSuccess(true);
      if (onRsvpSuccess) {
        onRsvpSuccess(res.data);
      }
    } else {
      setServerError(res.error || "Gagal mengirim RSVP.");
    }
  };

  if (success) {
    return (
      <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3 animate-in fade-in duration-300">
        <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
          <Check className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-heading text-lg font-bold text-foreground">Konfirmasi Terkirim</h4>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Terima kasih atas konfirmasi kehadiran dan doa restu yang Anda berikan untuk kebahagiaan kami.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      {serverError && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Input Nama Tamu */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Nama Tamu / Pengirim <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Tuliskan nama Anda..."
          {...register("name")}
          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-[#C8A96A]/20 focus:border-[#C8A96A] text-xs focus:outline-none focus:ring-1 focus:ring-[#C8A96A]"
        />
        {errors.name && (
          <p className="text-[10px] text-rose-500 font-medium">{errors.name.message}</p>
        )}
      </div>

      {/* Input Kehadiran */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Konfirmasi Kehadiran <span className="text-rose-500">*</span>
        </label>
        <select
          {...register("attendance")}
          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-[#C8A96A]/20 focus:border-[#C8A96A] text-xs focus:outline-none focus:ring-1 focus:ring-[#C8A96A]"
        >
          <option value="YES">🟢 Insya Allah Hadir</option>
          <option value="MAYBE">🟡 Ragu-Ragu / Mungkin Hadir</option>
          <option value="NO">🔴 Maaf, Berhalangan Hadir</option>
        </select>
        {errors.attendance && (
          <p className="text-[10px] text-rose-500 font-medium">{errors.attendance.message}</p>
        )}
      </div>

      {/* Input Pax (Jumlah Tamu) - Hanya muncul jika konfirmasi Hadir/Mungkin */}
      {(selectedAttendance === "YES" || selectedAttendance === "MAYBE") && (
        <div className="space-y-1 animate-in slide-in-from-top duration-200">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Jumlah Tamu (Pax) <span className="text-rose-500">*</span>
          </label>
          <select
            {...register("pax")}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-[#C8A96A]/20 focus:border-[#C8A96A] text-xs focus:outline-none focus:ring-1 focus:ring-[#C8A96A]"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num} Orang</option>
            ))}
          </select>
          {errors.pax && (
            <p className="text-[10px] text-rose-500 font-medium">{errors.pax.message}</p>
          )}
        </div>
      )}

      {/* Input Ucapan / Pesan */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Ucapan Selamat &amp; Doa Restu
        </label>
        <textarea
          rows={3}
          placeholder="Tuliskan ucapan selamat dan doa terbaik untuk kedua mempelai di sini..."
          {...register("message")}
          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-[#C8A96A]/20 focus:border-[#C8A96A] text-xs focus:outline-none focus:ring-1 focus:ring-[#C8A96A] leading-relaxed"
        />
        {errors.message && (
          <p className="text-[10px] text-rose-500 font-medium">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 rounded-xl bg-gradient-to-r from-[#C8A96A] to-[#b39150] hover:from-[#b39150] hover:to-[#9e7e40] text-white font-semibold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300"
      >
        <Send className="w-3.5 h-3.5" />
        <span>{isSubmitting ? "Mengirim..." : "Kirim Konfirmasi"}</span>
      </Button>
    </form>
  );
}
