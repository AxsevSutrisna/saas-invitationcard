"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Link as LinkIcon } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { ThemeRegistry } from "@/features/theme/components/ThemeRegistry";
import { EnvelopeCover } from "@/features/theme/components/EnvelopeCover";
import { getThemeConfig } from "@/features/theme/theme-config";

export function LivePhonePreview({ formData, themes = [] }) {
  const selectedTheme =
    themes.find((t) => t.id === formData?.themeId) || themes[0] || {
      name: "Classic Elegance",
      slug: "classic-elegance",
    };

  const themeKey = selectedTheme.slug || "classic-elegance";
  const themeStyle = getThemeConfig(themeKey).preview;

  const title = formData?.title || "Pernikahan William & Eleanor";
  const slug = formData?.slug || "william-eleanor";

  const groomNickname = formData?.groomNickname || formData?.groomName || "William";
  const groomFullName = formData?.groomFullName || "William Jonathan Tanuwijaya";
  const groomFather = formData?.groomFather || "Bapak William Jonathan";
  const groomMother = formData?.groomMother || "Ibu William Jonathan";
  const groomPhotoUrl = formData?.groomPhotoUrl;

  const brideNickname = formData?.brideNickname || formData?.brideName || "Eleanor";
  const brideFullName = formData?.brideFullName || "Eleanor Grace Tanuwidjaja";
  const brideFather = formData?.brideFather || "Bapak Eleanor Grace";
  const brideMother = formData?.brideMother || "Ibu Eleanor Grace";
  const bridePhotoUrl = formData?.bridePhotoUrl;

  const coverUrl = formData?.coverUrl;
  const quotes =
    formData?.quotes ||
    "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang. (QS. Ar-Rum: 21)";

  const eventsList =
    formData?.events && formData.events.length > 0
      ? formData.events
      : [
          {
            name: "Akad Nikah",
            date: "2026-08-18",
            startTime: "08:00",
            locationName: "Masjid Istiqlal",
            address: "Jl. Taman Sunda Kelapa No.16, Menteng, Jakarta Pusat",
          },
          {
            name: "Resepsi Pernikahan",
            date: "2026-08-18",
            startTime: "11:00",
            locationName: "Hotel Indonesia Kempinski",
            address: "Jl. M.H. Thamrin No.1, Menteng, Jakarta Pusat",
          },
        ];

  const loveStories = formData?.loveStories || [
    {
      title: "Menuju Pelaminan",
      date: "2025",
      description: "Setelah melewati banyak cerita bersama, kami memantapkan hati untuk melangkah ke jenjang pernikahan.",
    },
  ];

  const galleryLayout = formData?.galleryLayout || "CAROUSEL";
  const galleries = formData?.galleries || [];

  const gifts = formData?.gifts || [
    {
      type: "BANK",
      providerName: "BCA",
      accountName: groomFullName,
      accountNumber: "1234567890",
    },
  ];
  const physicalGiftAddress = formData?.physicalGiftAddress;

  const musicTitle = formData?.musicTitle || "Nadhif Basalamah - Bergema Sampai Selamanya";
  const isMusicEnabled = formData?.isMusicEnabled !== false;

  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = formData?.musicUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
      audioRef.current.load();
      if (!isMuted && isMusicEnabled) {
        audioRef.current.play().catch((err) => console.log("Autoplay blocked:", err));
      }
    }
  }, [formData?.musicUrl, isMusicEnabled]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isMusicEnabled && !isMuted) {
      audioRef.current.play().catch((err) => console.log("Play failed:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isMusicEnabled, isMuted]);

  // Autoplay galeri ditangani oleh tema di dalam ThemeRegistry (useCarousel),
  // jadi tidak ada state carousel duplikat di sini.

  const [isCoverOpen, setIsCoverOpen] = useState(false);

  useEffect(() => {
    setIsCoverOpen(false);
  }, [formData?.themeId]);

  return (
    <div className="sticky top-20 flex flex-col items-center justify-center p-4">
      {/* Badge Indicator Tema Aktif */}
      <div
        className={`mb-4 px-3.5 py-1 rounded-full border text-[11px] font-semibold flex items-center gap-1.5 shadow-sm transition-all duration-300 ${themeStyle.accentBg}`}
      >
        <Sparkles className="w-3.5 h-3.5 fill-current" />
        <span>Live Preview: {selectedTheme.name}</span>
      </div>

      {/* Mockup smartphone premium — rangka titanium + dynamic island */}
      <div className="relative">
        {/* Glow lembut di belakang perangkat */}
        <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[60px] bg-gold-400/10 blur-2xl" />

        {/* Rangka titanium (chamfered metallic edge) */}
        <div className="relative h-155 w-72.5 rounded-[54px] bg-linear-to-b from-zinc-300 via-zinc-600 to-zinc-500 p-0.75 shadow-[0_35px_70px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/20 sm:h-160 sm:w-79">
          {/* Tombol samping metalik */}
          <div className="absolute -left-0.75 top-26 h-7 w-0.75 rounded-l-md bg-linear-to-b from-zinc-200 via-zinc-500 to-zinc-200" />
          <div className="absolute -left-0.75 top-37.5 h-12 w-0.75 rounded-l-md bg-linear-to-b from-zinc-200 via-zinc-500 to-zinc-200" />
          <div className="absolute -left-0.75 top-52 h-12 w-0.75 rounded-l-md bg-linear-to-b from-zinc-200 via-zinc-500 to-zinc-200" />
          <div className="absolute -right-0.75 top-45 h-16 w-0.75 rounded-r-md bg-linear-to-b from-zinc-200 via-zinc-500 to-zinc-200" />

          {/* Bezel hitam */}
          <div className="relative h-full w-full rounded-[51px] bg-black p-2.75">
            {/* Layar */}
            <div className="relative h-full w-full overflow-hidden rounded-[41px] bg-[#0b0b0d] text-center">
              {/* Dynamic Island */}
              <div className="absolute left-1/2 top-2.5 z-50 flex h-6.5 w-24 -translate-x-1/2 items-center justify-end gap-2 rounded-full bg-black px-3 shadow-[inset_0_0_2px_rgba(255,255,255,0.15)]">
                <div className="h-2.5 w-2.5 rounded-full bg-[#0a0a0f] ring-1 ring-zinc-700" />
              </div>

              {/* Refleksi kaca */}
              <div className="pointer-events-none absolute inset-0 z-30 bg-linear-to-tr from-transparent via-white/5 to-white/10" />

              {/* Area konten layar (scrollable) */}
              <div
                className={`w-full h-full ${isCoverOpen ? "overflow-y-auto" : "overflow-hidden"} [&::-webkit-scrollbar]:hidden relative text-left`}
              >
                <AnimatePresence>
                  {!isCoverOpen && (
                    <EnvelopeCover
                      invitation={{
                        title,
                        slug,
                        theme: selectedTheme,
                        coverUrl,
                        groomNickname,
                        brideNickname,
                      }}
                      guestName="Tamu Undangan"
                      onOpen={() => {
                        setIsCoverOpen(true);
                        setIsMuted(false);
                      }}
                    />
                  )}
                </AnimatePresence>

                {isCoverOpen && (
                  <ThemeRegistry
                    invitation={{
                      title,
                      slug,
                      theme: selectedTheme,
                      groomNickname,
                      groomFullName,
                      groomFather,
                      groomMother,
                      groomPhotoUrl,
                      brideNickname,
                      brideFullName,
                      brideFather,
                      brideMother,
                      bridePhotoUrl,
                      coverUrl,
                      galleryLayout,
                      quotes,
                      openingText: formData?.openingText || "",
                      physicalGiftAddress: formData?.physicalGiftAddress || "",
                      physicalGiftReceiver: formData?.physicalGiftReceiver || "",
                      physicalGiftPhone: formData?.physicalGiftPhone || "",
                      musicUrl: formData?.musicUrl || "",
                      musicTitle: formData?.musicTitle || "",
                      isMusicEnabled: formData?.isMusicEnabled !== false,
                      events: eventsList.map((e, idx) => ({ ...e, id: String(idx) })),
                      loveStories: loveStories.map((s, idx) => ({ ...s, id: String(idx) })),
                      galleries: galleries.map((g, idx) => ({ ...g, id: String(idx) })),
                      gifts: gifts.map((g, idx) => ({ ...g, id: String(idx) })),
                    }}
                    rsvps={[]}
                    guestName="Tamu Undangan"
                    onRsvpSuccess={() => {}}
                    isPreview={true}
                    isMuted={isMuted}
                    setIsMuted={setIsMuted}
                  />
                )}
              </div>

              {/* Elemen audio HTML5 (tersembunyi) */}
              <audio ref={audioRef} loop />
            </div>
          </div>
        </div>
      </div>

      {/* URL publik — caption di bawah perangkat */}
      <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/70 px-3 py-1 text-[10px] font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
        <LinkIcon className="h-3 w-3" aria-hidden="true" />
        <span>ikara.id/{slug}</span>
      </div>
    </div>
  );
}
