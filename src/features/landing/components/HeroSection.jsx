"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { Reveal } from "@/components/ui/Reveal";
import { Plus, Play, Sparkles, Heart } from "lucide-react";

export function HeroSection() {
  return (
    <section 
      className="relative min-h-screen flex items-center pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-[#2C2723]"
    >
      {/* Background Images for SEO & Performance (LCP) */}
      <div className="absolute inset-0 z-0">
        {/* Mobile Background */}
        <div className="block md:hidden relative w-full h-full">
          <Image
            src="/ikara-hero-section-potrait.webp"
            alt="Pasangan pengantin menikmati momen pernikahan dengan undangan digital IKARA"
            fill
            priority
            quality={72}
            sizes="(max-width: 768px) 100vw, 0vw"
            className="object-cover object-center"
          />
        </div>
        
        {/* Desktop Background */}
        <div className="hidden md:block relative w-full h-full">
          <Image
            src="/ikara-hero-section.webp"
            alt="Pasangan pengantin menikmati momen pernikahan dengan undangan digital IKARA"
            fill
            priority
            quality={72}
            sizes="(max-width: 768px) 0vw, 100vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* Gradient overlay: Gelap di kiri (area teks) memudar ke transparan di kanan */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent backdrop-blur-[2px]"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        {/* Text Content */}
        <Reveal
          immediate
          direction="up"
          duration={0.6}
          className="max-w-2xl space-y-6 text-left"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-gold-400/40 text-[#E2C785] text-xs font-semibold uppercase tracking-widest backdrop-blur-md shadow-lg">
            Every Promise Has a Story
          </div>

          {/* Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-xl leading-[1.15]">
            Your Story Deserves a{" "}
            <span className="italic font-serif font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#F6E5B3] via-[#D1A65D] to-[#F6E5B3] drop-shadow-sm">
              Beautiful Beginning
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-white max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed drop-shadow-lg">
            IKARA adalah ruang ketika cinta menjadi janji, dan setiap janji menjadi kisah terpenting yang diabadikan secara elegan.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-2">
            <Link href={ROUTES.LOGIN} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-13 px-7 rounded-2xl bg-gold-400 hover:bg-gold-500 text-white font-medium text-base flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Begin Your Story
              </Button>
            </Link>

            <Link href="/theme/preview/classic-elegance" target="_blank" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-13 px-7 rounded-2xl border-gold-400/50 bg-black/40 backdrop-blur-md hover:bg-gold-400/20 hover:border-gold-400 text-white hover:text-[#F6E5B3] font-medium text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-current text-gold-400" />
                Lihat Demo Tema
              </Button>
            </Link>

          </div>
        </Reveal>
      </div>
    </section>
  );
}
