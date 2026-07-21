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
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#C8A96A]/20 to-[#B76E79]/20 blur-3xl rounded-full pointer-events-none -z-10" />

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
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
            IKARA adalah ruang ketika cinta menjadi janji, dan setiap janji menjadi kisah terpenting yang diabadikan secara elegan.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link href={ROUTES.REGISTER} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-13 px-7 rounded-2xl bg-gradient-to-r from-[#C8A96A] to-[#b39150] hover:from-[#b39150] hover:to-[#9e7e40] text-white font-medium text-base shadow-lg shadow-[#C8A96A]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Begin Your Story
              </Button>
            </Link>

            <Link href="#themes" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-13 px-7 rounded-2xl border-border/80 hover:bg-white/60 dark:hover:bg-zinc-800 text-foreground font-medium text-base flex items-center justify-center gap-2 shadow-sm"
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
          className="lg:col-span-5 flex justify-center"
        >
          <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl bg-gradient-to-b from-[#e8dec6] to-[#f4eee1] dark:from-zinc-800 dark:to-zinc-900 border-4 border-white dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-6 text-center group">
            {/* Arch Decoration Background */}
            <div className="absolute inset-4 rounded-t-full border-2 border-dashed border-[#C8A96A]/40 pointer-events-none" />

            {/* Dummy Arch Graphic Content */}
            <div className="relative z-10 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#C8A96A]/20 flex items-center justify-center text-[#C8A96A] shadow-inner group-hover:scale-110 transition-transform duration-500">
                <Heart className="w-10 h-10 fill-current" />
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-[#C8A96A] font-semibold">
                  The Wedding of
                </p>
                <h3 className="font-heading text-3xl font-bold text-[#1F1F1F] dark:text-zinc-100">
                  Rani & Budi
                </h3>
                <p className="text-xs text-muted-foreground">Sabtu, 24 Oktober 2026</p>
              </div>
              <div className="pt-3">
                <span className="inline-block px-4 py-1.5 rounded-full bg-white dark:bg-zinc-800 text-xs font-medium text-[#C8A96A] shadow-md border border-[#C8A96A]/30">
                  ✨ Tema Classic Elegance
                </span>
              </div>
            </div>

            {/* Floating Card Accent */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-3 rounded-xl border border-white/60 shadow-lg flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Status Undangan</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-semibold">
                ● Ready to Share
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
