"use client";

import { useState, useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import Image from "next/image";
import {
  Check,
  MousePointer,
  Sparkles,
  Smartphone,
  Calendar,
  Heart,
  Gift,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Section "Coba Scroll Simulasi HP".
 * Kolom kiri: value proposition + poin manfaat.
 * Kolom kanan: mockup iPhone (Dynamic Island) berisi preview undangan yang
 * bisa di-scroll (mouse wheel / sentuh / tombol) sebagai demo tema IKARA.
 */
export function InteractiveScrollSection() {
  const scrollRef = useRef(null);
  const [scrolling, setScrolling] = useState(false);

  const handleSimulateScroll = () => {
    if (!scrollRef.current) return;
    setScrolling(true);
    const container = scrollRef.current;
    const targetScroll =
      container.scrollTop > 150 ? 0 : container.scrollHeight - container.clientHeight;

    container.scrollTo({ top: targetScroll, behavior: "smooth" });
    setTimeout(() => setScrolling(false), 1200);
  };

  const benefits = [
    "Animasi mulus & responsif di semua perangkat (HP, Tablet, PC).",
    "Navigasi praktis dengan musik latar & pemutar audio bawaan.",
    "Beragam pilihan tema eksklusif mulai dari klasik hingga modern.",
  ];

  return (
    <section id="fitur" className="scroll-mt-28 bg-background py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12">
        {/* ============ Left: Value proposition ============ */}
        <Reveal
          direction="right"
          duration={0.6}
          className="space-y-6 lg:col-span-6 lg:order-1 order-2"
        >
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-500">
              Desain Berkualitas Tinggi
            </span>
            <h2 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              Coba Langsung Kualitas Tema Kami.
            </h2>
          </div>

          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Setiap tema undangan dirancang dengan teliti untuk memberikan
            pengalaman visual terbaik di layar HP tamu undangan Anda.
          </p>

          <ul className="space-y-3.5 pt-2">
            {benefits.map((text, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-400/15 text-gold-600">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="text-sm font-medium leading-relaxed text-foreground/90 md:text-base">
                  {text}
                </span>
              </li>
            ))}
          </ul>

          <div className="pt-4">
            <Button
              onClick={handleSimulateScroll}
              className="flex h-13 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gold-400 px-7 text-base font-medium text-white shadow-md transition-all hover:bg-gold-500 hover:shadow-lg active:scale-95"
            >
              <MousePointer className="h-4 w-4" />
              {scrolling ? "Sedang Menggulung..." : "Coba Scroll Simulasi HP"}
            </Button>
          </div>
        </Reveal>

        {/* ============ Right: iPhone mockup ============ */}
        <Reveal
          direction="left"
          duration={0.6}
          className="mb-8 flex justify-center lg:col-span-6 lg:order-2 lg:mb-0 order-1"
        >
          <div className="relative w-[300px] sm:w-[320px]">
            {/* Side buttons (titanium rail details) */}
            <span className="absolute -left-[2px] top-[104px] h-7 w-[3px] rounded-l bg-zinc-700" aria-hidden="true" />
            <span className="absolute -left-[2px] top-[150px] h-11 w-[3px] rounded-l bg-zinc-700" aria-hidden="true" />
            <span className="absolute -left-[2px] top-[210px] h-11 w-[3px] rounded-l bg-zinc-700" aria-hidden="true" />
            <span className="absolute -right-[2px] top-[178px] h-16 w-[3px] rounded-r bg-zinc-700" aria-hidden="true" />

            {/* Titanium outer frame */}
            <div className="relative h-[600px] rounded-[3rem] bg-linear-to-b from-zinc-700 via-zinc-900 to-black p-[3px] shadow-2xl">
              {/* Bezel */}
              <div className="relative h-full w-full rounded-[2.85rem] bg-black p-[9px]">
                {/* Screen (scrollable) */}
                <div className="relative h-full w-full overflow-hidden rounded-[2.35rem] bg-background">
                  <div
                    ref={scrollRef}
                    className="h-full w-full overflow-y-auto px-5 pb-16 pt-14 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {/* ===== INVITATION PREVIEW ===== */}
                    <div className="flex flex-col items-center text-center">
                      {/* Cover */}
                      <div className="flex flex-col items-center space-y-6 pb-4">
                        <div className="space-y-1">
                          <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
                            The Wedding Of
                          </p>
                          <p className="pt-2 font-greatvibes text-[40px] leading-none text-gold-500">
                            William
                          </p>
                          <p className="font-greatvibes text-2xl leading-none text-gold-400">&amp;</p>
                          <p className="font-greatvibes text-[40px] leading-none text-gold-500">
                            Eleanor
                          </p>
                        </div>

                        {/* Photo + guest card */}
                        <div className="flex w-full flex-col items-center">
                          <div className="relative h-[210px] w-[150px] rounded-sm bg-white p-1 shadow-md">
                            <div className="relative h-full w-full overflow-hidden rounded-sm border border-dashed border-gold-400/50">
                              <Image
                                src="/ikara-hero-section-potrait.webp"
                                alt="Preview foto pasangan pengantin pada tema undangan IKARA"
                                fill
                                sizes="150px"
                                className="object-cover p-0.5"
                              />
                            </div>
                          </div>

                          <div className="relative -mt-10 flex w-full max-w-[210px] flex-col items-center rounded-2xl border border-zinc-100 bg-white px-5 pb-8 pt-6 text-center shadow-xl">
                            <p className="mb-1.5 text-[7px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                              Kepada Yth.
                            </p>
                            <p className="mb-2.5 font-poppins text-sm font-bold text-zinc-900">
                              Renold
                            </p>
                            <p className="text-[8.5px] leading-[1.6] text-zinc-500">
                              Tanpa mengurangi rasa hormat, kami mengundang Anda
                              untuk hadir di hari bahagia kami.
                            </p>
                            <span className="absolute -bottom-5 flex h-10 w-10 items-center justify-center rounded-full bg-gold-400 text-white shadow-(--shadow-gold-md)">
                              <Mail className="h-4 w-4 fill-current" />
                            </span>
                          </div>

                          <p className="mt-8 text-[8px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
                            Buka
                          </p>
                        </div>
                      </div>

                      {/* Scrollable body: konsisten space-y untuk kerapian */}
                      <div className="w-full space-y-12 pt-8">
                        {/* Divider */}
                        <SectionDivider />

                        {/* Quote */}
                        <div className="space-y-3">
                          <p className="font-greatvibes text-3xl text-gold-500">Kisah Cinta</p>
                          <p className="px-2 text-[9px] italic leading-relaxed text-zinc-500">
                            &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah
                            Dia menciptakan untukmu pasangan dari jenismu
                            sendiri, supaya kamu cenderung dan merasa tenteram
                            kepadanya.&rdquo;
                          </p>
                        </div>

                        {/* Mempelai */}
                        <div className="space-y-6">
                          <PreviewHeading
                            eyebrow="Mempelai Pernikahan"
                            caption="Dengan rahmat Allah SWT, kami memperkenalkan diri"
                          />
                          <CoupleCard
                            initial="W"
                            role="The Groom"
                            name="William Arthur Pratama"
                            parents={<>Putra dari Bapak Arthur &amp;<br />Ibu Claire</>}
                          />
                          <div className="flex items-center justify-center gap-4 py-1">
                            <span className="h-px w-16 bg-gold-400/30" />
                            <span className="font-greatvibes text-4xl text-gold-400/80">&amp;</span>
                            <span className="h-px w-16 bg-gold-400/30" />
                          </div>
                          <CoupleCard
                            initial="E"
                            role="The Bride"
                            name="Eleanor Victoria Azzahra"
                            parents={<>Putri dari Bapak Alexander &amp;<br />Ibu Elizabeth</>}
                            reverse
                          />
                        </div>

                        {/* Kisah Cinta timeline */}
                        <div className="space-y-6">
                          <PreviewHeading eyebrow="Kisah Cinta Kami" />
                          <div className="relative pl-12 text-left">
                            <span className="absolute left-[14px] top-2 bottom-2 w-px bg-gold-400/30" />
                            <div className="space-y-5">
                              <TimelineItem
                                year="2020"
                                title="Pertama Bertemu"
                                desc="Awal mula takdir mempertemukan kami di sebuah acara pertemuan di kampus."
                              />
                              <TimelineItem
                                year="2025"
                                title="Menuju Pelaminan"
                                desc="Setelah melewati banyak cerita bersama, kami memantapkan hati untuk melangkah ke jenjang yang lebih serius."
                              />
                            </div>
                          </div>
                        </div>

                        {/* Acara */}
                        <div className="space-y-6">
                          <PreviewHeading eyebrow="Rangkaian Acara" />
                          <div className="space-y-4">
                            <EventCard
                              icon={Calendar}
                              title="Akad Nikah"
                              date="Rabu, 14 Oktober 2026"
                              time="08:00 WIB - Selesai"
                              place={<>Masjid Agung Kota<br />Jl. Mawar No. 12, Jakarta</>}
                            />
                            <EventCard
                              icon={Heart}
                              iconFill
                              title="Resepsi"
                              date="Rabu, 14 Oktober 2026"
                              time="11:00 WIB - 14:00 WIB"
                              place={<>Grand Ballroom Hotel, Lt. 3<br />Jakarta Selatan</>}
                            />
                          </div>
                        </div>

                        {/* Galeri */}
                        <div className="space-y-4">
                          <p className="font-greatvibes text-3xl text-gold-500">Galeri Momen</p>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              "/ikara-hero-section.webp",
                              "/ikara-hero-section-potrait.webp",
                              "/ikara-hero-section-potrait.webp",
                              "/ikara-hero-section.webp",
                            ].map((src, i) => (
                              <div
                                key={i}
                                className="relative h-24 overflow-hidden rounded-xl border border-gold-400/20 bg-zinc-100"
                              >
                                <Image
                                  src={src}
                                  alt={`Contoh foto galeri undangan ${i + 1}`}
                                  fill
                                  sizes="120px"
                                  className="object-cover opacity-90"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Amplop Digital */}
                        <div className="space-y-4">
                          <p className="font-greatvibes text-3xl text-gold-500">Amplop Digital</p>
                          <div className="flex flex-col items-center space-y-3 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
                            <Gift className="h-5 w-5 text-gold-400" />
                            <p className="px-2 text-[9.5px] leading-relaxed text-zinc-500">
                              Doa restu Anda merupakan karunia yang sangat
                              berarti bagi kami.
                            </p>
                            <div className="mt-1 w-full rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3">
                              <p className="text-[11px] font-bold tracking-wider text-zinc-800">BCA</p>
                              <p className="my-1 font-mono text-[11px] tracking-widest text-zinc-600">
                                1234 5678 90
                              </p>
                              <p className="text-[8.5px] uppercase tracking-widest text-zinc-400">
                                a.n. William
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Ucapan */}
                        <div className="space-y-4">
                          <PreviewHeading eyebrow="Buku Doa & Ucapan" caption="2 ucapan masuk" />
                          <div className="space-y-3">
                            <WishCard
                              initial="A"
                              name="Andi & Keluarga"
                              time="2 hari yang lalu"
                              message="Selamat menempuh hidup baru William & Eleanor! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah."
                            />
                            <WishCard
                              initial="S"
                              name="Sarah (Teman SMA)"
                              time="3 hari yang lalu"
                              message="Akhirnya nyusul juga! Happy wedding babee, so happy for both of you! 🥰"
                            />
                          </div>
                        </div>

                        {/* Penutup */}
                        <div className="space-y-2 pb-6 pt-4">
                          <p className="text-[7.5px] uppercase tracking-[0.25em] text-zinc-400">
                            Merupakan Kehormatan Bagi Kami
                          </p>
                          <p className="font-poppins text-sm font-bold text-gold-500">
                            Kami Yang Berbahagia,
                          </p>
                          <p className="pt-1 font-greatvibes text-4xl leading-none text-gold-500">
                            William &amp; Eleanor
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* ===== END PREVIEW ===== */}
                  </div>

                  {/* Dynamic Island */}
                  <div className="pointer-events-none absolute left-1/2 top-2.5 z-30 flex h-7 w-[92px] -translate-x-1/2 items-center justify-center gap-2 rounded-full bg-black shadow-md">
                    <span className="h-1.5 w-7 rounded-full bg-zinc-800" />
                    <span className="h-2 w-2 rounded-full bg-zinc-700 ring-1 ring-zinc-600" />
                  </div>

                  {/* Glass reflection */}
                  <div className="pointer-events-none absolute inset-0 rounded-[2.35rem] bg-linear-to-tr from-transparent via-transparent to-white/10" />
                </div>
              </div>
            </div>

            {/* Floating scroll CTA */}
            <div className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2">
              <button
                onClick={handleSimulateScroll}
                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-gold-400/40 bg-white/95 px-4 py-2 text-xs font-semibold text-gold-600 shadow-xl transition-all hover:scale-105 active:scale-95 dark:bg-zinc-900/95"
              >
                <Smartphone className="h-3.5 w-3.5" />
                {scrolling ? "Menggulung..." : "Coba Scroll"}
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------- Preview sub-components --------------------------- */

function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-2 opacity-60">
      <span className="h-px w-8 bg-gold-400" />
      <Sparkles className="h-3 w-3 text-gold-400" />
      <span className="h-px w-8 bg-gold-400" />
    </div>
  );
}

function PreviewHeading({ eyebrow, caption }) {
  return (
    <div className="space-y-2 text-center">
      <div className="flex items-center justify-center gap-2 text-gold-400/70">
        <span className="h-px w-6 bg-gold-400/40" />
        <Sparkles className="h-3 w-3 fill-gold-400 text-gold-400" />
        <span className="h-px w-6 bg-gold-400/40" />
      </div>
      <h3 className="font-poppins text-lg font-bold leading-tight text-gold-500">{eyebrow}</h3>
      {caption && <p className="px-3 text-[9.5px] leading-relaxed text-zinc-500">{caption}</p>}
    </div>
  );
}

function CoupleCard({ initial, role, name, parents }) {
  return (
    <div className="flex flex-col items-center space-y-4 rounded-3xl border border-gold-400/15 bg-white p-6 text-center shadow-sm">
      <div className="relative flex h-[72px] w-[72px] items-center justify-center">
        <span className="absolute inset-0 animate-[spin_30s_linear_infinite] rounded-full border border-dashed border-gold-400/50" />
        <span className="absolute inset-1.5 rounded-full border border-gold-400/20" />
        <span className="z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 shadow-inner">
          <span className="font-poppins text-2xl font-bold text-gold-500">{initial}</span>
        </span>
      </div>
      <div className="space-y-1.5">
        <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-gold-500">{role}</p>
        <h4 className="px-2 font-poppins text-base font-bold leading-tight text-gold-600">{name}</h4>
        <p className="pt-1 text-[9.5px] leading-[1.6] text-zinc-500">{parents}</p>
      </div>
    </div>
  );
}

function TimelineItem({ year, title, desc }) {
  return (
    <div className="relative">
      <span className="absolute -left-[40px] top-3 flex h-4 w-4 items-center justify-center rounded-full border-[3px] border-gold-50 bg-white shadow-sm">
        <span className="h-2 w-2 rounded-full bg-gold-400" />
      </span>
      <div className="space-y-1 rounded-[18px] border border-gold-400/10 bg-white p-4 shadow-sm">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold-500">{year}</p>
        <h4 className="font-poppins text-[14px] font-bold leading-tight text-zinc-800">{title}</h4>
        <p className="pt-1 text-[9.5px] leading-relaxed text-zinc-500">{desc}</p>
      </div>
    </div>
  );
}

function EventCard({ icon: Icon, iconFill, title, date, time, place }) {
  return (
    <div className="flex flex-col items-center space-y-2 rounded-2xl border border-zinc-100 bg-white p-5 text-center shadow-sm">
      <Icon className={`h-4 w-4 text-gold-400 ${iconFill ? "fill-current" : ""}`} />
      <h4 className="pt-1 font-poppins text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-800">
        {title}
      </h4>
      <div className="space-y-1 pt-1 text-[9.5px] text-zinc-500">
        <p className="font-semibold text-zinc-700">{date}</p>
        <p>{time}</p>
        <p className="pt-1.5 leading-relaxed">{place}</p>
      </div>
    </div>
  );
}

function WishCard({ initial, name, time, message }) {
  return (
    <div className="space-y-3 rounded-2xl border border-gold-400/15 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gold-400/20 bg-gold-50 font-poppins text-xs font-bold text-gold-500">
          {initial}
        </span>
        <div className="flex flex-col text-left">
          <p className="text-[10px] font-bold leading-none text-zinc-800">{name}</p>
          <p className="mt-1 text-[7.5px] text-zinc-400">{time}</p>
        </div>
      </div>
      <p className="rounded-xl border border-gold-400/5 bg-gold-50/50 p-3 text-left text-[9px] leading-[1.6] text-zinc-500">
        {message}
      </p>
    </div>
  );
}
