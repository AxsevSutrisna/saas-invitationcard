"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sliders, Smartphone, Layout } from "lucide-react";

/**
 * RealtimeEditorSection Component
 * Menampilkan simulasi editor dashboard dan live preview di layar HP.
 */
export function RealtimeEditorSection() {
  return (
    <section className="py-20 md:py-28 bg-white/60 dark:bg-[#1F1F1F]/60 backdrop-blur-md border-y border-border/40 relative">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        {/* Header Teks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A96A]">
            Bebas Revisi Sepuasnya
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1F1F1F] dark:text-zinc-50">
            Lihat Perubahan Real-time. Tanpa Butuh Desainer.
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Ganti font, sesuaikan warna, atau ubah lokasi acara dan lihat hasilnya detik itu juga dari layar HP atau laptop Anda.
          </p>
        </motion.div>

        {/* Side-by-Side Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          {/* Dashboard Form Mockup (Left) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-border shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3 border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-muted-foreground ml-2">
                  Form Pengisian Detail Acara
                </span>
              </div>
              <Sliders className="w-4 h-4 text-[#C8A96A]" />
            </div>

            {/* Dummy Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-medium text-foreground">Nama Mempelai Pria</label>
                <input
                  type="text"
                  readOnly
                  value="Budi Pratama, S.Kom"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-foreground">Nama Mempelai Wanita</label>
                <input
                  type="text"
                  readOnly
                  value="Rani Wijaya, S.E"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-foreground"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-medium text-foreground">Lokasi Resepsi</label>
                <input
                  type="text"
                  readOnly
                  value="Hotel Grand Ballroom, Lt. 3, Jakarta Selatan"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-foreground"
                />
              </div>
            </div>

            {/* Checkpoints */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Tanpa biaya revisi
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Bebas salah ketik
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Mudah & praktis
              </span>
            </div>
          </motion.div>

          {/* Live Mobile Screen Preview (Right) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="w-[260px] h-[380px] bg-gradient-to-b from-[#f7f3e8] to-[#eee4ce] dark:from-zinc-900 dark:to-zinc-950 rounded-2xl p-4 border-2 border-[#C8A96A]/40 shadow-2xl relative flex flex-col justify-between text-center">
              <div className="space-y-2 pt-4">
                <span className="text-[9px] uppercase tracking-widest text-[#C8A96A] font-bold">
                  ● Live Preview Instant
                </span>
                <h4 className="font-heading text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Budi & Rani
                </h4>
                <p className="text-[10px] text-zinc-600 dark:text-zinc-400">
                  Hotel Grand Ballroom, Lt. 3
                </p>
              </div>

              <div className="p-3 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-white/60 text-[10px] text-zinc-700 dark:text-zinc-300">
                ✨ Update langsung terlihat oleh tamu detik ini juga
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
