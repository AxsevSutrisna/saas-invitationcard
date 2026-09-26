"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Calendar, MapPin, Heart, Link as LinkIcon, Music, Gift, CreditCard, Image as ImageIcon, BookOpen, Volume2, VolumeX } from "lucide-react";
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
        className={`mb-3 px-3.5 py-1 rounded-full border text-[11px] font-semibold flex items-center gap-1.5 shadow-sm transition-all duration-300 ${themeStyle.accentBg}`}
      >
        <Sparkles className="w-3.5 h-3.5 fill-current" />
        <span>Live Preview: {selectedTheme.name}</span>
      </div>

      {/* 3D Photorealistic iPhone 15 Pro Frame */}
      <div className="relative w-[285px] sm:w-[310px] h-[600px] bg-[#1C1C1E] rounded-[44px] border-[10px] border-[#1C1C1E] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col items-center text-center">
        {/* Side Power & Volume Buttons Accent Lines */}
        <div className="absolute -left-[12px] top-24 w-[3px] h-8 bg-zinc-700 rounded-l-md" />
        <div className="absolute -left-[12px] top-36 w-[3px] h-12 bg-zinc-700 rounded-l-md" />
        <div className="absolute -left-[12px] top-52 w-[3px] h-12 bg-zinc-700 rounded-l-md" />
        <div className="absolute -right-[12px] top-32 w-[3px] h-14 bg-zinc-700 rounded-r-md" />

        {/* Dynamic Island Notch Top Pill */}
        <div className="absolute top-2 w-24 h-4 bg-black rounded-full z-40 flex items-center justify-end px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a0f] border border-zinc-800" />
        </div>

        {/* Glass Reflection Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 z-30" />

        {/* Screen Viewport Scrollable Content Area */}
        <div className={`w-full h-full ${isCoverOpen ? "overflow-y-auto" : "overflow-hidden"} [&::-webkit-scrollbar]:hidden relative text-left`}>
          {/* Floating URL Badge Preview on top of phone preview */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/10 dark:bg-white/15 text-[9px] text-zinc-600 dark:text-zinc-300 backdrop-blur-sm">
            <LinkIcon className="w-2.5 h-2.5" />
            <span>ikara.id/{slug}</span>
          </div>

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

        {/* Hidden HTML5 Audio Element */}
        <audio ref={audioRef} loop />
      </div>
    </div>
  );
}
