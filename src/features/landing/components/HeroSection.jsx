"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { motion } from "framer-motion";
import { Plus, Play, Sparkles, Heart } from "lucide-react";

/**
 * HeroSection Component
 * Visual headline utama dengan gaya Cormorant Garamond, dual CTA, dan ilustrasi 3D dummy.
 */
export function HeroSection() {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-[#F8F6F2]">

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Text & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 space-y-6 text-center lg:text-left"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8A96A]/15 border border-[#C8A96A]/30 text-[#9e7e40] dark:text-[#E2C785] text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            Every Promise Has a Story
          </div>

          {/* Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1F1F1F] dark:text-zinc-50 leading-[1.15]">
            Your Story Deserves a{" "}
            <span className="italic font-serif font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#C8A96A] via-[#b39150] to-[#B98F8F]">
              Beautiful Beginning
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-zinc-800 dark:text-zinc-200 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
            IKARA adalah ruang ketika cinta menjadi janji, dan setiap janji menjadi kisah terpenting yang diabadikan secara elegan.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link href={ROUTES.LOGIN} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-13 px-7 rounded-2xl liquid-gold-button text-white font-medium text-base flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Begin Your Story
              </Button>
            </Link>

            <Link href="#tema" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-13 px-7 rounded-2xl border-[#C8A96A]/30 bg-white/10 dark:bg-zinc-950/10 backdrop-blur-[6px] hover:bg-white/25 hover:border-[#C8A96A]/60 dark:hover:bg-zinc-850/25 text-foreground font-medium text-base flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all duration-300"
              >
                <Play className="w-4 h-4 fill-current text-[#C8A96A]" />
                Lihat Demo Tema
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Dummy 3D Arch Visual Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="lg:col-span-5 flex justify-center z-10 relative"
        >


          {/* Glass Card Wrapper with Border and Hover Shine */}
          <div className="relative w-full max-w-md aspect-[4/5] rounded-[32px] bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-white/20 dark:border-white/5 shadow-2xl flex flex-col items-center justify-center p-6 text-center group transition-all duration-500 hover:-translate-y-1">
            
            {/* Arch Decoration Background */}
            <div className="absolute inset-4 rounded-t-full border border-dashed border-[#C8A96A]/25 pointer-events-none" />

            {/* Dummy Arch Graphic Content */}
            <div className="relative z-10 space-y-5 p-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#C8A96A]/10 border border-[#C8A96A]/35 flex items-center justify-center text-[#C8A96A] shadow-inner group-hover:scale-110 transition-transform duration-500">
                <Heart className="w-8 h-8 fill-current" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] tracking-[0.3em] font-bold text-[#9e7e40] dark:text-[#E2C785] uppercase">
                  The Wedding of
                </p>
                <h3 className="font-heading text-4xl font-bold text-[#1F1F1F] dark:text-zinc-50 font-cormorant tracking-wide script-glow">
                  Rani & Budi
                </h3>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">Sabtu, 24 Oktober 2026</p>
              </div>
              <div className="pt-2">
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/70 dark:bg-zinc-800/70 text-xs font-semibold text-[#9e7e40] dark:text-[#E2C785] shadow-sm border border-[#C8A96A]/20 backdrop-blur-sm">
                  ✨ Tema Classic Elegance
                </span>
              </div>
            </div>

            {/* Floating Card Accent */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md border border-white/30 dark:border-zinc-700 p-3 rounded-2xl shadow-lg flex items-center justify-between text-xs z-20">
              <span className="text-zinc-800 dark:text-zinc-200 font-bold">Status Undangan</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100/90 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Ready to Share
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
