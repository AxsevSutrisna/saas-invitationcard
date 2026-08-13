"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
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
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function InteractiveScrollSection() {
  const scrollRef = useRef(null);
  const [scrolling, setScrolling] = useState(false);

  const handleSimulateScroll = () => {
    if (!scrollRef.current) return;
    setScrolling(true);
    const container = scrollRef.current;
    const targetScroll = container.scrollTop > 150 ? 0 : container.scrollHeight - container.clientHeight;
    
    container.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });

    setTimeout(() => setScrolling(false), 1200);
  };

  return (
    <section id="fitur" className="py-20 md:py-28 bg-[#F8F6F2]">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Descriptions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 space-y-6 order-2 lg:order-1"
        >
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A96A]">
              Desain Berkualitas Tinggi
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1F1F1F] dark:text-zinc-50 leading-tight">
              Coba Langsung Kualitas Tema Kami.
            </h2>
          </div>

          <p className="text-zinc-600 dark:text-zinc-300 text-base md:text-lg leading-relaxed">
            Setiap tema undangan dirancang dengan teliti untuk memberikan pengalaman visual terbaik di layar HP tamu undangan Anda.
          </p>

          <ul className="space-y-3 pt-2">
            {[
              "Animasi mulus & responsif di semua perangkat (HP, Tablet, PC).",
              "Navigasi praktis dengan musik latar & pemutar audio bawaan.",
              "Beragam pilihan tema eksklusif mulai dari klasik hingga modern.",
            ].map((text, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-zinc-700 dark:text-zinc-200 font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#C8A96A] shrink-0 mt-0.5" />
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4">
            <Button
              onClick={handleSimulateScroll}
              className="h-13 px-7 rounded-2xl bg-[#C8A96A] hover:bg-[#b39150] text-white font-medium text-base flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all active:scale-95"
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
          className="lg:col-span-6 flex justify-center order-1 lg:order-2 mb-8 lg:mb-0"
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
              <div className="min-h-full flex flex-col items-center py-10 relative">
                
                {/* Decorative Elements */}
                <div className="absolute top-1/4 left-6 w-1 h-1 rounded-full bg-[#C8A96A]/60" />
                <div className="absolute top-1/2 right-6 w-1.5 h-1.5 rounded-full bg-[#C8A96A]/40" />

                {/* Typography */}
                <div className="space-y-1 mb-8 relative z-10 text-center mt-2">
                  <p className="text-[8px] uppercase tracking-[0.25em] text-zinc-500 font-semibold">
                    The Wedding Of
                  </p>
                  <h3 className="font-greatvibes text-[38px] text-[#C8A96A] font-normal leading-none pt-4">
                    William
                  </h3>
                  <div className="font-greatvibes text-2xl text-[#C8A96A] leading-none my-1">
                    &
                  </div>
                  <h3 className="font-greatvibes text-[38px] text-[#C8A96A] font-normal leading-none">
                    Eleanor
                  </h3>
                </div>

                {/* Photo & Overlapping Card */}
                <div className="relative z-10 flex flex-col items-center w-full px-6">
                  
                  {/* Photo Frame */}
                  <div className="relative w-[150px] h-[210px] bg-white p-1 shadow-md rounded-sm">
                     <div className="relative w-full h-full border border-dashed border-[#C8A96A]/50 rounded-sm">
                       <Image
                          src="/ikara-hero-section-potrait.png"
                          alt="Wedding Couple Preview"
                          fill
                          sizes="(max-width: 768px) 100vw, 150px"
                          className="object-cover p-0.5"
                       />
                     </div>
                  </div>

                  {/* Overlapping Guest Card */}
                  <div className="relative -mt-10 w-full max-w-[210px] bg-white rounded-2xl px-5 pt-6 pb-8 shadow-xl border border-zinc-100 flex flex-col items-center text-center">
                    <p className="text-[7px] uppercase tracking-[0.2em] text-zinc-400 mb-1.5 font-bold">
                      Kepada Yth.
                    </p>
                    <p className="font-bold text-sm text-zinc-900 mb-2.5 font-poppins">
                      Renold
                    </p>
                    <p className="text-[8.5px] text-zinc-500 leading-[1.6]">
                      Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di hari bahagia kami.
                    </p>
                    
                    {/* Floating Mail Button */}
                    <div className="absolute -bottom-5 w-10 h-10 bg-[#C8A96A] text-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(200,169,106,0.4)]">
                      <Mail className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                  
                  {/* Text BUKA */}
                  <p className="text-[8px] uppercase tracking-[0.3em] text-zinc-500 mt-8 font-semibold">
                    Buka
                  </p>

                </div>

                {/* --- INVITATION CONTENTS (SCROLL DOWN) --- */}
                <div className="w-full px-4 mt-16 space-y-12 pb-10 relative z-10">
                  
                  {/* Divider */}
                  <div className="flex items-center justify-center gap-2 opacity-50">
                    <div className="w-8 h-[1px] bg-[#C8A96A]" />
                    <Sparkles className="w-3 h-3 text-[#C8A96A]" />
                    <div className="w-8 h-[1px] bg-[#C8A96A]" />
                  </div>

                  {/* Quote */}
                  <div className="text-center space-y-3">
                     <p className="font-greatvibes text-3xl text-[#C8A96A]">Kisah Cinta</p>
                     <p className="text-[9px] text-zinc-500 italic leading-relaxed px-2">
                       "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya."
                     </p>
                  </div>

                  {/* Mempelai Pernikahan Section */}
                  <div className="space-y-6 pt-6 pb-2">
                     <div className="text-center space-y-3">
                        <div className="flex items-center justify-center gap-3 text-[#C8A96A]/60">
                           <div className="w-8 h-[1px] bg-[#C8A96A]/30"></div>
                           <Sparkles className="w-3.5 h-3.5 fill-[#C8A96A]" />
                           <div className="w-8 h-[1px] bg-[#C8A96A]/30"></div>
                        </div>
                        <h3 className="font-poppins text-2xl font-bold text-[#C8A96A] leading-[1.1]">
                           Mempelai<br/>Pernikahan
                        </h3>
                        <p className="text-[9.5px] text-zinc-500 px-2 leading-relaxed">
                           Dengan rahmat Allah SWT, kami memperkenalkan diri
                        </p>
                     </div>

                     {/* Groom Card */}
                     <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#C8A96A]/15 flex flex-col items-center text-center space-y-4">
                        <div className="relative w-[72px] h-[72px] flex items-center justify-center">
                           <div className="absolute inset-0 rounded-full border border-dashed border-[#C8A96A]/50 animate-[spin_30s_linear_infinite]" />
                           <div className="absolute inset-1.5 rounded-full border border-[#C8A96A]/20" />
                           <div className="w-14 h-14 bg-[#FAF7F2] rounded-full flex items-center justify-center shadow-inner z-10">
                              <span className="font-poppins text-2xl font-bold text-[#C8A96A]">W</span>
                           </div>
                           {/* Outer Dots Decoration */}
                           <div className="absolute -top-1.5 w-1.5 h-1.5 rounded-full bg-[#C8A96A]/30" />
                           <div className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-[#C8A96A]/30" />
                           <div className="absolute -left-1.5 w-1.5 h-1.5 rounded-full bg-[#C8A96A]/30" />
                           <div className="absolute -right-1.5 w-1.5 h-1.5 rounded-full bg-[#C8A96A]/30" />
                        </div>
                        <div className="space-y-1.5">
                           <p className="text-[8px] uppercase tracking-[0.25em] text-[#C8A96A] font-bold">
                              The Groom
                           </p>
                           <h4 className="font-poppins text-lg font-bold text-[#C8A96A] leading-tight px-2">
                              William Arthur Pratama
                           </h4>
                           <p className="text-[9.5px] text-zinc-500 pt-1 leading-[1.6]">
                              Putra dari Bapak Arthur &<br/>Ibu Claire
                           </p>
                        </div>
                     </div>

                     {/* The '&' Divider */}
                     <div className="flex items-center justify-center gap-4 text-[#C8A96A]/40 py-2">
                        <div className="w-16 h-[1px] bg-[#C8A96A]/30"></div>
                        <span className="font-greatvibes text-4xl text-[#C8A96A] opacity-80">&</span>
                        <div className="w-16 h-[1px] bg-[#C8A96A]/30"></div>
                     </div>

                     {/* Bride Card */}
                     <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#C8A96A]/15 flex flex-col items-center text-center space-y-4">
                        <div className="relative w-[72px] h-[72px] flex items-center justify-center">
                           <div className="absolute inset-0 rounded-full border border-dashed border-[#C8A96A]/50 animate-[spin_30s_linear_infinite_reverse]" />
                           <div className="absolute inset-1.5 rounded-full border border-[#C8A96A]/20" />
                           <div className="w-14 h-14 bg-[#FAF7F2] rounded-full flex items-center justify-center shadow-inner z-10">
                              <span className="font-poppins text-2xl font-bold text-[#C8A96A]">E</span>
                           </div>
                           {/* Outer Dots Decoration */}
                           <div className="absolute -top-1.5 w-1.5 h-1.5 rounded-full bg-[#C8A96A]/30" />
                           <div className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-[#C8A96A]/30" />
                           <div className="absolute -left-1.5 w-1.5 h-1.5 rounded-full bg-[#C8A96A]/30" />
                           <div className="absolute -right-1.5 w-1.5 h-1.5 rounded-full bg-[#C8A96A]/30" />
                        </div>
                        <div className="space-y-1.5">
                           <p className="text-[8px] uppercase tracking-[0.25em] text-[#C8A96A] font-bold">
                              The Bride
                           </p>
                           <h4 className="font-poppins text-lg font-bold text-[#C8A96A] leading-tight px-2">
                              Eleanor Victoria Azzahra
                           </h4>
                           <p className="text-[9.5px] text-zinc-500 pt-1 leading-[1.6]">
                              Putri dari Bapak Alexander &<br/>Ibu Elizabeth
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Kisah Cinta Timeline Section */}
                  <div className="space-y-8 pt-8 pb-4">
                     <div className="text-center space-y-3">
                        <h3 className="font-poppins text-[28px] font-bold text-[#C8A96A] leading-[1.1]">
                           Kisah Cinta<br/>Kami
                        </h3>
                        <div className="flex items-center justify-center gap-3 text-[#C8A96A]/60 pt-2">
                           <div className="w-6 h-[1px] bg-[#C8A96A]/30"></div>
                           <Sparkles className="w-3.5 h-3.5 fill-[#C8A96A]" />
                           <div className="w-10 h-[1px] bg-[#C8A96A]/30"></div>
                           <Sparkles className="w-3.5 h-3.5 fill-[#C8A96A]" />
                           <div className="w-6 h-[1px] bg-[#C8A96A]/30"></div>
                        </div>
                     </div>

                     {/* Timeline Container */}
                     <div className="relative px-2">
                        {/* Vertical Line */}
                        <div className="absolute left-[26px] top-6 bottom-8 w-[1px] bg-[#C8A96A]/30" />
                        
                        <div className="space-y-6 pl-14 pr-2">
                           {/* Item 1 */}
                           <div className="relative">
                              {/* Timeline Dot */}
                              <div className="absolute -left-[40.5px] top-4 w-4 h-4 bg-white rounded-full flex items-center justify-center z-10 shadow-sm border-[3px] border-[#FAF7F2]">
                                 <div className="w-2 h-2 bg-[#C8A96A] rounded-full" />
                              </div>
                              {/* Card */}
                              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-[#C8A96A]/10 text-left space-y-1.5">
                                 <p className="text-[9px] font-bold text-[#C8A96A] tracking-[0.2em] uppercase">2020</p>
                                 <h4 className="font-poppins text-[15px] font-bold text-[#1f2937] leading-tight">
                                   Pertama<br/>Bertemu
                                 </h4>
                                 <p className="text-[9.5px] text-zinc-500 leading-relaxed pt-1.5">
                                   Awal mula takdir mempertemukan kami di sebuah acara pertemuan di kampus.
                                 </p>
                              </div>
                           </div>

                           {/* Item 2 */}
                           <div className="relative">
                              {/* Timeline Dot */}
                              <div className="absolute -left-[40.5px] top-4 w-4 h-4 bg-white rounded-full flex items-center justify-center z-10 shadow-sm border-[3px] border-[#FAF7F2]">
                                 <div className="w-2 h-2 bg-[#C8A96A] rounded-full" />
                              </div>
                              {/* Card */}
                              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-[#C8A96A]/10 text-left space-y-1.5">
                                 <p className="text-[9px] font-bold text-[#C8A96A] tracking-[0.2em] uppercase">2025</p>
                                 <h4 className="font-poppins text-[15px] font-bold text-[#1f2937] leading-tight">
                                   Menuju<br/>Pelaminan
                                 </h4>
                                 <p className="text-[9.5px] text-zinc-500 leading-relaxed pt-1.5">
                                   Setelah melewati banyak cerita bersama, kami memantapkan hati untuk melangkah ke jenjang yang lebih serius.
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Events */}
                  <div className="space-y-4">
                    {/* Akad */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-100 flex flex-col items-center text-center space-y-2">
                      <Calendar className="w-4 h-4 text-[#C8A96A]" />
                      <h4 className="font-poppins font-bold text-[11px] text-zinc-800 uppercase tracking-[0.2em] pt-1">Akad Nikah</h4>
                      <div className="text-[9.5px] text-zinc-500 space-y-1 pt-1">
                        <p className="font-semibold text-zinc-700">Rabu, 14 Oktober 2026</p>
                        <p>08:00 WIB - Selesai</p>
                        <p className="pt-1.5 leading-relaxed">Masjid Agung Kota<br/>Jl. Mawar No. 12, Jakarta</p>
                      </div>
                    </div>

                    {/* Resepsi */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-100 flex flex-col items-center text-center space-y-2">
                      <Heart className="w-4 h-4 text-[#C8A96A] fill-current" />
                      <h4 className="font-poppins font-bold text-[11px] text-zinc-800 uppercase tracking-[0.2em] pt-1">Resepsi</h4>
                      <div className="text-[9.5px] text-zinc-500 space-y-1 pt-1">
                        <p className="font-semibold text-zinc-700">Rabu, 14 Oktober 2026</p>
                        <p>11:00 WIB - 14:00 WIB</p>
                        <p className="pt-1.5 leading-relaxed">Grand Ballroom Hotel, Lt. 3<br/>Jakarta Selatan</p>
                      </div>
                    </div>
                  </div>

                  {/* Gallery */}
                  <div className="text-center space-y-4">
                    <h4 className="font-greatvibes text-3xl text-[#C8A96A]">Galeri Momen</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative h-24 rounded-xl overflow-hidden bg-zinc-100 border border-[#C8A96A]/20">
                        <Image src="/ikara-hero-section.png" alt="Gallery 1" fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover opacity-90" />
                      </div>
                      <div className="relative h-24 rounded-xl overflow-hidden bg-zinc-100 border border-[#C8A96A]/20">
                        <Image src="/ikara-hero-section-potrait.png" alt="Gallery 2" fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover opacity-90" />
                      </div>
                      <div className="relative h-24 rounded-xl overflow-hidden bg-zinc-100 border border-[#C8A96A]/20">
                        <Image src="/ikara-hero-section-potrait.png" alt="Gallery 3" fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover opacity-90" />
                      </div>
                      <div className="relative h-24 rounded-xl overflow-hidden bg-zinc-100 border border-[#C8A96A]/20">
                        <Image src="/ikara-hero-section.png" alt="Gallery 4" fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover opacity-90" />
                      </div>
                    </div>
                  </div>

                  {/* Amplop Digital */}
                  <div className="text-center space-y-4">
                    <h4 className="font-greatvibes text-3xl text-[#C8A96A]">Amplop Digital</h4>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-100 flex flex-col items-center space-y-3">
                       <Gift className="w-5 h-5 text-[#C8A96A]" />
                       <p className="text-[9.5px] text-zinc-500 leading-relaxed px-2">
                         Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
                       </p>
                       <div className="bg-zinc-50 px-4 py-3 rounded-xl border border-zinc-100 w-full mt-2">
                         <p className="font-bold text-[11px] text-zinc-800 tracking-wider">BCA</p>
                         <p className="text-[11px] text-zinc-600 font-mono tracking-widest my-1">1234 5678 90</p>
                         <p className="text-[8.5px] text-zinc-400 uppercase tracking-widest">a.n. William</p>
                       </div>
                    </div>
                  </div>

                  {/* Guestbook */}
                  <div className="space-y-4 pt-4 pb-2">
                     <h4 className="font-poppins font-bold text-[10.5px] text-zinc-400 uppercase tracking-widest text-center">
                        Buku Doa & Ucapan (2)
                     </h4>
                     
                     <div className="space-y-3 px-1">
                        {/* Wish 1 */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#C8A96A]/15 space-y-3">
                           <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#C8A96A]/20 flex items-center justify-center text-[#C8A96A] font-bold text-xs font-poppins">
                                 A
                              </div>
                              <div className="flex flex-col text-left">
                                 <p className="text-[10px] font-bold text-zinc-800 leading-none">Andi & Keluarga</p>
                                 <p className="text-[7.5px] text-zinc-400 mt-1">2 Hari yang lalu</p>
                              </div>
                           </div>
                           <p className="text-[9px] text-zinc-500 text-left leading-[1.6] bg-[#FAF7F2]/50 p-3 rounded-xl border border-[#C8A96A]/5">
                              Selamat menempuh hidup baru William & Eleanor! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Lancar sampai hari H yaa.
                           </p>
                        </div>

                        {/* Wish 2 */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#C8A96A]/15 space-y-3">
                           <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#C8A96A]/20 flex items-center justify-center text-[#C8A96A] font-bold text-xs font-poppins">
                                 S
                              </div>
                              <div className="flex flex-col text-left">
                                 <p className="text-[10px] font-bold text-zinc-800 leading-none">Sarah (Teman SMA)</p>
                                 <p className="text-[7.5px] text-zinc-400 mt-1">3 Hari yang lalu</p>
                              </div>
                           </div>
                           <p className="text-[9px] text-zinc-500 text-left leading-[1.6] bg-[#FAF7F2]/50 p-3 rounded-xl border border-[#C8A96A]/5">
                              Akhirnya nyusul juga! Happy wedding babee, so happy for both of you! 🥰
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Footer */}
                  <div className="text-center pt-10 pb-12 space-y-2 mt-4 relative">
                    {/* Circle ornament */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34px] h-[34px] flex items-center justify-center">
                       <div className="absolute inset-0 rounded-full border border-dashed border-[#C8A96A]/40 animate-[spin_15s_linear_infinite]" />
                       <div className="w-5 h-5 bg-[#FAF7F2] rounded-full border border-[#C8A96A]/20 z-10" />
                       <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#C8A96A]/30" />
                       <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#C8A96A]/30" />
                       <div className="absolute -left-1 w-1.5 h-1.5 rounded-full bg-[#C8A96A]/30" />
                       <div className="absolute -right-1 w-1.5 h-1.5 rounded-full bg-[#C8A96A]/30" />
                    </div>
                    
                    <div className="pt-3 space-y-1.5">
                       <p className="text-[7.5px] text-zinc-400 uppercase tracking-[0.25em]">Merupakan Kehormatan Bagi Kami</p>
                       <p className="font-poppins text-sm font-bold text-[#C8A96A] leading-tight">
                         Kami Yang Berbahagia,
                       </p>
                       <h3 className="font-greatvibes text-4xl text-[#C8A96A] font-normal leading-none pt-1">
                         William & Eleanor
                       </h3>
                    </div>
                  </div>

                </div>
                {/* --- END INVITATION CONTENTS --- */}

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
