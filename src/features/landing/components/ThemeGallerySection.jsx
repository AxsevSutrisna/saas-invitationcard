"use client";

import { motion } from "framer-motion";
import { Sparkles, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * ThemeGallerySection Component
 * Galeri pilihan desain tema undangan digital (menggunakan data dummy sesuai seed database).
 */
export function ThemeGallerySection() {
  const dummyThemes = [
    {
      id: "1",
      name: "Classic Elegance",
      slug: "classic-elegance",
      desc: "Desain undangan klasik dengan nuansa warna emas dan putih gading, sangat mewah.",
      badge: "Populer",
      isPremium: false,
      bgColor: "from-amber-100 to-amber-50 dark:from-zinc-800 dark:to-zinc-900 border-[#C8A96A]/40",
      accent: "text-[#C8A96A]",
    },
    {
      id: "2",
      name: "Floral Blossom",
      slug: "floral-blossom",
      desc: "Tema bunga-bunga romantis dengan animasi kelopak berguguran yang memikat.",
      badge: "Premium",
      isPremium: true,
      bgColor: "from-rose-100 to-rose-50 dark:from-zinc-800 dark:to-zinc-900 border-[#B76E79]/40",
      accent: "text-[#B76E79]",
    },
    {
      id: "3",
      name: "Modern Minimalist",
      slug: "modern-minimalist",
      desc: "Tampilan bersih, santai, dan kontemporer untuk pasangan pasangan modern.",
      badge: "Baru",
      isPremium: true,
      bgColor: "from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 border-zinc-300 dark:border-zinc-700",
      accent: "text-zinc-700 dark:text-zinc-300",
    },
  ];

  return (
    <section id="tema" className="py-20 md:py-28 relative">
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
            Modern Editorial Romance
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1F1F1F] dark:text-zinc-50">
            Find the look that feels like you.
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed">
            Pilih estetika visual yang paling mencerminkan karakter, kehangatan, dan keunikan perjalanan kisah cinta Anda.
          </p>
        </motion.div>

        {/* Theme Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dummyThemes.map((theme, index) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-3xl bg-gradient-to-b ${theme.bgColor} border p-6 flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1`}
            >
              <div className="space-y-4">
                {/* Theme Card Mockup Area */}
                <div className="w-full aspect-[4/5] rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-white/60 p-4 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#C8A96A]/20 text-[#9e7e40] border border-[#C8A96A]/30">
                    {theme.badge}
                  </span>
                  
                  <div className={`w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center ${theme.accent} mb-3 shadow-inner`}>
                    <Sparkles className="w-7 h-7 fill-current" />
                  </div>
                  
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                    Preview Tema
                  </p>
                  <h3 className="font-heading text-2xl font-bold text-foreground">
                    James & Syifa
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sample Wedding Card
                  </p>
                </div>

                {/* Theme Meta */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-lg text-foreground">
                      {theme.name}
                    </h4>
                    {theme.isPremium && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#C8A96A]">
                        <Star className="w-3.5 h-3.5 fill-current" /> Premium
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {theme.desc}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-[#C8A96A]/40 hover:bg-[#C8A96A] hover:text-white font-medium text-xs h-10 flex items-center justify-center gap-2 transition-all"
                >
                  <Eye className="w-4 h-4" /> Lihat Demo Tema
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
