"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Copy, Check, Heart, Gift, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { CountdownTimer } from "@/features/theme/components/CountdownTimer";
import { RsvpForm } from "@/features/theme/components/RsvpForm";
import { GuestWishes } from "@/features/theme/components/GuestWishes";

// ─────────── Scroll-Reveal ───────────
function Reveal({ children, delay = 0, direction = "up", className = "" }) {
  const v = {
    up:    { hidden: { opacity: 0, y: 50 },   visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -50 },  visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 50 },   visible: { opacity: 1, x: 0 } },
    zoom:  { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } },
    fade:  { hidden: { opacity: 0 },           visible: { opacity: 1 } },
  };
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
      variants={v[direction]} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

// ─────────── Blue Leaf Wreath SVG ───────────
function BlueLeafWreath({ color = "#1A365D", size = 160 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" aria-hidden>
      {/* Outer ring */}
      <circle cx="80" cy="80" r="56" stroke={color} strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
      {/* Inner circle */}
      <circle cx="80" cy="80" r="48" stroke={color} strokeWidth="0.5" opacity="0.2" />
      {/* 8 leaf clusters */}
      {[0,45,90,135,180,225,270,315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const lx = 80 + 60 * Math.cos(rad);
        const ly = 80 + 60 * Math.sin(rad);
        return (
          <g key={i} style={{ transformOrigin: `${lx}px ${ly}px`, transform: `rotate(${angle + 90}deg)` }}>
            <ellipse cx={lx} cy={ly} rx="5" ry="9" fill={color} opacity="0.2" />
            <ellipse cx={lx} cy={ly} rx="3" ry="6" fill={color} opacity="0.35" />
          </g>
        );
      })}
      {/* Small dot accents */}
      {[22,67,112,157,202,247,292,337].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 80 + 62 * Math.cos(rad);
        const cy = 80 + 62 * Math.sin(rad);
        return <circle key={`d-${i}`} cx={cx} cy={cy} r="2.5" fill={color} opacity="0.35" />;
      })}
    </svg>
  );
}

// ─────────── Blue Wave Divider ───────────
function WaveDivider({ color = "#1A365D" }) {
  return (
    <div className="flex items-center gap-3 py-2" aria-hidden>
      <div className="h-px flex-1 opacity-20" style={{ background: color }} />
      <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
        <path d="M0 6 C8 0, 12 12, 20 6 S32 0, 40 6" stroke={color} strokeWidth="1.5" opacity="0.5" />
      </svg>
      <svg width="8" height="8" viewBox="0 0 8 8" fill={color} opacity="0.5">
        <rect x="1" y="1" width="6" height="6" rx="1" />
      </svg>
      <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
        <path d="M0 6 C8 0, 12 12, 20 6 S32 0, 40 6" stroke={color} strokeWidth="1.5" opacity="0.5" />
      </svg>
      <div className="h-px flex-1 opacity-20" style={{ background: color }} />
    </div>
  );
}

// ─────────── Blue Bank Card ───────────
function BlueBankCard({ gift, copiedId, onCopy }) {
  return (
    <div
      className="relative w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl"
      style={{ background: "linear-gradient(135deg, #1A365D 0%, #2D5282 50%, #1A365D 100%)", minHeight: 180 }}
    >
      {/* Wave pattern overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 300 180" preserveAspectRatio="none">
        <path d="M0 60 C60 20, 120 100, 180 60 S260 20, 300 60 L300 180 L0 180 Z" fill="white" />
      </svg>
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-white/10" />

      <div className="relative z-10 p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] text-white/50 tracking-[0.25em] uppercase">Bank Transfer</p>
            <p className="text-white font-bold text-lg tracking-wide font-cormorant">{gift.providerName}</p>
          </div>
          {/* Chip */}
          <div className="w-10 h-8 rounded-md bg-gradient-to-br from-cyan-200 via-sky-300 to-blue-200 shadow-inner flex items-center justify-center">
            <div className="w-6 h-5 rounded border border-blue-400/50 grid grid-cols-2 gap-[2px] p-[2px]">
              {[...Array(4)].map((_, i) => <div key={i} className="bg-blue-200/60 rounded-[1px]" />)}
            </div>
          </div>
        </div>

        <div>
          <p className="text-[9px] text-white/40 tracking-[0.2em] uppercase mb-1">Nomor Rekening</p>
          <p className="text-white font-mono font-bold text-xl tracking-[0.18em] select-all">
            {(gift.accountNumber || "").replace(/(\d{4})(?=\d)/g, "$1 ")}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] text-white/40 tracking-[0.15em] uppercase">Atas Nama</p>
            <p className="text-white font-semibold">{gift.accountName}</p>
          </div>
          <button type="button" onClick={() => onCopy(gift.accountNumber, gift.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[10px] font-semibold transition-all cursor-pointer backdrop-blur-sm">
            {copiedId === gift.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copiedId === gift.id ? "Tersalin!" : "Salin"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────── Section Heading ───────────
function SectionHeading({ title, subtitle, color = "#1A365D" }) {
  return (
    <Reveal direction="up">
      <div className="text-center space-y-3">
        <WaveDivider color={color} />
        <h2 className="font-cormorant text-4xl font-bold" style={{ color }}>{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 font-light max-w-xs mx-auto leading-relaxed">{subtitle}</p>}
        <WaveDivider color={color} />
      </div>
    </Reveal>
  );
}

// Fixed bubble configs (no Math.random on render)
const BUBBLE_CONFIGS = [
  { dur: 12, del: 0,   w: "12px", h: "12px" },
  { dur: 18, del: 2,   w: "20px", h: "20px" },
  { dur: 14, del: 4,   w: "8px",  h: "8px"  },
  { dur: 20, del: 1,   w: "16px", h: "16px" },
  { dur: 11, del: 6,   w: "10px", h: "10px" },
  { dur: 16, del: 3,   w: "18px", h: "18px" },
  { dur: 13, del: 5,   w: "14px", h: "14px" },
  { dur: 19, del: 2.5, w: "22px", h: "22px" },
  { dur: 10, del: 7,   w: "9px",  h: "9px"  },
  { dur: 15, del: 0.5, w: "15px", h: "15px" },
];

function Bubble({ style, dur = 12, del = 0 }) {
  return (
    <motion.div
      className="absolute pointer-events-none rounded-full border border-[#1A365D]/20"
      style={style}
      animate={{ y: ["0vh", "-120vh"], opacity: [0, 0.4, 0], scale: [0.8, 1.2] }}
      transition={{ duration: dur, repeat: Infinity, delay: del, ease: "linear" }}
    />
  );
}

// ════════════════════════════════════════════
export function FloralBlueTheme({ invitation, rsvps, guestName, onRsvpSuccess, isPreview, guest, isMuted, setIsMuted }) {
  const [copiedId, setCopiedId] = useState(null);
  const [carouselIndex, setIdx] = useState(0);

  const NAVY = "#1A365D";
  const ICE  = "#E8F4FD";

  const groom     = invitation?.groomNickname || "Pria";
  const bride     = invitation?.brideNickname  || "Wanita";
  const groomFull = invitation?.groomFullName  || "Nama Pria Lengkap";
  const brideFull = invitation?.brideFullName  || "Nama Wanita Lengkap";
  const galleries = invitation?.galleries      || [];
  const layout    = invitation?.galleryLayout  || "CAROUSEL";

  useEffect(() => {
    if (layout !== "CAROUSEL" || galleries.length <= 1) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % galleries.length), 4500);
    return () => clearInterval(t);
  }, [layout, galleries.length]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Fixed bubble positions (no Math.random on render)
  const BUBBLE_POSITIONS = [
    { left: "4%",  bottom: "-8px"  },
    { left: "13%", bottom: "-14px" },
    { left: "22%", bottom: "-5px"  },
    { left: "31%", bottom: "-18px" },
    { left: "40%", bottom: "-10px" },
    { left: "50%", bottom: "-3px"  },
    { left: "60%", bottom: "-15px" },
    { left: "70%", bottom: "-7px"  },
    { left: "80%", bottom: "-20px" },
    { left: "91%", bottom: "-12px" },
  ];

  return (
    <div
      className="w-full text-[#0F1E36] font-sans overflow-x-hidden min-h-screen relative pb-16 selection:bg-[#1A365D] selection:text-white @container"
      style={{ background: "linear-gradient(180deg, #EBF8FF 0%, #F0F4F8 60%, #EBF8FF 100%)" }}
    >
      {/* ── AMBIENT BUBBLES ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {BUBBLE_POSITIONS.map((b, i) => (
          <Bubble key={i} style={{ left: b.left, bottom: b.bottom, width: BUBBLE_CONFIGS[i].w, height: BUBBLE_CONFIGS[i].h }} dur={BUBBLE_CONFIGS[i].dur} del={BUBBLE_CONFIGS[i].del} />
        ))}
      </div>

      {/* ── MUSIC TOGGLE ── */}
      {invitation?.isMusicEnabled && (
        <motion.button type="button" onClick={() => setIsMuted((p) => !p)}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full border-2 shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
          style={{ background: "white", borderColor: NAVY }}
          whileTap={{ scale: 0.9 }} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }}>
          {isMuted ? <VolumeX className="w-5 h-5" style={{ color: NAVY }} /> : <Volume2 className="w-5 h-5 animate-pulse" style={{ color: NAVY }} />}
        </motion.button>
      )}

      {/* ════════ 1. HERO ════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-8 pb-16 overflow-hidden">
        {/* SVG wave background */}
        <svg className="absolute bottom-0 left-0 w-full h-32 pointer-events-none" viewBox="0 0 1440 128" preserveAspectRatio="none" aria-hidden>
          <path d="M0 64 C360 0, 720 128, 1080 64 S1360 0, 1440 64 L1440 128 L0 128 Z" fill={NAVY} opacity="0.05" />
        </svg>

        <div className="relative z-10 space-y-6 max-w-xl">
          <Reveal direction="fade">
            <p className="text-[10px] tracking-[0.4em] font-bold uppercase" style={{ color: NAVY, opacity: 0.7 }}>
              ✦ THE WEDDING CELEBRATION OF ✦
            </p>
          </Reveal>

          <Reveal direction="zoom" delay={0.15}>
            <h1 className="font-cormorant font-extrabold leading-tight" style={{ color: NAVY, fontSize: "clamp(2.2rem,11cqw,4.2rem)" }}>
              {groom}
              <span className="block font-greatvibes text-4xl sm:text-5xl py-2 opacity-60">&amp;</span>
              {bride}
            </h1>
          </Reveal>

          <Reveal direction="up" delay={0.25}>
            <WaveDivider color={NAVY} />
          </Reveal>

          {invitation?.openingText && (
            <Reveal direction="up" delay={0.3}>
              <p className="text-xs text-gray-500 font-light leading-relaxed max-w-sm mx-auto">{invitation.openingText}</p>
            </Reveal>
          )}

          {invitation?.events?.[0]?.date && (
            <Reveal direction="up" delay={0.35}>
              <CountdownTimer targetDate={invitation.events[0].date} />
            </Reveal>
          )}

          {/* Cover with Blue Leaf Wreath */}
          {invitation?.coverUrl && (
            <Reveal direction="zoom" delay={0.45}>
              <div className="relative w-52 h-52 mx-auto mt-4">
                <BlueLeafWreath color={NAVY} size={208} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src={invitation.coverUrl} alt="Cover Prewedding"
                    className="w-[104px] h-[104px] rounded-full object-cover shadow-xl border-4 border-white"
                    style={{ boxShadow: `0 0 0 4px ${NAVY}25, 0 8px 30px ${NAVY}20` }} />
                </div>
              </div>
            </Reveal>
          )}
        </div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-0.5 h-10 rounded-full opacity-30" style={{ background: NAVY }} />
          <div className="text-[9px] tracking-[0.25em] opacity-40 font-semibold uppercase" style={{ color: NAVY }}>Scroll</div>
        </motion.div>
      </section>

      {/* ════════ 2. QUOTES ════════ */}
      <section className="py-20 px-6 max-w-2xl mx-auto text-center space-y-6">
        <Reveal direction="zoom">
          <Heart className="w-10 h-10 mx-auto animate-pulse" style={{ color: NAVY, fill: `${NAVY}20` }} />
        </Reveal>
        <Reveal direction="up" delay={0.1}>
          <blockquote className="font-cormorant text-2xl font-medium italic leading-relaxed" style={{ color: NAVY }}>
            &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya...&rdquo;
          </blockquote>
        </Reveal>
        <Reveal direction="up" delay={0.2}>
          <p className="text-xs text-gray-400 font-light tracking-wider">{invitation?.quotes || "QS. Ar-Rum: 21"}</p>
        </Reveal>
      </section>

      {/* ════════ 3. COUPLES ════════ */}
      <section className="py-20 px-6" style={{ background: `${ICE}80` }}>
        <div className="max-w-xl mx-auto space-y-12">
          <SectionHeading title="Mempelai Pengantin" subtitle="Dengan penuh rasa syukur kami memperkenalkan diri" color={NAVY} />

          {/* Groom */}
          <Reveal direction="up">
            <div className="flex flex-col items-center gap-4 p-5 rounded-3xl bg-white/80 backdrop-blur-sm border shadow-sm text-center" style={{ borderColor: `${NAVY}20` }}>
              <div className="relative w-28 h-28 shrink-0">
                <BlueLeafWreath color={NAVY} size={112} />
                <div className="absolute inset-0 flex items-center justify-center">
                  {invitation?.groomPhotoUrl ? (
                    <img src={invitation.groomPhotoUrl} alt={groom} className="w-[56px] h-[56px] rounded-full object-cover border-2 border-white shadow-lg" />
                  ) : (
                    <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center border-2 border-white shadow-lg font-cormorant text-xl font-black" style={{ background: `${NAVY}15`, color: NAVY }}>
                      {groom[0]}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] tracking-[0.25em] font-bold uppercase opacity-50" style={{ color: NAVY }}>The Groom</p>
                <h3 className="font-cormorant text-xl font-bold leading-tight" style={{ color: NAVY }}>{groomFull}</h3>
                <p className="text-[11px] text-gray-500 font-light leading-relaxed">
                  Putra dari Bapak {invitation?.groomFather || "—"} &amp; Ibu {invitation?.groomMother || "—"}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="zoom" delay={0.1}>
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 opacity-20" style={{ background: NAVY }} />
              <span className="font-greatvibes text-4xl opacity-40" style={{ color: NAVY }}>&amp;</span>
              <div className="h-px flex-1 opacity-20" style={{ background: NAVY }} />
            </div>
          </Reveal>

          {/* Bride */}
          <Reveal direction="up">
            <div className="flex flex-col items-center gap-4 p-5 rounded-3xl bg-white/80 backdrop-blur-sm border shadow-sm text-center" style={{ borderColor: `${NAVY}20` }}>
              <div className="relative w-28 h-28 shrink-0">
                <BlueLeafWreath color={NAVY} size={112} />
                <div className="absolute inset-0 flex items-center justify-center">
                  {invitation?.bridePhotoUrl ? (
                    <img src={invitation.bridePhotoUrl} alt={bride} className="w-[56px] h-[56px] rounded-full object-cover border-2 border-white shadow-lg" />
                  ) : (
                    <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center border-2 border-white shadow-lg font-cormorant text-xl font-black" style={{ background: `${NAVY}15`, color: NAVY }}>
                      {bride[0]}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] tracking-[0.25em] font-bold uppercase opacity-50" style={{ color: NAVY }}>The Bride</p>
                <h3 className="font-cormorant text-xl font-bold leading-tight" style={{ color: NAVY }}>{brideFull}</h3>
                <p className="text-[11px] text-gray-500 font-light leading-relaxed">
                  Putri dari Bapak {invitation?.brideFather || "—"} &amp; Ibu {invitation?.brideMother || "—"}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════ 4. EVENTS ════════ */}
      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto space-y-10">
          <SectionHeading title="Jadwal Akad & Resepsi" subtitle="Dengan segala kerendahan hati, kami mengundang Bapak/Ibu untuk hadir" color={NAVY} />
          <div className="space-y-6">
            {invitation?.events?.map((evt, i) => (
              <Reveal key={evt.id} direction="up" delay={i * 0.12}>
                <div className="rounded-3xl bg-white border shadow-sm overflow-hidden" style={{ borderColor: `${NAVY}20` }}>
                  <div className="px-6 py-4 text-white text-center relative" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #2D5282 100%)` }}>
                    <svg className="absolute bottom-0 left-0 w-full h-6" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden>
                      <path d="M0 0 C75 24, 150 0, 225 24 S300 0, 300 0" stroke="white" strokeWidth="1" opacity="0.15" fill="none" />
                    </svg>
                    <p className="text-[10px] tracking-[0.3em] uppercase font-semibold opacity-70">Acara</p>
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
                    <div className="col-span-2 space-y-1 pt-3 border-t" style={{ borderColor: `${NAVY}15` }}>
                      <p className="text-[9px] tracking-[0.2em] font-bold uppercase text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" style={{ color: NAVY }} /> Lokasi
                      </p>
                      <p className="font-bold text-gray-800">{evt.locationName}</p>
                      <p className="text-gray-500 font-light leading-relaxed">{evt.address}</p>
                    </div>
                  </div>
                  {evt.mapUrl && (
                    <div className="px-6 pb-6">
                      <a href={evt.mapUrl} target="_blank" rel="noreferrer"
                        className="w-full h-10 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-bold text-white cursor-pointer hover:opacity-90"
                        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #2D5282 100%)` }}>
                        <MapPin className="w-3.5 h-3.5" /> Buka Google Maps
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
        <section className="py-20 px-6" style={{ background: `${ICE}80` }}>
          <div className="max-w-xl mx-auto space-y-10">
            <SectionHeading title="Perjalanan Cinta" color={NAVY} />
            <div className="relative pl-8 border-l-2 space-y-10" style={{ borderColor: `${NAVY}25` }}>
              {invitation.loveStories.map((story, i) => (
                <Reveal key={story.id} direction="left" delay={i * 0.1}>
                  <div className="relative">
                    <div className="absolute -left-[39px] top-2 w-5 h-5 rounded-full border-4 border-white shadow-md" style={{ background: NAVY }} />
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border shadow-sm space-y-2" style={{ borderColor: `${NAVY}15` }}>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: NAVY }}>{story.date}</p>
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

      {/* ════════ 6. GALLERY ════════ */}
      {galleries.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-xl mx-auto space-y-8">
            <SectionHeading title="Galeri Momen" subtitle="Abadikan setiap momen bersama" color={NAVY} />
            {layout === "CAROUSEL" ? (
              <Reveal direction="zoom">
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden border shadow-xl" style={{ borderColor: `${NAVY}25` }}>
                    <AnimatePresence mode="wait">
                      <motion.img key={carouselIndex} src={galleries[carouselIndex]?.mediaUrl} alt={`Slide ${carouselIndex + 1}`}
                        className="w-full h-full object-cover absolute inset-0"
                        initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    {galleries.length > 1 && (
                      <>
                        <button type="button" onClick={() => setIdx((p) => (p - 1 + galleries.length) % galleries.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white shadow-md">
                          <ChevronLeft className="w-5 h-5" style={{ color: NAVY }} />
                        </button>
                        <button type="button" onClick={() => setIdx((p) => (p + 1) % galleries.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white shadow-md">
                          <ChevronRight className="w-5 h-5" style={{ color: NAVY }} />
                        </button>
                      </>
                    )}
                    <div className="absolute bottom-4 right-4 bg-black/40 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {carouselIndex + 1} / {galleries.length}
                    </div>
                  </div>
                  <div className="flex justify-center gap-1.5">
                    {galleries.map((_, i) => (
                      <button key={i} type="button" onClick={() => setIdx(i)}
                        className={`rounded-full transition-all duration-300 cursor-pointer ${carouselIndex === i ? "w-6 h-2" : "w-2 h-2"}`}
                        style={{ background: carouselIndex === i ? NAVY : `${NAVY}35` }} />
                    ))}
                  </div>
                </div>
              </Reveal>
            ) : (
              <div className="columns-2 gap-3 space-y-3">
                {galleries.map((gal, i) => (
                  <Reveal key={gal.id} direction="zoom" delay={i * 0.07}>
                    <div className="break-inside-avoid rounded-2xl overflow-hidden shadow-sm border" style={{ borderColor: `${NAVY}15` }}>
                      <img src={gal.mediaUrl} alt="Gallery" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ════════ 7. GIFTS ════════ */}
      {invitation?.gifts?.length > 0 && (
        <section className="py-20 px-6" style={{ background: `${ICE}80` }}>
          <div className="max-w-xl mx-auto space-y-10">
            <SectionHeading title="Amplop Digital" subtitle="Bagi yang berkenan memberikan tanda kasih:" color={NAVY} />
            <div className="space-y-6 max-w-sm mx-auto">
              {invitation.gifts.map((gft, i) => (
                <Reveal key={gft.id} direction="up" delay={i * 0.15}>
                  {gft.type === "PHYSICAL" ? (
                    <div className="p-6 rounded-3xl bg-white border shadow-sm text-left space-y-3" style={{ borderColor: `${NAVY}20` }}>
                      <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5" style={{ color: NAVY }} />
                        <h3 className="font-semibold text-gray-800">Kirim Kado Fisik</h3>
                      </div>
                      <p className="font-bold text-gray-800">{invitation?.physicalGiftReceiver}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{invitation?.physicalGiftAddress}</p>
                    </div>
                  ) : (
                    <BlueBankCard gift={gft} copiedId={copiedId} onCopy={handleCopy} />
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════ 8. RSVP ════════ */}
      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto space-y-10">
          <SectionHeading title="RSVP & Buku Ucapan" subtitle="Konfirmasi kehadiran dan doa terbaik:" color={NAVY} />
          <Reveal direction="up">
            <div className="p-6 rounded-3xl bg-white border shadow-sm" style={{ borderColor: `${NAVY}20` }}>
              <RsvpForm invitationId={invitation.id} defaultGuestName={guestName} onRsvpSuccess={onRsvpSuccess} guest={guest} />
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Doa &amp; Restu ({rsvps?.length || 0})</h3>
              <GuestWishes rsvps={rsvps} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════ 9. FOOTER ════════ */}
      <footer className="py-16 text-center space-y-6 border-t" style={{ borderColor: `${NAVY}15`, background: `${NAVY}06` }}>
        <Reveal direction="up"><BlueLeafWreath color={NAVY} size={80} /></Reveal>
        <Reveal direction="up" delay={0.1}>
          <div className="space-y-2">
            <p className="text-[10px] text-gray-400 font-light tracking-wider uppercase">Merupakan kehormatan bagi kami</p>
            <p className="font-cormorant text-xl font-bold" style={{ color: NAVY }}>Kami Yang Berbahagia,</p>
            <h4 className="font-greatvibes text-3xl" style={{ color: NAVY }}>{groom} &amp; {bride}</h4>
          </div>
        </Reveal>
        <Reveal direction="up" delay={0.2}>
          <div className="text-[9px] text-gray-400 tracking-[0.3em] font-semibold uppercase flex items-center justify-center gap-2">
            <span>CREATED WITH ♥ BY</span>
            <span className="font-cormorant text-sm font-bold" style={{ color: NAVY }}>IKARA</span>
          </div>
        </Reveal>
      </footer>
    </div>
  );
}
