"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Calendar, MapPin, Heart, Link as LinkIcon, Music, Gift, CreditCard, Image as ImageIcon, BookOpen, Volume2, VolumeX } from "lucide-react";

/** Map Tema Visual Styling untuk Live Mockup */
const THEME_STYLES = {
  "classic-elegance": {
    bg: "bg-[#F8F6F2] dark:bg-[#191919]",
    accent: "text-[#C8A96A]",
    accentBg: "bg-[#C8A96A]/15 border-[#C8A96A]/30 text-[#C8A96A]",
    cardBg: "bg-white dark:bg-[#222]",
    primaryBtn: "bg-[#C8A96A] text-white",
  },
  "floral-blossom": {
    bg: "bg-rose-50/70 dark:bg-[#1f1618]",
    accent: "text-rose-600",
    accentBg: "bg-rose-100 border-rose-300 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
    cardBg: "bg-white dark:bg-[#251d1f]",
    primaryBtn: "bg-rose-600 text-white",
  },
  "modern-minimalist": {
    bg: "bg-slate-50 dark:bg-[#111827]",
    accent: "text-slate-800 dark:text-slate-200",
    accentBg: "bg-slate-200 border-slate-300 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    cardBg: "bg-white dark:bg-[#1f2937]",
    primaryBtn: "bg-slate-800 text-white",
  },
  "floral-blue": {
    bg: "bg-sky-50/70 dark:bg-[#121d28]",
    accent: "text-sky-600",
    accentBg: "bg-sky-100 border-sky-300 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
    cardBg: "bg-white dark:bg-[#1b2633]",
    primaryBtn: "bg-sky-600 text-white",
  },
};

export function LivePhonePreview({ formData, themes = [] }) {
  const selectedTheme =
    themes.find((t) => t.id === formData?.themeId) || themes[0] || {
      name: "Classic Elegance",
      slug: "classic-elegance",
    };

  const themeKey = selectedTheme.slug || "classic-elegance";
  const themeStyle = THEME_STYLES[themeKey] || THEME_STYLES["classic-elegance"];

  // Reaktif Data Binding
  const title = formData?.title || "Pernikahan Asep & Salsa";
  const slug = formData?.slug || "asep-salsa";

  // Mempelai
  const groomNickname = formData?.groomNickname || formData?.groomName || "Asep";
  const groomFullName = formData?.groomFullName || "Asep Sutrisna Suhada Putra";
  const groomFather = formData?.groomFather || "Bapak Sutrisna";
  const groomMother = formData?.groomMother || "Ibu Suhada";
  const groomPhotoUrl = formData?.groomPhotoUrl;

  const brideNickname = formData?.brideNickname || formData?.brideName || "Salsa";
  const brideFullName = formData?.brideFullName || "Salsa Camelia Azzahra";
  const brideFather = formData?.brideFather || "Bapak Camelia";
  const brideMother = formData?.brideMother || "Ibu Azzahra";
  const bridePhotoUrl = formData?.bridePhotoUrl;

  const coverUrl = formData?.coverUrl;
  const quotes =
    formData?.quotes ||
    "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang. (QS. Ar-Rum: 21)";

  // Acara
  const eventsList =
    formData?.events && formData.events.length > 0
      ? formData.events
      : [
          {
            name: "Akad Nikah",
            date: "2026-08-18",
            startTime: "08:00",
            locationName: "Masjid Agung Sunda Kelapa",
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

  // Love Story
  const loveStories = formData?.loveStories || [
    {
      title: "Menuju Pelaminan",
      date: "2025",
      description: "Setelah melewati banyak cerita bersama, kami memantapkan hati untuk melangkah ke jenjang pernikahan.",
    },
  ];

  // Galeri
  const galleryLayout = formData?.galleryLayout || "CAROUSEL";
  const galleries = formData?.galleries || [];

  // Gifts & Kado Fisik
  const gifts = formData?.gifts || [
    {
      type: "BANK",
      providerName: "BCA",
      accountName: groomFullName,
      accountNumber: "1234567890",
    },
  ];
  const physicalGiftAddress = formData?.physicalGiftAddress;

  // Musik
  const musicTitle = formData?.musicTitle || "Nadhif Basalamah - Bergema Sampai Selamanya";
  const isMusicEnabled = formData?.isMusicEnabled !== false;

  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  // Sync Sumber URL File Musik Latar
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = formData?.musicUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
      audioRef.current.load();
      if (!isMuted && isMusicEnabled) {
        audioRef.current.play().catch((err) => console.log("Autoplay blocked:", err));
      }
    }
  }, [formData?.musicUrl, isMusicEnabled]);

  // Sync Play / Pause status berdasarkan Mute/Unmute State
  useEffect(() => {
    if (!audioRef.current) return;
    if (isMusicEnabled && !isMuted) {
      audioRef.current.play().catch((err) => console.log("Play failed:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isMusicEnabled, isMuted]);

  // State untuk Slideshow Active Slide
  const [activeSlide, setActiveSlide] = useState(0);
  const galleriesCount = galleries.length;

  // Reset slide index jika list berubah atau melebihi kuota
  useEffect(() => {
    if (activeSlide >= galleriesCount) {
      setActiveSlide(0);
    }
  }, [galleriesCount, activeSlide]);

  // Autoplay Slideshow: Berganti otomatis setiap 4 detik
  useEffect(() => {
    if (galleryLayout !== "CAROUSEL" || galleriesCount <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % galleriesCount);
    }, 4000);
    return () => clearInterval(interval);
  }, [galleryLayout, galleriesCount]);

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
        <div
          className={`w-full h-full overflow-y-auto [&::-webkit-scrollbar]:hidden p-5 pt-9 space-y-5 text-foreground font-sans transition-colors duration-300 relative ${themeStyle.bg}`}
        >
          {/* URL Badge Preview */}
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[10px] text-muted-foreground">
            <LinkIcon className="w-2.5 h-2.5" />
            <span>ikara.id/{slug}</span>
          </div>

          {/* Cover Photo Header */}
          <div className="space-y-3 pt-1">
            {coverUrl ? (
              <div className="w-full h-44 rounded-3xl overflow-hidden shadow-md relative">
                <img
                  src={coverUrl}
                  alt="Cover Prewedding"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-3">
                  <span className="text-white font-heading text-sm font-bold truncate">
                    {groomNickname} & {brideNickname}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full h-28 rounded-3xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground text-xs font-light">
                [Foto Sampul Prewedding]
              </div>
            )}

            <div className="space-y-1">
              <span
                className={`text-[10px] uppercase font-bold tracking-widest block ${themeStyle.accent}`}
              >
                WEDDING INVITATION
              </span>
              <h2 className="font-heading text-xl font-bold text-foreground leading-tight px-2">
                {title}
              </h2>
              <p className="text-xs font-semibold text-muted-foreground">
                {groomNickname} <span className={themeStyle.accent}>&amp;</span> {brideNickname}
              </p>
              <p className="text-[11px] text-muted-foreground font-light px-2 italic leading-relaxed">
                &ldquo;{quotes}&rdquo;
              </p>
            </div>
          </div>

          {/* Mempelai Pria & Wanita Cards */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            {/* Pria */}
            <div className={`p-3 rounded-2xl border ${themeStyle.cardBg} space-y-1.5`}>
              <div className="w-12 h-12 mx-auto rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex items-center justify-center text-muted-foreground">
                {groomPhotoUrl ? (
                  <img src={groomPhotoUrl} alt={groomNickname} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px]">Pria</span>
                )}
              </div>
              <p className="font-bold text-foreground truncate">{groomNickname}</p>
              <p className="text-[9px] text-muted-foreground line-clamp-1">{groomFullName}</p>
              {(groomFather || groomMother) && (
                <p className="text-[8px] text-muted-foreground leading-tight">
                  Putra dari {groomFather || "Bapak"} &amp; {groomMother || "Ibu"}
                </p>
              )}
            </div>

            {/* Wanita */}
            <div className={`p-3 rounded-2xl border ${themeStyle.cardBg} space-y-1.5`}>
              <div className="w-12 h-12 mx-auto rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex items-center justify-center text-muted-foreground">
                {bridePhotoUrl ? (
                  <img src={bridePhotoUrl} alt={brideNickname} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px]">Wanita</span>
                )}
              </div>
              <p className="font-bold text-foreground truncate">{brideNickname}</p>
              <p className="text-[9px] text-muted-foreground line-clamp-1">{brideFullName}</p>
              {(brideFather || brideMother) && (
                <p className="text-[8px] text-muted-foreground leading-tight">
                  Putri dari {brideFather || "Bapak"} &amp; {brideMother || "Ibu"}
                </p>
              )}
            </div>
          </div>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-2 opacity-60">
            <div className="h-[1px] w-12 bg-current" />
            <Heart className={`w-3.5 h-3.5 fill-current ${themeStyle.accent}`} />
            <div className="h-[1px] w-12 bg-current" />
          </div>

          {/* Event Preview Cards List */}
          <div className="space-y-2.5">
            {eventsList.map((evt, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border border-border/60 shadow-sm space-y-1.5 text-left transition-colors duration-300 ${themeStyle.cardBg}`}
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Calendar className={`w-3.5 h-3.5 ${themeStyle.accent}`} />
                  <span>{evt?.name || `Acara #${idx + 1}`}</span>
                </div>
                <div className="text-[11px] text-muted-foreground space-y-0.5 pl-5 font-light">
                  <p>📅 {evt?.date || "2026-08-18"}</p>
                  <p>⏰ {evt?.startTime || "08:00"} WIB</p>
                  <div className="flex items-start gap-1 pt-0.5">
                    <MapPin className={`w-3 h-3 shrink-0 mt-0.5 ${themeStyle.accent}`} />
                    <div className="space-y-0.5">
                      <p className="font-medium text-foreground leading-tight">
                        {evt?.locationName || "Masjid Agung Sunda Kelapa"}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-tight">
                        {evt?.address || "Jl. Taman Sunda Kelapa No.16, Menteng, Jakarta Pusat"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Love Story Section Preview */}
          {loveStories.length > 0 && (
            <div className={`p-3 rounded-2xl border ${themeStyle.cardBg} space-y-2 text-left`}>
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Heart className={`w-3.5 h-3.5 ${themeStyle.accent} fill-current`} />
                <span>Love Story</span>
              </div>
              {loveStories.map((story, sIdx) => (
                <div key={sIdx} className="pl-5 border-l border-border/60 space-y-0.5">
                  <p className="text-[10px] font-bold text-foreground">
                    {story.date ? `${story.date} — ` : ""}{story.title}
                  </p>
                  <p className="text-[9px] text-muted-foreground line-clamp-2">{story.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Galeri Foto Preview */}
          {galleries.length > 0 && (
            <div className={`p-3 rounded-2xl border ${themeStyle.cardBg} space-y-2.5 text-left`}>
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <div className="flex items-center gap-1.5">
                  <ImageIcon className={`w-3.5 h-3.5 ${themeStyle.accent}`} />
                  <span>Galeri Foto</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-muted-foreground font-semibold uppercase">
                  {galleryLayout}
                </span>
              </div>

              {galleryLayout === "CAROUSEL" ? (
                /* CAROUSEL MODE (Slideshow with Arrows & Dots) */
                <div className="space-y-2">
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-sm flex items-center justify-center">
                    <img
                      src={galleries[activeSlide]?.mediaUrl || "https://images.unsplash.com/photo-1519741497674-611481863552"}
                      alt="Gallery Slideshow Active"
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                    
                    {/* Carousel Nav Arrows */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlide((prev) => (prev > 0 ? prev - 1 : galleriesCount - 1));
                      }}
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/85 dark:bg-black/80 flex items-center justify-center shadow text-foreground hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
                    >
                      <span className="text-[10px] font-bold">&lt;</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlide((prev) => (prev + 1) % galleriesCount);
                      }}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/85 dark:bg-black/80 flex items-center justify-center shadow text-foreground hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
                    >
                      <span className="text-[10px] font-bold">&gt;</span>
                    </button>
                  </div>

                  {/* Carousel Pagination Dots */}
                  <div className="flex justify-center gap-1.5">
                    {galleries.slice(0, 5).map((_, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveSlide(idx)}
                        className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                          activeSlide === idx
                            ? "bg-[#C8A96A] scale-125"
                            : "bg-zinc-300 dark:bg-zinc-700 opacity-60"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Tiny Thumbnail Strip */}
                  <div className="flex gap-1.5 justify-center overflow-x-auto pb-0.5">
                    {galleries.slice(0, 4).map((g, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveSlide(idx)}
                        className={`w-9 h-9 rounded-lg overflow-hidden border bg-zinc-100 dark:bg-zinc-800 shrink-0 cursor-pointer transition-all ${
                          idx === activeSlide
                            ? "border-[#C8A96A] ring-1 ring-[#C8A96A]"
                            : "border-border/60 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={g.mediaUrl} alt="Thumb" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* MASONRY MODE (Pinterest-style Uneven Height Collage) */
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    {/* Column 1 */}
                    <div className="w-full h-28 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-sm">
                      <img
                        src={galleries[0]?.mediaUrl || "https://images.unsplash.com/photo-1519741497674-611481863552"}
                        alt="Gallery Grid 1"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {galleries[2] && (
                      <div className="w-full h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-sm">
                        <img
                          src={galleries[2].mediaUrl}
                          alt="Gallery Grid 3"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {/* Column 2 */}
                    {galleries[1] && (
                      <div className="w-full h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-sm">
                        <img
                          src={galleries[1].mediaUrl}
                          alt="Gallery Grid 2"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {galleries[3] && (
                      <div className="w-full h-28 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-sm">
                        <img
                          src={galleries[3].mediaUrl}
                          alt="Gallery Grid 4"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Gifts & Bank Info Preview */}
          {gifts.length > 0 && (
            <div className={`p-3 rounded-2xl border ${themeStyle.cardBg} space-y-2 text-left`}>
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <CreditCard className={`w-3.5 h-3.5 ${themeStyle.accent}`} />
                <span>Amplop Digital</span>
              </div>
              {gifts.map((g, gIdx) => (
                <div key={gIdx} className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-[10px] space-y-0.5">
                  <p className="font-bold text-foreground">{g.providerName} — {g.accountNumber}</p>
                  <p className="text-muted-foreground">a.n. {g.accountName}</p>
                </div>
              ))}
            </div>
          )}

          {/* Physical Gift Info Preview */}
          {physicalGiftAddress && (
            <div className={`p-3 rounded-2xl border ${themeStyle.cardBg} space-y-1 text-left text-[10px]`}>
              <div className="flex items-center gap-1 font-bold text-foreground">
                <Gift className={`w-3 h-3 ${themeStyle.accent}`} />
                <span>Kado Fisik</span>
              </div>
              <p className="text-muted-foreground leading-tight">{physicalGiftAddress}</p>
            </div>
          )}

          {/* Floating Music Indicator Bar */}
          {isMusicEnabled && (
            <div className={`p-2 rounded-full border text-[10px] font-semibold flex items-center justify-between gap-2 shadow-sm ${themeStyle.accentBg}`}>
              <div className="flex items-center gap-1.5 truncate">
                <Music className="w-3 h-3 animate-spin shrink-0" />
                <span className="truncate">{musicTitle}</span>
              </div>
            </div>
          )}

          {/* Footer Branding Card */}
          <div className={`p-2.5 rounded-2xl border text-center transition-colors duration-300 ${themeStyle.accentBg}`}>
            <p className="text-[10px] font-semibold">Platform by IKARA</p>
          </div>
        </div>

        {/* Hidden HTML5 Audio Element */}
        <audio ref={audioRef} loop />

        {/* Floating Music Toggle Button (Bottom-Right corner of device frame) */}
        {isMusicEnabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted((prev) => !prev);
            }}
            className="absolute bottom-5 right-5 z-40 w-9 h-9 rounded-full bg-white/95 dark:bg-zinc-800/95 shadow-md border border-zinc-200/50 dark:border-zinc-700/50 flex items-center justify-center text-foreground hover:scale-110 active:scale-95 transition-all cursor-pointer"
            style={{ backdropFilter: "blur(4px)" }}
            title={isMuted ? "Mainkan Musik" : "Senyap Musik"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-zinc-600 dark:text-zinc-300 animate-pulse" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
