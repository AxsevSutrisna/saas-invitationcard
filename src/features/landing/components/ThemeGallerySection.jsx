"use client";

import { motion } from "framer-motion";
import { Sparkles, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";

export function ThemeGallerySection() {
  const dummyThemes = [
    {
      id: "1",
      name: "Classic Elegance",
      slug: "classic-elegance",
      desc: "Desain undangan klasik dengan nuansa warna emas dan putih gading, sangat mewah.",
      badge: "Populer",
      isPremium: false,
      accent: "text-[#C8A96A]",
    },
    {
      id: "2",
      name: "Floral Blossom",
      slug: "floral-blossom",
      desc: "Tema bunga-bunga romantis dengan animasi kelopak berguguran yang memikat.",
      badge: "Premium",
      isPremium: true,
      accent: "text-[#B76E79]",
    },
    {
      id: "3",
      name: "Modern Minimalist",
      slug: "modern-minimalist",
      desc: "Tampilan bersih, santai, dan kontemporer untuk pasangan modern.",
      badge: "Baru",
      isPremium: true,
      accent: "text-zinc-500",
    },
  ];

  return (
    <section
      id="tema"
      aria-label="Galeri Tema Undangan"
      className="py-20 md:py-28 relative overflow-hidden bg-[#2C2723] border-y border-[#C8A96A]/20"
    >
      <div className="max-w-6xl mx-auto px-6 space-y-14 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A96A]">
            Modern Editorial Romance
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
            Find the look that feels like you.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed">
            Pilih estetika visual yang paling mencerminkan karakter, kehangatan,
            dan keunikan perjalanan kisah cinta Anda.
          </p>
        </motion.div>

        {/*
          Theme Cards Grid.
          - Mobile (< md): 1 kolom, kartu dikentengahkan, lebar auto mengikuti layar
          - Tablet (md+):  3 kolom, setiap kartu dikentengahkan dalam kolomnya
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {dummyThemes.map((theme, index) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full flex flex-col"
            >
              {/* 
                Komponen Kartu 
              */}
              <GlassCard
                variant="full"
                className="p-6 flex flex-col justify-between h-[420px] group hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Mini Invitation Preview Area */}
                <div
                  aria-hidden="true"
                  className="w-full h-[180px] rounded-2xl bg-white/25 border border-white/35 flex flex-col items-center justify-center text-center relative overflow-hidden"
                >
                  <div className="absolute inset-2 rounded-t-full border border-dashed border-white/25 pointer-events-none" />

                  <span className="absolute top-2 right-2 text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-white/60 text-zinc-800 border border-white/70">
                    {theme.badge}
                  </span>

                  <div
                    className={`w-9 h-9 rounded-full bg-white/50 border border-white/60 flex items-center justify-center ${theme.accent} mb-2`}
                  >
                    <Sparkles className="w-4 h-4 fill-current" aria-hidden="true" />
                  </div>

                  <p className="text-[12px] uppercase tracking-[0.2em] text-white font-extrabold">
                    The Wedding of
                  </p>
                  <h3 className="font-heading text-[20px] font-bold text-white font-cormorant tracking-wide mt-0.5">
                    James & Syifa
                  </h3>
                  <p className="text-[12px] text-zinc-300 mt-0.5 font-bold">
                    Sample Wedding Card
                  </p>
                </div>

                {/* Theme Metadata */}
                <div className="mt-3.5 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-[16px] text-white font-poppins leading-tight">
                      {theme.name}
                    </h4>
                    {theme.isPremium && (
                      <span className="flex items-center gap-0.5 text-[12px] font-bold text-[#9e7e40] shrink-0">
                        <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" />{" "}
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-zinc-300 leading-relaxed font-semibold">
                    {theme.desc}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-xl border-2 border-[#C8A96A]/40 bg-[#C8A96A]/10 hover:bg-[#C8A96A] text-white font-bold hover:text-white text-[12px] h-9 flex items-center justify-center gap-1.5 transition-all cursor-pointer duration-300"
                    aria-label={`Lihat demo tema ${theme.name}`}
                  >
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" /> Lihat Demo Tema
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
