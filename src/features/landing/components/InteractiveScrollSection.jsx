"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  MousePointer,
  Sparkles,
  Smartphone,
  Calendar,
  MapPin,
  Gift,
  Heart,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * InteractiveScrollSection Component
 * Frame Mockup HP interaktif yang dapat di-scroll baik secara manual (mouse wheel/touch)
 * maupun dengan tombol simulasi scroll.
 */
export function InteractiveScrollSection() {
  const scrollRef = useRef(null);
  const [scrolling, setScrolling] = useState(false);

  const handleSimulateScroll = () => {
    if (!scrollRef.current) return;
    setScrolling(true);
    const container = scrollRef.current;
    
    // Check current scroll position to scroll down or back up
    const targetScroll = container.scrollTop > 150 ? 0 : container.scrollHeight - container.clientHeight;
    
    container.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });

    setTimeout(() => setScrolling(false), 1200);
  };

  return (
    <section id="fitur" className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Descriptions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 space-y-6"
        >
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A96A]">
              Desain Berkualitas Tinggi
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1F1F1F] dark:text-zinc-50 leading-tight">
              Coba Langsung Kualitas Tema Kami.
            </h2>
          </div>

          <p className="text-muted-foreground text-base leading-relaxed">
            Setiap tema undangan dirancang dengan teliti untuk memberikan pengalaman visual terbaik di layar HP tamu undangan Anda.
          </p>

          <ul className="space-y-3 pt-2">
            {[
              "Animasi mulus & responsif di semua perangkat (HP, Tablet, PC).",
              "Navigasi praktis dengan musik latar & pemutar audio bawaan.",
              "Beragam pilihan tema eksklusif mulai dari klasik hingga modern.",
            ].map((text, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-foreground">
                <CheckCircle2 className="w-5 h-5 text-[#C8A96A] shrink-0 mt-0.5" />
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4">
            <Button
              onClick={handleSimulateScroll}
              className="bg-gradient-to-r from-[#C8A96A] to-[#b39150] hover:from-[#b39150] hover:to-[#9e7e40] text-white rounded-2xl h-12 px-6 shadow-md flex items-center gap-2"
            >
              <MousePointer className="w-4 h-4" />
              {scrolling ? "Sedang Menggulung..." : "Coba Scroll Simulasi HP"}
            </Button>
          </div>
        </motion.div>

        {/* Right Column: Interactive Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 flex justify-center"
        >
          <div className="relative w-[300px] sm:w-[320px] h-[560px] bg-[#1F1F1F] rounded-[45px] p-3 shadow-2xl border-4 border-zinc-700/60 flex flex-col group">
            {/* Speaker / Notch */}
            <div className="w-32 h-5 bg-zinc-900 rounded-b-2xl mx-auto absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
              <div className="w-10 h-1 bg-zinc-700 rounded-full" />
            </div>

            {/* Inner Phone Screen (Fully Scrollable via Mouse Wheel, Touch, or Button) */}
            <div
              ref={scrollRef}
              className="w-full h-full bg-[#F8F6F2] dark:bg-zinc-950 rounded-[35px] overflow-y-auto relative pt-8 px-4 pb-16 space-y-5 text-center transition-all focus:outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {/* Header Section */}
              <div className="pt-6 space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-[#C8A96A] font-semibold">
                  The Wedding of
                </p>
                <h3 className="font-heading text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  John & Sarah
                </h3>
                <p className="text-xs text-muted-foreground">Rabu, 14 Oktober 2026</p>
              </div>

              {/* Love Banner */}
              <div className="w-full py-8 rounded-2xl bg-gradient-to-b from-amber-200/60 to-amber-100/30 border border-[#C8A96A]/30 flex flex-col items-center justify-center p-4 text-center space-y-2">
                <Sparkles className="w-7 h-7 text-[#C8A96A]" />
                <p className="font-heading text-base font-semibold text-zinc-800">
                  Kisah Cinta Kami
                </p>
                <p className="text-[11px] text-zinc-600 italic">
                  "Menyatu dalam ikatan suci pernikahan"
                </p>
              </div>

              {/* Akad Event Section */}
              <div className="p-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm text-left space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#C8A96A] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Akad Nikah
                  </span>
                  <span className="text-[10px] text-zinc-400">08:00 WIB</span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> Masjid Agung Kota, Jl. Mawar No. 12
                </p>
              </div>

              {/* Reception Event Section */}
              <div className="p-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm text-left space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#C8A96A] flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-current" /> Resepsi Nikah
                  </span>
                  <span className="text-[10px] text-zinc-400">11:00 - Selesai</span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> Grand Ballroom Hotel, Lt. 3
                </p>
              </div>

              {/* Gallery Section */}
              <div className="p-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2 text-center">
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-[#C8A96A]" /> Galeri Momen
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-16 rounded-xl bg-amber-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">
                    📷 Foto 1
                  </div>
                  <div className="h-16 rounded-xl bg-amber-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">
                    📷 Foto 2
                  </div>
                </div>
              </div>

              {/* Gift Section */}
              <div className="p-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm text-center space-y-1">
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-1">
                  <Gift className="w-3.5 h-3.5 text-[#C8A96A]" /> Amplop Digital
                </span>
                <p className="text-[10px] text-zinc-500">BCA: 1234-5678-90 (a.n Sarah)</p>
              </div>

              {/* Footer Note */}
              <div className="pt-2 pb-4 text-[10px] text-zinc-400">
                Terima kasih atas kehadiran & doa restu Anda
              </div>
            </div>

            {/* Floating Action Button on HP Screen */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30">
              <button
                onClick={handleSimulateScroll}
                className="px-4 py-2 rounded-full bg-white/95 dark:bg-zinc-900/95 text-xs font-semibold text-[#C8A96A] shadow-xl border border-[#C8A96A]/40 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                {scrolling ? "Menggulung..." : "Coba Scroll"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
