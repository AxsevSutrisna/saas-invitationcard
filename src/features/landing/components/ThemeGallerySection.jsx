"use client";

import { motion } from "framer-motion";
import { Sparkles, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";

import Link from "next/link";
import Image from "next/image";

export function ThemeGallerySection({ initialThemes = [] }) {
  // Gunakan data tema dari database jika ada, jika tidak (misal database kosong saat testing), gunakan dummy
  const displayThemes = initialThemes.length > 0 ? initialThemes.map((t, idx) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    desc: t.description || "Desain eksklusif untuk pernikahan Anda.",
    badge: t.isPremium ? "Premium" : "Populer",
    isPremium: t.isPremium,
    thumbnailUrl: t.thumbnailUrl,
    accent: idx % 2 === 0 ? "text-[#C8A96A]" : "text-zinc-500", // variasi warna
  })) : [
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

        {/* Themes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayThemes.map((theme, index) => (
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
                className="p-6 flex flex-col justify-between group hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Phone Mockup Frame (Taller Android Style) */}
                <div className="flex justify-center relative mb-4">
                  <div className="relative w-[240px] sm:w-[260px] h-[500px] bg-[#1C1C1E] dark:bg-[#1C1C1E] rounded-[40px] border-[10px] border-[#1C1C1E] shadow-2xl flex flex-col items-center justify-center text-center overflow-hidden">
                    {theme.thumbnailUrl ? (
                      <Image
                        src={theme.thumbnailUrl}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover"
                        alt={`Preview tema ${theme.name}`}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 space-y-4">
                        <div className={`w-14 h-14 rounded-full bg-white/10 shadow-md flex items-center justify-center`}>
                          <Sparkles className="w-6 h-6 text-[#C8A96A]" />
                        </div>
                        <h3 className="font-heading text-xl font-bold text-white">
                          {theme.name}
                        </h3>
                        <span className="text-[10px] text-white/70 font-light uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full">
                          {theme.badge}
                        </span>
                      </div>
                    )}
                  </div>
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
                    className="w-full h-10 rounded-xl border border-[#C8A96A]/50 bg-black/40 backdrop-blur-md hover:bg-[#C8A96A]/20 hover:border-[#C8A96A] text-white hover:text-[#F6E5B3] font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer transition-all active:scale-95"
                    aria-label={`Lihat demo tema ${theme.name}`}
                  >
                    <Eye className="w-4 h-4" aria-hidden="true" /> Lihat Demo Tema
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* View All Themes CTA */}
        <div className="flex justify-center pt-8">
          <Link href="/themes">
            <Button
              className="h-12 px-8 rounded-full bg-[#C8A96A] hover:bg-[#b39150] text-white font-semibold text-base flex items-center justify-center gap-2 group shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer border-none"
            >
              Lihat Semua Koleksi Tema
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
