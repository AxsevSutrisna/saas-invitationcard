"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sliders, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export function RealtimeEditorSection() {
  return (
    <section className="py-20 md:py-28 bg-[#F8F6F2] relative">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Visual Mockups (Form & Phone overlapping) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-6 relative mt-12 lg:mt-0 mb-12 lg:mb-0 flex justify-center lg:justify-start"
        >
          <div className="relative w-full max-w-[450px]">
            {/* Dashboard Form Mockup (Background) */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-border shadow-lg space-y-4 w-full md:w-[90%] md:mr-auto">
              <div className="flex items-center justify-between border-b pb-3 border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-muted-foreground ml-2">
                    Editor Acara
                  </span>
                </div>
                <Sliders className="w-4 h-4 text-[#C8A96A]" />
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">Nama Mempelai Pria</label>
                  <input
                    type="text"
                    readOnly
                    value="William"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">Nama Mempelai Wanita</label>
                  <input
                    type="text"
                    readOnly
                    value="Elleanor"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-medium text-foreground">Lokasi Acara</label>
                  <input
                    type="text"
                    readOnly
                    value="The Ritz-Carlton, Jakarta"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[#C8A96A] font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Live Mobile Screen Preview (Foreground Overlapping) */}
            <div className="absolute -bottom-10 -right-4 md:-right-10 w-[200px] sm:w-[220px] h-[320px] bg-gradient-to-b from-[#2C2723] to-[#1a1613] rounded-2xl p-4 border-4 border-[#C8A96A] shadow-2xl flex flex-col justify-between text-center transform hover:-translate-y-2 transition-transform duration-500">
              <div className="space-y-2 pt-4 relative z-10">
                <span className="text-[8px] uppercase tracking-widest text-[#E2C785] font-bold bg-[#C8A96A]/20 px-2 py-1 rounded-full">
                  ● Live Preview
                </span>
                <h4 className="font-heading text-2xl font-bold text-white mt-4 font-cormorant">
                  William & Elleanor
                </h4>
                <p className="text-[9px] text-zinc-300">
                  The Ritz-Carlton, Jakarta
                </p>
              </div>
              
              <div className="absolute inset-0 bg-[url('/ikara-hero-section-potrait.png')] bg-cover bg-center opacity-30 rounded-xl z-0"></div>

              <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-[9px] text-white relative z-10 font-medium">
                Tersimpan otomatis
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-6 space-y-6"
        >
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A96A]">
              Bebas Revisi Kapan Saja
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1F1F1F] dark:text-zinc-50 leading-tight">
              Edit Sendiri, Langsung <span className="italic font-serif font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#C8A96A] to-[#b39150]">Jadi.</span>
            </h2>
          </div>

          <p className="text-zinc-600 dark:text-zinc-300 text-base md:text-lg leading-relaxed">
            Salah ketik nama tamu atau jadwal acara tiba-tiba berubah? Tidak perlu panik. Anda bisa menggantinya sendiri dengan mudah, dan undangan akan langsung berubah detik itu juga.
          </p>

          <ul className="space-y-3 pt-2">
            {[
              "Bebas ganti tulisan berkali-kali tanpa ada biaya tambahan.",
              "Begitu Anda simpan, tamu akan langsung melihat undangan versi terbaru.",
              "Cara pakainya semudah membalas pesan, siapa pun pasti bisa menggunakannya.",
            ].map((text, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-zinc-700 dark:text-zinc-200 font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#C8A96A] shrink-0 mt-0.5" />
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4">
            <Link href={ROUTES.LOGIN}>
              <Button
                className="h-13 px-7 rounded-2xl bg-[#C8A96A] hover:bg-[#b39150] text-white font-medium text-base flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <Edit3 className="w-4 h-4" />
                Coba Dashboard Editor
              </Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
