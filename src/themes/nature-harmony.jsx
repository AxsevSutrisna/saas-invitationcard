"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Copy, Check, Leaf, TreePine, Gift, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { CountdownTimer } from "@/features/theme/components/CountdownTimer";
import { RsvpForm } from "@/features/theme/components/RsvpForm";
import { GuestWishes } from "@/features/theme/components/GuestWishes";

// ─────────── Reusable Scroll-Reveal Wrapper (zoom-in & zoom-out variants) ───────────
function Reveal({ children, delay = 0, direction = "up", className = "" }) {
  const variants = {
    up:       { hidden: { opacity: 0, y: 48 },        visible: { opacity: 1, y: 0 } },
    down:     { hidden: { opacity: 0, y: -48 },       visible: { opacity: 1, y: 0 } },
    left:     { hidden: { opacity: 0, x: -48 },       visible: { opacity: 1, x: 0 } },
    right:    { hidden: { opacity: 0, x: 48 },        visible: { opacity: 1, x: 0 } },
    zoomIn:   { hidden: { opacity: 0, scale: 0.8 },   visible: { opacity: 1, scale: 1 } },
    zoomOut:  { hidden: { opacity: 0, scale: 1.2 },   visible: { opacity: 1, scale: 1 } },
    fade:     { hidden: { opacity: 0 },               visible: { opacity: 1 } },
  };
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants[direction]}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────── Organic Blob Photo Frame (morphs slowly — replaces circle+wreath) ───────────
function BlobFrame({ src, alt = "", className = "w-56 h-56", color = "#4A6B3D", fallbackText = "" }) {
  return (
    <div className={`relative shrink-0 ${className}`}>
      <motion.div
        className="absolute inset-0 overflow-hidden shadow-2xl border-[6px] border-white"
        style={{ borderRadius: "63% 37% 54% 46% / 55% 45% 55% 45%" }}
        animate={{
          borderRadius: [
            "63% 37% 54% 46% / 55% 45% 55% 45%",
            "40% 60% 62% 38% / 48% 45% 55% 52%",
            "63% 37% 54% 46% / 55% 45% 55% 45%",
          ],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        {src ? (
          <motion.img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center font-cormorant text-4xl font-black"
            style={{ background: `${color}15`, color }}
          >
            {fallbackText}
          </div>
        )}
      </motion.div>
      <Leaf className="absolute -bottom-1 -right-1 w-8 h-8 lg:w-9 lg:h-9 rotate-[15deg] drop-shadow" style={{ color, opacity: 0.55 }} />
    </div>
  );
}

// ─────────── Realistic ATM/Bank Card UI ───────────
function BankCard({ gift, copiedId, onCopy }) {
  return (
    <div
      className="relative w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-xl"
      style={{
        background: "linear-gradient(135deg, #4A6B3D 0%, #2F4A28 50%, #1B2E16 100%)",
        minHeight: 180,
      }}
    >
      <div className="absolute inset-0 opacity-10 bg-gradient-to-tr from-white/30 via-transparent to-white/10" />
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border border-white/10" />
      <div className="absolute -top-5 -right-5 w-32 h-32 rounded-full border border-white/10" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full border border-white/10" />

      <div className="relative z-10 p-6 flex flex-col h-full gap-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] text-white/60 tracking-[0.25em] uppercase">Bank Transfer</p>
            <p className="text-white font-bold text-lg tracking-wide">{gift.providerName}</p>
          </div>
          <div className="w-10 h-8 rounded-md bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 shadow-inner flex items-center justify-center opacity-90">
            <div className="w-6 h-5 rounded border border-amber-600/60 grid grid-cols-2 gap-[2px] p-[2px]">
              {[...Array(4)].map((_, i) => <div key={i} className="bg-amber-500/60 rounded-[1px]" />)}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[9px] text-white/50 tracking-[0.2em] uppercase">Nomor Rekening</p>
          <p className="text-white font-mono font-bold text-xl tracking-[0.18em] select-all">
            {(gift.accountNumber || "").replace(/(\d{4})(?=\d)/g, "$1 ")}
          </p>
        </div>

        <div className="flex items-end justify-between pt-2">
          <div className="space-y-0.5">
            <p className="text-[9px] text-white/50 tracking-[0.15em] uppercase">Atas Nama</p>
            <p className="text-white font-semibold text-sm">{gift.accountName}</p>
          </div>

          <button
            type="button"
            onClick={() => onCopy(gift.accountNumber, gift.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[10px] font-semibold transition-all cursor-pointer backdrop-blur-sm"
          >
            {copiedId === gift.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copiedId === gift.id ? "Tersalin!" : "Salin"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────── Organic Divider ───────────
function OrganicDivider({ color = "#4A6B3D" }) {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-3 py-2 w-full max-w-[280px] sm:max-w-md mx-auto" aria-hidden="true">
      <div className="h-px flex-grow max-w-[24px] bg-gradient-to-r from-transparent to-current opacity-40" style={{ color }} />
      <Leaf className="w-4 h-4 shrink-0" style={{ color }} />
      <div className="h-px flex-grow max-w-[48px] bg-gradient-to-r from-current to-transparent opacity-40" style={{ color }} />
      <svg width="10" height="10" viewBox="0 0 24 24" fill={color} opacity="0.4" className="shrink-0">
        <circle cx="12" cy="12" r="5" />
      </svg>
      <div className="h-px flex-grow max-w-[48px] bg-gradient-to-l from-current to-transparent opacity-40" style={{ color }} />
      <Leaf className="w-4 h-4 shrink-0 -scale-x-100" style={{ color }} />
      <div className="h-px flex-grow max-w-[24px] bg-gradient-to-l from-transparent to-current opacity-40" style={{ color }} />
    </div>
  );
}

// ─────────── Section Heading ───────────
function SectionHeading({ title, subtitle, color = "#4A6B3D" }) {
  return (
    <Reveal direction="zoomIn">
      <div className="text-center space-y-3">
        <OrganicDivider color={color} />
        <h2 className="font-heading text-3xl lg:text-4xl font-bold font-cormorant" style={{ color }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-gray-500 font-light max-w-xs lg:max-w-sm mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        <OrganicDivider color={color} />
      </div>
    </Reveal>
  );
}

// ─────────── FALLING LEAVES (ambient, deterministic to avoid SSR hydration mismatch) ───────────
const LEAF_CONFIGS = [
  { xEnd: 40,  dur: 10, del: 0,   spin: 340 },
  { xEnd: -35, dur: 14, del: 1.5, spin: -280 },
  { xEnd: 30,  dur: 12, del: 3,   spin: 300 },
  { xEnd: -40, dur: 16, del: 0.5, spin: -320 },
  { xEnd: 20,  dur: 11, del: 5,   spin: 260 },
  { xEnd: -25, dur: 15, del: 2,   spin: -300 },
  { xEnd: 38,  dur: 13, del: 4,   spin: 320 },
  { xEnd: -30, dur: 10, del: 6.5, spin: -260 },
  { xEnd: 45,  dur: 17, del: 1,   spin: 300 },
  { xEnd: -20, dur: 12, del: 7,   spin: -340 },
];

const LEAF_POSITIONS = [
  { left: "3%",  top: "-8px",  fontSize: "16px" },
  { left: "13%", top: "-16px", fontSize: "20px" },
  { left: "23%", top: "-5px",  fontSize: "14px" },
  { left: "33%", top: "-20px", fontSize: "18px" },
  { left: "43%", top: "-10px", fontSize: "15px" },
  { left: "54%", top: "-24px", fontSize: "22px" },
  { left: "64%", top: "-7px",  fontSize: "14px" },
  { left: "74%", top: "-18px", fontSize: "19px" },
  { left: "84%", top: "-3px",  fontSize: "16px" },
  { left: "93%", top: "-14px", fontSize: "17px" },
];

function FallingLeaf({ style, xEnd = 40, dur = 10, del = 0, spin = 300 }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={style}
      animate={{
        y: ["0vh", "110vh"],
        x: [0, xEnd],
        rotate: [0, spin],
        scale: [0.8, 1.1, 0.8],
        opacity: [0, 0.4, 0],
      }}
      transition={{ duration: dur, repeat: Infinity, delay: del, ease: "linear" }}
    >
      🍃
    </motion.div>
  );
}

// ════════════════════════════════════════════
//              MAIN COMPONENT
// ════════════════════════════════════════════
export function NatureHarmonyTheme({ invitation, rsvps, guestName, onRsvpSuccess, isPreview, guest, isMuted, setIsMuted }) {
  const [copiedId, setCopiedId] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const FOREST = "#4A6B3D";
  const SAGE   = "#8FA980";
  const CREAM  = "#F7F5EE";

  const groom     = invitation?.groomNickname || "Pria";
  const bride     = invitation?.brideNickname  || "Wanita";
  const groomFull = invitation?.groomFullName  || "Nama Pria Lengkap";
  const brideFull = invitation?.brideFullName  || "Nama Wanita Lengkap";
  const galleries = invitation?.galleries      || [];
  const layout    = invitation?.galleryLayout  || "CAROUSEL";

  // ── Carousel auto-play ──
  useEffect(() => {
    if (layout !== "CAROUSEL" || galleries.length <= 1) return;
    const interval = setInterval(
      () => setCarouselIndex((p) => (p + 1) % galleries.length),
      4500
    );
    return () => clearInterval(interval);
  }, [layout, galleries.length]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div
      className="w-full text-[#2E3B27] font-sans overflow-x-hidden min-h-screen relative pb-16 selection:bg-[#4A6B3D] selection:text-white @container"
      style={{ background: `linear-gradient(180deg, ${CREAM} 0%, #FBFAF6 60%, ${CREAM} 100%)` }}
    >
      {/* ── AMBIENT FALLING LEAVES (fullscreen) ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {LEAF_POSITIONS.map((p, i) => (
          <FallingLeaf
            key={i}
            style={{ left: p.left, top: p.top, fontSize: p.fontSize }}
            xEnd={LEAF_CONFIGS[i].xEnd}
            dur={LEAF_CONFIGS[i].dur}
            del={LEAF_CONFIGS[i].del}
            spin={LEAF_CONFIGS[i].spin}
          />
        ))}
      </div>

      {/* ── MUSIC TOGGLE BUTTON ── */}
      {invitation?.isMusicEnabled && (
        <motion.button
          type="button"
          onClick={() => setIsMuted((p) => !p)}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white border-2 shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
          style={{ borderColor: FOREST }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          title={isMuted ? "Mainkan Musik" : "Senyap"}
        >
          {isMuted
            ? <VolumeX className="w-5 h-5" style={{ color: FOREST }} />
            : <Volume2 className="w-5 h-5 animate-pulse" style={{ color: FOREST }} />
          }
        </motion.button>
      )}

      {/* ════════ 1. HERO SECTION — asymmetric split (stacked on mobile, side-by-side on desktop) ════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden px-6 md:px-10 lg:px-16 pt-28 pb-20">
        {/* Slow ambient zoom-in/zoom-out backdrop shapes */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <motion.svg
            className="absolute top-0 left-0 w-56 lg:w-72 opacity-10"
            viewBox="0 0 200 200"
            fill={FOREST}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          >
            <circle cx="100" cy="100" r="80" />
          </motion.svg>
          <motion.svg
            className="absolute bottom-0 right-0 w-56 lg:w-72 opacity-10"
            viewBox="0 0 200 200"
            fill={SAGE}
            animate={{ scale: [1.15, 1, 1.15] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          >
            <circle cx="100" cy="100" r="80" />
          </motion.svg>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center">
          {/* Left: typography block — centered on mobile, left-aligned on desktop */}
          <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
            <Reveal direction="down">
              <p className="text-[10px] tracking-[0.4em] font-bold uppercase" style={{ color: FOREST }}>
                ✦ THE WEDDING CELEBRATION ✦
              </p>
            </Reveal>

            <Reveal direction="zoomIn" delay={0.15}>
              <h1
                className="font-heading font-extrabold leading-[0.95] font-cormorant"
                style={{ color: FOREST, fontSize: "clamp(2.4rem, 4vw + 1.2rem, 5.5rem)" }}
              >
                {groom}
                <span className="block font-greatvibes text-4xl sm:text-5xl lg:text-6xl py-2 lg:py-3 opacity-75">&amp;</span>
                {bride}
              </h1>
            </Reveal>

            {invitation?.openingText && (
              <Reveal direction="up" delay={0.25}>
                <p className="text-xs lg:text-sm text-gray-500 font-light leading-relaxed max-w-sm lg:max-w-md mx-auto lg:mx-0">
                  {invitation.openingText}
                </p>
              </Reveal>
            )}

            {invitation?.events?.[0]?.date && (
              <Reveal direction="up" delay={0.35}>
                <div className="py-2 flex justify-center lg:justify-start">
                  <CountdownTimer targetDate={invitation.events[0].date} />
                </div>
              </Reveal>
            )}
          </div>

          {/* Right: organic blob photo frame — bigger stage on desktop */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <Reveal direction="zoomOut" delay={0.3}>
              <BlobFrame
                src={invitation?.coverUrl}
                alt="Foto Cover Prewedding"
                fallbackText={`${groom[0]}${bride[0]}`}
                color={FOREST}
                className="w-56 h-56 sm:w-64 sm:h-64 lg:w-[24rem] lg:h-[24rem]"
              />
            </Reveal>
          </div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-0.5 h-10 rounded-full opacity-30" style={{ background: FOREST }} />
          <div className="text-[9px] tracking-[0.25em] opacity-40 font-semibold uppercase" style={{ color: FOREST }}>Scroll</div>
        </motion.div>
      </section>

      {/* ════════ 2. QUOTES — editorial row (stacked mobile, side-by-side desktop) ════════ */}
      <section className="py-20 md:py-24 px-6 md:px-10 lg:px-16">
        <div className="max-w-xl lg:max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10 text-center lg:text-left">
            <Reveal direction="zoomIn" className="shrink-0">
              <TreePine className="w-10 h-10 lg:w-14 lg:h-14" style={{ color: FOREST }} />
            </Reveal>
            <div className="space-y-4">
              <Reveal direction="up" delay={0.1}>
                <blockquote className="font-heading text-2xl lg:text-3xl font-medium font-cormorant italic leading-relaxed" style={{ color: FOREST }}>
                  &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya...&rdquo;
                </blockquote>
              </Reveal>
              <Reveal direction="up" delay={0.2}>
                <p className="text-xs text-gray-400 font-light tracking-wider">
                  {invitation?.quotes || "QS. Ar-Rum: 21"}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ 3. COUPLES SECTION — open editorial layout, 3-col with divider on desktop ════════ */}
      <section className="py-20 md:py-24 px-6 md:px-10 lg:px-16" style={{ background: "linear-gradient(180deg, #FBFAF6 0%, #F7F5EE 100%)" }}>
        <div className="max-w-xl lg:max-w-5xl mx-auto space-y-14">
          <SectionHeading title="Mempelai Pengantin" subtitle="Dengan penuh rasa syukur, kami memperkenalkan diri" color={FOREST} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-10 lg:gap-10 items-center">
            {/* Groom */}
            <Reveal direction="zoomOut">
              <div className="flex flex-col items-center gap-4 text-center">
                <BlobFrame src={invitation?.groomPhotoUrl} alt={groom} fallbackText={groom[0]} color={FOREST} className="w-32 h-32 lg:w-40 lg:h-40" />
                <div className="space-y-1">
                  <p className="text-[10px] tracking-[0.25em] font-bold uppercase opacity-60" style={{ color: FOREST }}>The Groom</p>
                  <h3 className="font-cormorant text-xl lg:text-2xl font-bold leading-tight" style={{ color: FOREST }}>{groomFull}</h3>
                  <p className="text-[11px] text-gray-500 font-light leading-relaxed max-w-[220px]">
                    Putra dari Bapak {invitation?.groomFather || "—"} &amp; Ibu {invitation?.groomMother || "—"}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Divider — horizontal on mobile, vertical on desktop */}
            <Reveal direction="zoomIn" delay={0.1}>
              <div className="flex lg:flex-col items-center justify-center gap-3 lg:gap-4">
                <div className="h-px w-14 lg:w-px lg:h-28 opacity-20" style={{ background: FOREST }} />
                <span className="font-greatvibes text-4xl lg:text-5xl opacity-50" style={{ color: FOREST }}>&amp;</span>
                <div className="h-px w-14 lg:w-px lg:h-28 opacity-20" style={{ background: FOREST }} />
              </div>
            </Reveal>

            {/* Bride */}
            <Reveal direction="zoomOut">
              <div className="flex flex-col items-center gap-4 text-center">
                <BlobFrame src={invitation?.bridePhotoUrl} alt={bride} fallbackText={bride[0]} color={FOREST} className="w-32 h-32 lg:w-40 lg:h-40" />
                <div className="space-y-1">
                  <p className="text-[10px] tracking-[0.25em] font-bold uppercase opacity-60" style={{ color: FOREST }}>The Bride</p>
                  <h3 className="font-cormorant text-xl lg:text-2xl font-bold leading-tight" style={{ color: FOREST }}>{brideFull}</h3>
                  <p className="text-[11px] text-gray-500 font-light leading-relaxed max-w-[220px]">
                    Putri dari Bapak {invitation?.brideFather || "—"} &amp; Ibu {invitation?.brideMother || "—"}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════ 4. EVENTS SECTION — grid 2 kolom di desktop ════════ */}
      <section className="py-20 md:py-24 px-6 md:px-10 lg:px-16">
        <div className="max-w-xl lg:max-w-5xl mx-auto space-y-10">
          <SectionHeading title="Jadwal Akad & Resepsi" subtitle="Dengan segala kerendahan hati, kami mengundang Bapak/Ibu untuk hadir" color={FOREST} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {invitation?.events?.map((evt, i) => (
              <Reveal key={evt.id} direction={i % 2 === 0 ? "zoomIn" : "zoomOut"} delay={i * 0.12}>
                <div className="rounded-3xl bg-white border shadow-sm overflow-hidden h-full" style={{ borderColor: `${FOREST}25` }}>
                  <div className="px-6 py-4 text-white text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${FOREST} 0%, #2F4A28 100%)` }}>
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-24 h-24 rounded-full border-2 border-white -translate-x-6 -translate-y-6" />
                    </div>
                    <p className="text-[10px] tracking-[0.3em] uppercase font-semibold opacity-80">Acara</p>
                    <h3 className="font-cormorant text-2xl font-bold">{evt.name}</h3>
                  </div>

                  <div className="p-6 grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <p className="text-[9px] tracking-[0.2em] font-bold uppercase text-gray-400">Tanggal</p>
                      <p className="font-semibold text-gray-800 leading-snug">
                        {new Date(evt.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] tracking-[0.2em] font-bold uppercase text-gray-400">Waktu</p>
                      <p className="font-semibold text-gray-800">{evt.startTime} {evt.endTime ? `– ${evt.endTime}` : "WIB"}</p>
                    </div>
                    <div className="col-span-2 space-y-1 pt-3 border-t" style={{ borderColor: `${FOREST}20` }}>
                      <p className="text-[9px] tracking-[0.2em] font-bold uppercase text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" style={{ color: FOREST }} /> Lokasi
                      </p>
                      <p className="font-bold text-gray-800">{evt.locationName}</p>
                      <p className="text-gray-500 font-light leading-relaxed">{evt.address}</p>
                    </div>
                  </div>

                  {evt.mapUrl && (
                    <div className="px-6 pb-6">
                      <a
                        href={evt.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full h-10 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-bold text-white transition-opacity hover:opacity-90 cursor-pointer"
                        style={{ background: `linear-gradient(135deg, ${FOREST} 0%, #2F4A28 100%)` }}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        Buka Google Maps
                      </a>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ 5. LOVE STORY ════════ */}
      {invitation?.loveStories?.length > 0 && (
        <section className="py-20 md:py-24 px-6 md:px-10 lg:px-16" style={{ background: "linear-gradient(180deg, #FBFAF6 0%, #F7F5EE 100%)" }}>
          <div className="max-w-xl lg:max-w-2xl mx-auto space-y-10">
            <SectionHeading title="Perjalanan Cinta" color={FOREST} />

            <div className="relative pl-8 border-l-2 space-y-10" style={{ borderColor: `${FOREST}30` }}>
              {invitation.loveStories.map((story, i) => (
                <Reveal key={story.id} direction={i % 2 === 0 ? "left" : "up"} delay={i * 0.1}>
                  <div className="relative">
                    <div className="absolute -left-[39px] top-2 w-5 h-5 rounded-full border-4 border-white shadow-md" style={{ background: FOREST }} />
                    <div className="space-y-2 bg-white/70 backdrop-blur-sm rounded-2xl p-5 border shadow-sm" style={{ borderColor: `${FOREST}20` }}>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: FOREST }}>{story.date}</p>
                      <h4 className="font-cormorant text-xl font-bold text-gray-800">{story.title}</h4>
                      <p className="text-xs text-gray-500 font-light leading-relaxed">{story.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════ 6. PHOTO GALLERY — masonry 3-kolom di desktop, carousel tetap fokus di HP ════════ */}
      {galleries.length > 0 && (
        <section className="py-20 md:py-24 px-6 md:px-10 lg:px-16">
          <div className="max-w-xl lg:max-w-4xl mx-auto space-y-8">
            <SectionHeading title="Galeri Momen" subtitle="Setiap foto menyimpan seribu cerita cinta" color={FOREST} />

            {layout === "CAROUSEL" ? (
              <Reveal direction="zoomIn">
                <div className="space-y-4 max-w-sm lg:max-w-md mx-auto">
                  <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden border shadow-xl" style={{ borderColor: `${FOREST}30` }}>
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={carouselIndex}
                        src={galleries[carouselIndex]?.mediaUrl}
                        alt={`Slide ${carouselIndex + 1}`}
                        className="w-full h-full object-cover absolute inset-0"
                        initial={{ opacity: 0, scale: carouselIndex % 2 === 0 ? 1.15 : 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: carouselIndex % 2 === 0 ? 0.95 : 1.1 }}
                        transition={{ duration: 0.7, ease: "easeInOut" }}
                      />
                    </AnimatePresence>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {galleries.length > 1 && (
                      <>
                        <button type="button" onClick={() => setCarouselIndex((p) => (p - 1 + galleries.length) % galleries.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white transition-all shadow-md">
                          <ChevronLeft className="w-5 h-5" style={{ color: FOREST }} />
                        </button>
                        <button type="button" onClick={() => setCarouselIndex((p) => (p + 1) % galleries.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white transition-all shadow-md">
                          <ChevronRight className="w-5 h-5" style={{ color: FOREST }} />
                        </button>
                      </>
                    )}

                    <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      {carouselIndex + 1} / {galleries.length}
                    </div>
                  </div>

                  <div className="flex justify-center gap-1.5">
                    {galleries.map((_, i) => (
                      <button key={i} type="button" onClick={() => setCarouselIndex(i)}
                        className={`rounded-full transition-all duration-300 cursor-pointer ${carouselIndex === i ? "w-6 h-2" : "w-2 h-2"}`}
                        style={{ background: carouselIndex === i ? FOREST : `${FOREST}40` }}
                      />
                    ))}
                  </div>
                </div>
              </Reveal>
            ) : (
              <div className="columns-2 lg:columns-3 gap-3 space-y-3">
                {galleries.map((gal, i) => (
                  <Reveal key={gal.id} direction={i % 2 === 0 ? "zoomIn" : "zoomOut"} delay={i * 0.07}>
                    <div className="break-inside-avoid rounded-2xl overflow-hidden shadow-sm border" style={{ borderColor: `${FOREST}20` }}>
                      <img src={gal.mediaUrl} alt="Kolase" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ════════ 7. DIGITAL GIFTS — grid 2 kolom di desktop ════════ */}
      {invitation?.gifts?.length > 0 && (
        <section className="py-20 md:py-24 px-6 md:px-10 lg:px-16" style={{ background: "linear-gradient(180deg, #FBFAF6 0%, #F7F5EE 100%)" }}>
          <div className="max-w-xl lg:max-w-4xl mx-auto space-y-10">
            <SectionHeading title="Amplop Digital" subtitle="Bagi Anda yang berkenan memberikan tanda kasih untuk pengantin baru:" color={FOREST} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-sm lg:max-w-none mx-auto">
              {invitation.gifts.map((gft, i) => (
                <Reveal key={gft.id} direction="up" delay={i * 0.15}>
                  {gft.type === "PHYSICAL" ? (
                    <div className="p-6 rounded-3xl bg-white border shadow-sm text-left space-y-3 h-full" style={{ borderColor: `${FOREST}25` }}>
                      <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5" style={{ color: FOREST }} />
                        <h3 className="font-semibold text-gray-800">Kirim Kado Fisik</h3>
                      </div>
                      <p className="font-bold text-gray-800">{invitation?.physicalGiftReceiver}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{invitation?.physicalGiftAddress}</p>
                      {invitation?.physicalGiftPhone && (
                        <p className="text-xs text-gray-400">📞 {invitation.physicalGiftPhone}</p>
                      )}
                    </div>
                  ) : (
                    <BankCard gift={gft} copiedId={copiedId} onCopy={handleCopy} />
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════ 8. RSVP & UCAPAN — 2 kolom di desktop (form kiri, ucapan kanan) ════════ */}
      <section className="py-20 md:py-24 px-6 md:px-10 lg:px-16">
        <div className="max-w-xl lg:max-w-5xl mx-auto space-y-10">
          <SectionHeading title="RSVP & Buku Ucapan" subtitle="Berikan konfirmasi kehadiran Anda beserta doa terbaik:" color={FOREST} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 lg:items-start">
            <Reveal direction="up">
              <div className="p-6 rounded-3xl bg-white border shadow-sm" style={{ borderColor: `${FOREST}25` }}>
                <RsvpForm invitationId={invitation.id} defaultGuestName={guestName} onRsvpSuccess={onRsvpSuccess} guest={guest} />
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.1}>
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 pl-1">
                  Doa &amp; Restu Tamu ({rsvps?.length || 0})
                </h3>
                <GuestWishes rsvps={rsvps} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════ 9. FOOTER ════════ */}
      <footer className="py-16 text-center space-y-6 border-t" style={{ borderColor: `${FOREST}20`, background: `${FOREST}08` }}>
        <Reveal direction="zoomIn">
          <Leaf className="w-10 h-10 mx-auto" style={{ color: FOREST, opacity: 0.6 }} />
        </Reveal>
        <Reveal direction="up" delay={0.1}>
          <div className="space-y-2">
            <p className="text-[10px] text-gray-400 font-light tracking-wider uppercase">Merupakan kehormatan bagi kami</p>
            <p className="font-cormorant text-xl font-bold" style={{ color: FOREST }}>Kami Yang Berbahagia,</p>
            <h4 className="font-greatvibes text-3xl" style={{ color: FOREST }}>{groom} &amp; {bride}</h4>
          </div>
        </Reveal>
        <Reveal direction="up" delay={0.2}>
          <div className="text-[9px] text-gray-400 tracking-[0.3em] font-semibold uppercase flex items-center justify-center gap-2">
            <span>CREATED WITH ♥ BY</span>
            <span className="font-cormorant text-sm font-bold" style={{ color: FOREST }}>IKARA</span>
          </div>
        </Reveal>
      </footer>
    </div>
  );
}
