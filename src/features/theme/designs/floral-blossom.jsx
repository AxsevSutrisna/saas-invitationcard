"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Copy, Check, Heart, Gift, MessageSquare, ChevronLeft, ChevronRight, Music, Volume2, VolumeX } from "lucide-react";
import { CountdownTimer } from "@/features/theme/components/CountdownTimer";
import { RsvpForm } from "@/features/theme/components/RsvpForm";
import { GuestWishes } from "@/features/theme/components/GuestWishes";

// ─────────── Reusable Scroll-Reveal Wrapper ───────────
function Reveal({ children, delay = 0, direction = "up", className = "" }) {
  const variants = {
    up:    { hidden: { opacity: 0, y: 48 },   visible: { opacity: 1, y: 0 } },
    down:  { hidden: { opacity: 0, y: -48 },  visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -48 },  visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 48 },   visible: { opacity: 1, x: 0 } },
    zoom:  { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } },
    fade:  { hidden: { opacity: 0 },           visible: { opacity: 1 } },
  };
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants[direction]}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────── Floral Wreath SVG ornament (Bunga Melingkar) ───────────
function FloralWreath({ color = "#B76E79", size = 160 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Central photo circle */}
      <circle cx="80" cy="80" r="52" fill="white" stroke={color} strokeWidth="2.5" strokeDasharray="6 4" />
      {/* Petal cluster top */}
      <ellipse cx="80" cy="18" rx="8" ry="13" fill={color} opacity="0.25" transform="rotate(0 80 80)" />
      <ellipse cx="80" cy="18" rx="6" ry="10" fill={color} opacity="0.45" />
      {/* Rotate 8 petal clusters */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <g key={i} style={{ transformOrigin: "80px 80px", transform: `rotate(${angle}deg)` }}>
          <ellipse cx="80" cy="22" rx="6" ry="10" fill={color} opacity="0.22" />
          <circle cx="80" cy="14" r="4" fill={color} opacity="0.35" />
        </g>
      ))}
      {/* Leaves (4 diagonal) */}
      {[30, 120, 210, 300].map((angle, i) => (
        <g key={`leaf-${i}`} style={{ transformOrigin: "80px 80px", transform: `rotate(${angle}deg)` }}>
          <ellipse cx="80" cy="16" rx="4" ry="8" fill="#86efac" opacity="0.5" />
        </g>
      ))}
      {/* Small accent dots */}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 80 + 58 * Math.cos(rad);
        const cy = 80 + 58 * Math.sin(rad);
        return <circle key={`dot-${i}`} cx={cx} cy={cy} r="3" fill={color} opacity="0.4" />;
      })}
    </svg>
  );
}

// ─────────── Realistic ATM/Bank Card UI ───────────
function BankCard({ gift, copiedId, onCopy }) {
  const isRose = gift.providerName?.toLowerCase().includes("bca") || gift.providerName?.toLowerCase().includes("bni");
  return (
    <div
      className="relative w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-xl"
      style={{
        background: isRose
          ? "linear-gradient(135deg, #B76E79 0%, #8B3E4A 50%, #5C1F2B 100%)"
          : "linear-gradient(135deg, #2d3f5e 0%, #1a2a48 50%, #0d1a30 100%)",
        minHeight: 180,
      }}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 opacity-10 bg-gradient-to-tr from-white/30 via-transparent to-white/10" />

      {/* Pattern circles */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border border-white/10" />
      <div className="absolute -top-5 -right-5 w-32 h-32 rounded-full border border-white/10" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full border border-white/10" />

      <div className="relative z-10 p-6 flex flex-col h-full gap-4">
        {/* Top row: bank name + chip */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] text-white/60 tracking-[0.25em] uppercase">Bank Transfer</p>
            <p className="text-white font-bold text-lg tracking-wide">{gift.providerName}</p>
          </div>
          {/* Chip */}
          <div className="w-10 h-8 rounded-md bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 shadow-inner flex items-center justify-center opacity-90">
            <div className="w-6 h-5 rounded border border-amber-600/60 grid grid-cols-2 gap-[2px] p-[2px]">
              {[...Array(4)].map((_, i) => <div key={i} className="bg-amber-500/60 rounded-[1px]" />)}
            </div>
          </div>
        </div>

        {/* Account number */}
        <div className="space-y-1">
          <p className="text-[9px] text-white/50 tracking-[0.2em] uppercase">Nomor Rekening</p>
          <p className="text-white font-mono font-bold text-xl tracking-[0.18em] select-all">
            {(gift.accountNumber || "").replace(/(\d{4})(?=\d)/g, "$1 ")}
          </p>
        </div>

        {/* Bottom row: name + copy button */}
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

// ─────────── Ornate Divider ───────────
function OrnateDivider({ color = "#B76E79" }) {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-3 py-2 w-full max-w-[280px] sm:max-w-md mx-auto" aria-hidden="true">
      <div className="h-px flex-grow max-w-[24px] bg-gradient-to-r from-transparent to-current opacity-40" style={{ color }} />
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path d="M12 2C12 2 9 8 2 10C9 12 12 22 12 22C12 22 15 12 22 10C15 8 12 2 12 2Z" fill={color} opacity="0.6" />
      </svg>
      <div className="h-px flex-grow max-w-[48px] bg-gradient-to-r from-current to-transparent opacity-40" style={{ color }} />
      <svg width="10" height="10" viewBox="0 0 24 24" fill={color} opacity="0.4" className="shrink-0">
        <circle cx="12" cy="12" r="5" />
      </svg>
      <div className="h-px flex-grow max-w-[48px] bg-gradient-to-l from-current to-transparent opacity-40" style={{ color }} />
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path d="M12 2C12 2 9 8 2 10C9 12 12 22 12 22C12 22 15 12 22 10C15 8 12 2 12 2Z" fill={color} opacity="0.6" />
      </svg>
      <div className="h-px flex-grow max-w-[24px] bg-gradient-to-l from-transparent to-current opacity-40" style={{ color }} />
    </div>
  );
}

// ─────────── Section Heading ───────────
function SectionHeading({ title, subtitle, color = "#B76E79" }) {
  return (
    <Reveal direction="up">
      <div className="text-center space-y-3">
        <OrnateDivider color={color} />
        <h2
          className="font-heading text-4xl font-bold font-cormorant"
          style={{ color }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-gray-500 font-light max-w-xs mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        <OrnateDivider color={color} />
      </div>
    </Reveal>
  );
}

// ─────────── FALLING PETALS ───────────
// Fixed animation values to avoid SSR hydration mismatch
const PETAL_CONFIGS = [
  { xEnd: 40,  dur: 9,  del: 0   },
  { xEnd: -35, dur: 13, del: 1.5 },
  { xEnd: 30,  dur: 11, del: 3   },
  { xEnd: -40, dur: 15, del: 0.5 },
  { xEnd: 20,  dur: 10, del: 5   },
  { xEnd: -25, dur: 14, del: 2   },
  { xEnd: 38,  dur: 12, del: 4   },
  { xEnd: -30, dur: 9,  del: 6.5 },
  { xEnd: 45,  dur: 16, del: 1   },
  { xEnd: -20, dur: 11, del: 7   },
  { xEnd: 28,  dur: 13, del: 3.5 },
  { xEnd: -42, dur: 10, del: 8   },
];

function FallingPetal({ style, xEnd = 40, dur = 10, del = 0 }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none text-[#B76E79]"
      style={style}
      animate={{
        y: ["0vh", "110vh"],
        x: [0, xEnd],
        rotate: [0, 360],
        opacity: [0, 0.35, 0],
      }}
      transition={{
        duration: dur,
        repeat: Infinity,
        delay: del,
        ease: "linear",
      }}
    >
      🌸
    </motion.div>
  );
}

// ════════════════════════════════════════════
//              MAIN COMPONENT
// ════════════════════════════════════════════
export function FloralBlossomTheme({ invitation, rsvps, guestName, onRsvpSuccess, isPreview, guest, isMuted, setIsMuted }) {
  const [copiedId, setCopiedId] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const ROSE   = "#B76E79";
  const ROSE_L = "#FFF3F5";

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

  // Fixed petal positions (deterministic to avoid SSR hydration mismatch)
  const PETAL_POSITIONS = [
    { left: "4%",  top: "-8px",  fontSize: "13px" },
    { left: "12%", top: "-15px", fontSize: "18px" },
    { left: "21%", top: "-5px",  fontSize: "11px" },
    { left: "30%", top: "-20px", fontSize: "16px" },
    { left: "38%", top: "-10px", fontSize: "14px" },
    { left: "47%", top: "-25px", fontSize: "20px" },
    { left: "55%", top: "-7px",  fontSize: "12px" },
    { left: "63%", top: "-18px", fontSize: "17px" },
    { left: "71%", top: "-3px",  fontSize: "15px" },
    { left: "79%", top: "-22px", fontSize: "19px" },
    { left: "87%", top: "-12px", fontSize: "13px" },
    { left: "95%", top: "-9px",  fontSize: "16px" },
  ];

  return (
    <div
      className="w-full text-[#3A2A2D] font-sans overflow-x-hidden min-h-screen relative pb-16 selection:bg-[#B76E79] selection:text-white @container"
      style={{ background: "linear-gradient(180deg, #FFF3F5 0%, #FFF8F9 60%, #FFF3F5 100%)" }}
    >
      {/* ── AMBIENT FALLING PETALS (fullscreen) ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {PETAL_POSITIONS.map((p, i) => (
          <FallingPetal key={i} style={{ left: p.left, top: p.top, fontSize: p.fontSize }} xEnd={PETAL_CONFIGS[i].xEnd} dur={PETAL_CONFIGS[i].dur} del={PETAL_CONFIGS[i].del} />
        ))}
      </div>

      {/* ── MUSIC TOGGLE BUTTON ── */}
      {invitation?.isMusicEnabled && (
        <motion.button
          type="button"
          onClick={() => setIsMuted((p) => !p)}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white border-2 shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
          style={{ borderColor: ROSE }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          title={isMuted ? "Mainkan Musik" : "Senyap"}
        >
          {isMuted
            ? <VolumeX className="w-5 h-5" style={{ color: ROSE }} />
            : <Volume2 className="w-5 h-5 animate-pulse" style={{ color: ROSE }} />
          }
        </motion.button>
      )}

      {/* ════════ 1. HERO SECTION ════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-8 pb-16 overflow-hidden">
        {/* Hero Background SVG Roses */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <svg className="absolute top-0 left-0 w-48 opacity-10" viewBox="0 0 200 200" fill={ROSE}>
            <circle cx="100" cy="100" r="80" />
            <circle cx="100" cy="30" r="25" />
            <circle cx="160" cy="75" r="20" />
            <circle cx="155" cy="150" r="22" />
            <circle cx="100" cy="185" r="20" />
            <circle cx="45" cy="155" r="22" />
            <circle cx="35" cy="78" r="20" />
          </svg>
          <svg className="absolute bottom-0 right-0 w-48 opacity-10 rotate-180" viewBox="0 0 200 200" fill={ROSE}>
            <circle cx="100" cy="100" r="80" />
            <circle cx="100" cy="30" r="25" />
          </svg>
        </div>

        <div className="relative z-10 space-y-6 max-w-xl">
          {/* Pre-title */}
          <Reveal direction="down">
            <p className="text-[10px] tracking-[0.4em] font-bold uppercase" style={{ color: ROSE }}>
              ✦ THE WEDDING CELEBRATION ✦
            </p>
          </Reveal>

          {/* Names */}
          <Reveal direction="zoom" delay={0.15}>
            <h1
              className="font-heading font-extrabold leading-tight font-cormorant"
              style={{ color: ROSE, fontSize: "clamp(2.2rem,11cqw,4.2rem)" }}
            >
              {groom}
              <span className="block font-greatvibes text-4xl sm:text-5xl py-2 opacity-75">&amp;</span>
              {bride}
            </h1>
          </Reveal>

          {/* Opening text */}
          {invitation?.openingText && (
            <Reveal direction="up" delay={0.25}>
              <p className="text-xs text-gray-500 font-light leading-relaxed max-w-sm mx-auto">
                {invitation.openingText}
              </p>
            </Reveal>
          )}

          {/* Countdown */}
          {invitation?.events?.[0]?.date && (
            <Reveal direction="up" delay={0.35}>
              <div className="py-2">
                <CountdownTimer targetDate={invitation.events[0].date} />
              </div>
            </Reveal>
          )}

          {/* Cover Photo with Floral Wreath Frame */}
          {invitation?.coverUrl && (
            <Reveal direction="zoom" delay={0.45}>
              <div className="relative w-52 h-52 mx-auto mt-4">
                <FloralWreath color={ROSE} size={208} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={invitation.coverUrl}
                    alt="Foto Cover Prewedding"
                    className="w-[104px] h-[104px] rounded-full object-cover shadow-xl border-4 border-white"
                    style={{ boxShadow: `0 0 0 4px ${ROSE}30` }}
                  />
                </div>
              </div>
            </Reveal>
          )}
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-0.5 h-10 rounded-full opacity-30" style={{ background: ROSE }} />
          <div className="text-[9px] tracking-[0.25em] opacity-40 font-semibold uppercase" style={{ color: ROSE }}>Scroll</div>
        </motion.div>
      </section>

      {/* ════════ 2. QUR'AN QUOTES ════════ */}
      <section className="py-20 px-6 max-w-2xl mx-auto text-center space-y-6">
        <Reveal direction="zoom">
          <Heart className="w-10 h-10 mx-auto animate-pulse" style={{ color: ROSE, fill: `${ROSE}30` }} />
        </Reveal>
        <Reveal direction="up" delay={0.1}>
          <blockquote
            className="font-heading text-2xl font-medium font-cormorant italic leading-relaxed"
            style={{ color: ROSE }}
          >
            &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya...&rdquo;
          </blockquote>
        </Reveal>
        <Reveal direction="up" delay={0.2}>
          <p className="text-xs text-gray-400 font-light tracking-wider">
            {invitation?.quotes || "QS. Ar-Rum: 21"}
          </p>
        </Reveal>
      </section>

      {/* ════════ 3. COUPLES SECTION ════════ */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(180deg, #FFF8F9 0%, #FFF3F5 100%)" }}>
        <div className="max-w-xl mx-auto space-y-12">
          <SectionHeading
            title="Mempelai Pengantin"
            subtitle="Dengan penuh rasa syukur, kami memperkenalkan diri"
            color={ROSE}
          />

          {/* Groom */}
          <Reveal direction="up">
            <div className="flex flex-col items-center gap-4 p-5 rounded-3xl bg-white/80 backdrop-blur-sm border border-[#B76E79]/15 shadow-sm text-center">
              {/* Wreath photo */}
              <div className="relative w-28 h-28 shrink-0">
                <FloralWreath color={ROSE} size={112} />
                <div className="absolute inset-0 flex items-center justify-center">
                  {invitation?.groomPhotoUrl ? (
                    <img
                      src={invitation.groomPhotoUrl}
                      alt={groom}
                      className="w-[56px] h-[56px] rounded-full object-cover border-3 border-white shadow-lg"
                    />
                  ) : (
                    <div
                      className="w-[56px] h-[56px] rounded-full flex items-center justify-center border-3 border-white shadow-lg font-cormorant text-xl font-black"
                      style={{ background: `${ROSE}20`, color: ROSE }}
                    >
                      {groom[0]}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] tracking-[0.25em] font-bold uppercase opacity-60" style={{ color: ROSE }}>The Groom</p>
                <h3 className="font-cormorant text-xl font-bold leading-tight" style={{ color: ROSE }}>{groomFull}</h3>
                <p className="text-[11px] text-gray-500 font-light leading-relaxed">
                  Putra dari Bapak {invitation?.groomFather || "—"} &amp; Ibu {invitation?.groomMother || "—"}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Divider */}
          <Reveal direction="zoom" delay={0.1}>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px flex-1 opacity-20" style={{ background: ROSE }} />
              <span className="font-greatvibes text-4xl opacity-50" style={{ color: ROSE }}>&amp;</span>
              <div className="h-px flex-1 opacity-20" style={{ background: ROSE }} />
            </div>
          </Reveal>

          {/* Bride */}
          <Reveal direction="up">
            <div className="flex flex-col items-center gap-4 p-5 rounded-3xl bg-white/80 backdrop-blur-sm border border-[#B76E79]/15 shadow-sm text-center">
              {/* Wreath photo */}
              <div className="relative w-28 h-28 shrink-0">
                <FloralWreath color={ROSE} size={112} />
                <div className="absolute inset-0 flex items-center justify-center">
                  {invitation?.bridePhotoUrl ? (
                    <img
                      src={invitation.bridePhotoUrl}
                      alt={bride}
                      className="w-[56px] h-[56px] rounded-full object-cover border-3 border-white shadow-lg"
                    />
                  ) : (
                    <div
                      className="w-[56px] h-[56px] rounded-full flex items-center justify-center border-3 border-white shadow-lg font-cormorant text-xl font-black"
                      style={{ background: `${ROSE}20`, color: ROSE }}
                    >
                      {bride[0]}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] tracking-[0.25em] font-bold uppercase opacity-60" style={{ color: ROSE }}>The Bride</p>
                <h3 className="font-cormorant text-xl font-bold leading-tight" style={{ color: ROSE }}>{brideFull}</h3>
                <p className="text-[11px] text-gray-500 font-light leading-relaxed">
                  Putri dari Bapak {invitation?.brideFather || "—"} &amp; Ibu {invitation?.brideMother || "—"}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════ 4. EVENTS SECTION ════════ */}
      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto space-y-10">
          <SectionHeading
            title="Jadwal Akad & Resepsi"
            subtitle="Dengan segala kerendahan hati, kami mengundang Bapak/Ibu untuk hadir"
            color={ROSE}
          />

          <div className="space-y-6">
            {invitation?.events?.map((evt, i) => (
              <Reveal key={evt.id} direction="up" delay={i * 0.12}>
                <div
                  className="rounded-3xl bg-white border shadow-sm overflow-hidden"
                  style={{ borderColor: `${ROSE}25` }}
                >
                  {/* Card header */}
                  <div
                    className="px-6 py-4 text-white text-center relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${ROSE} 0%, #8B3E4A 100%)` }}
                  >
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-24 h-24 rounded-full border-2 border-white -translate-x-6 -translate-y-6" />
                    </div>
                    <p className="text-[10px] tracking-[0.3em] uppercase font-semibold opacity-80">Acara</p>
                    <h3 className="font-cormorant text-2xl font-bold">{evt.name}</h3>
                  </div>

                  {/* Card body */}
                  <div className="p-6 grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <p className="text-[9px] tracking-[0.2em] font-bold uppercase text-gray-400">Tanggal</p>
                      <p className="font-semibold text-gray-800 leading-snug">
                        {new Date(evt.date).toLocaleDateString("id-ID", {
                          weekday: "long", day: "numeric", month: "long", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] tracking-[0.2em] font-bold uppercase text-gray-400">Waktu</p>
                      <p className="font-semibold text-gray-800">{evt.startTime} {evt.endTime ? `– ${evt.endTime}` : "WIB"}</p>
                    </div>
                    <div className="col-span-2 space-y-1 pt-3 border-t" style={{ borderColor: `${ROSE}20` }}>
                      <p className="text-[9px] tracking-[0.2em] font-bold uppercase text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" style={{ color: ROSE }} /> Lokasi
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
                        style={{ background: `linear-gradient(135deg, ${ROSE} 0%, #8B3E4A 100%)` }}
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
        <section className="py-20 px-6" style={{ background: "linear-gradient(180deg, #FFF8F9 0%, #FFF3F5 100%)" }}>
          <div className="max-w-xl mx-auto space-y-10">
            <SectionHeading title="Perjalanan Cinta" color={ROSE} />

            <div className="relative pl-8 border-l-2 space-y-10" style={{ borderColor: `${ROSE}30` }}>
              {invitation.loveStories.map((story, i) => (
                <Reveal key={story.id} direction="left" delay={i * 0.1}>
                  <div className="relative">
                    {/* Timeline dot */}
                    <div
                      className="absolute -left-[39px] top-2 w-5 h-5 rounded-full border-4 border-white shadow-md"
                      style={{ background: ROSE }}
                    />
                    <div className="space-y-2 bg-white/70 backdrop-blur-sm rounded-2xl p-5 border shadow-sm" style={{ borderColor: `${ROSE}20` }}>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: ROSE }}>{story.date}</p>
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

      {/* ════════ 6. PHOTO GALLERY ════════ */}
      {galleries.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-xl mx-auto space-y-8">
            <SectionHeading title="Galeri Momen" subtitle="Setiap foto menyimpan seribu cerita cinta" color={ROSE} />

            {layout === "CAROUSEL" ? (
              <Reveal direction="zoom">
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden border shadow-xl" style={{ borderColor: `${ROSE}30` }}>
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={carouselIndex}
                        src={galleries[carouselIndex]?.mediaUrl}
                        alt={`Slide ${carouselIndex + 1}`}
                        className="w-full h-full object-cover absolute inset-0"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                      />
                    </AnimatePresence>

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Arrows */}
                    {galleries.length > 1 && (
                      <>
                        <button type="button" onClick={() => setCarouselIndex((p) => (p - 1 + galleries.length) % galleries.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white transition-all shadow-md">
                          <ChevronLeft className="w-5 h-5" style={{ color: ROSE }} />
                        </button>
                        <button type="button" onClick={() => setCarouselIndex((p) => (p + 1) % galleries.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white transition-all shadow-md">
                          <ChevronRight className="w-5 h-5" style={{ color: ROSE }} />
                        </button>
                      </>
                    )}

                    {/* Counter badge */}
                    <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      {carouselIndex + 1} / {galleries.length}
                    </div>
                  </div>

                  {/* Dots */}
                  <div className="flex justify-center gap-1.5">
                    {galleries.map((_, i) => (
                      <button key={i} type="button" onClick={() => setCarouselIndex(i)}
                        className={`rounded-full transition-all duration-300 cursor-pointer ${carouselIndex === i ? "w-6 h-2" : "w-2 h-2"}`}
                        style={{ background: carouselIndex === i ? ROSE : `${ROSE}40` }}
                      />
                    ))}
                  </div>
                </div>
              </Reveal>
            ) : (
              <div className="columns-2 gap-3 space-y-3">
                {galleries.map((gal, i) => (
                  <Reveal key={gal.id} direction="zoom" delay={i * 0.07}>
                    <div className="break-inside-avoid rounded-2xl overflow-hidden shadow-sm border" style={{ borderColor: `${ROSE}20` }}>
                      <img src={gal.mediaUrl} alt="Kolase" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ════════ 7. DIGITAL GIFTS ════════ */}
      {invitation?.gifts?.length > 0 && (
        <section className="py-20 px-6" style={{ background: "linear-gradient(180deg, #FFF8F9 0%, #FFF3F5 100%)" }}>
          <div className="max-w-xl mx-auto space-y-10">
            <SectionHeading
              title="Amplop Digital"
              subtitle="Bagi Anda yang berkenan memberikan tanda kasih untuk pengantin baru:"
              color={ROSE}
            />

            <div className="space-y-6 max-w-sm mx-auto">
              {invitation.gifts.map((gft, i) => (
                <Reveal key={gft.id} direction="up" delay={i * 0.15}>
                  {gft.type === "PHYSICAL" ? (
                    <div className="p-6 rounded-3xl bg-white border shadow-sm text-left space-y-3" style={{ borderColor: `${ROSE}25` }}>
                      <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5" style={{ color: ROSE }} />
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

      {/* ════════ 8. RSVP & UCAPAN ════════ */}
      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto space-y-10">
          <SectionHeading
            title="RSVP & Buku Ucapan"
            subtitle="Berikan konfirmasi kehadiran Anda beserta doa terbaik:"
            color={ROSE}
          />

          <Reveal direction="up">
            <div className="p-6 rounded-3xl bg-white border shadow-sm" style={{ borderColor: `${ROSE}25` }}>
              <RsvpForm
                invitationId={invitation.id}
                defaultGuestName={guestName}
                onRsvpSuccess={onRsvpSuccess}
                guest={guest}
              />
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
      </section>

      {/* ════════ 9. FOOTER ════════ */}
      <footer className="py-16 text-center space-y-6 border-t" style={{ borderColor: `${ROSE}20`, background: `${ROSE}08` }}>
        <Reveal direction="up">
          <FloralWreath color={ROSE} size={80} />
        </Reveal>
        <Reveal direction="up" delay={0.1}>
          <div className="space-y-2">
            <p className="text-[10px] text-gray-400 font-light tracking-wider uppercase">Merupakan kehormatan bagi kami</p>
            <p className="font-cormorant text-xl font-bold" style={{ color: ROSE }}>Kami Yang Berbahagia,</p>
            <h4 className="font-greatvibes text-3xl" style={{ color: ROSE }}>{groom} &amp; {bride}</h4>
          </div>
        </Reveal>
        <Reveal direction="up" delay={0.2}>
          <div className="text-[9px] text-gray-400 tracking-[0.3em] font-semibold uppercase flex items-center justify-center gap-2">
            <span>CREATED WITH ♥ BY</span>
            <span className="font-cormorant text-sm font-bold" style={{ color: ROSE }}>IKARA</span>
          </div>
        </Reveal>
      </footer>
    </div>
  );
}
