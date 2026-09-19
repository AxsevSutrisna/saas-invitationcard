"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Copy, Check, Heart, Gift, MessageSquare, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { CountdownTimer } from "@/features/theme/components/CountdownTimer";
import { RsvpForm } from "@/features/theme/components/RsvpForm";
import { GuestWishes } from "@/features/theme/components/GuestWishes";

// ─────────── Scroll-Reveal Wrapper ───────────
function Reveal({ children, delay = 0, direction = "up", className = "" }) {
  const variants = {
    up:    { hidden: { opacity: 0, y: 50 },   visible: { opacity: 1, y: 0 } },
    down:  { hidden: { opacity: 0, y: -50 },  visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -50 },  visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 50 },   visible: { opacity: 1, x: 0 } },
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

// ─────────── Gold Wreath SVG (laurel-style, classic) ───────────
function GoldWreath({ color = "#C8A96A", size = 160 }) {
  const r = size / 2;
  const cr = r * 0.65; // photo circle radius
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Double ring */}
      <circle cx="80" cy="80" r={cr} stroke={color} strokeWidth="2" strokeDasharray="5 4" opacity="0.6" />
      <circle cx="80" cy="80" r={cr - 6} stroke={color} strokeWidth="0.8" opacity="0.35" />
      {/* 8 petal ornaments */}
      {[0,45,90,135,180,225,270,315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const px = 80 + 55 * Math.cos(rad);
        const py = 80 + 55 * Math.sin(rad);
        return (
          <g key={i}>
            <ellipse cx={px} cy={py} rx="6" ry="9" fill={color} opacity="0.25" style={{ transformOrigin: `${px}px ${py}px`, transform: `rotate(${angle + 90}deg)` }} />
            <circle cx={px} cy={py} r="3" fill={color} opacity="0.45" />
          </g>
        );
      })}
      {/* Corner laurel leaves */}
      {[20,70,110,160,200,250,290,340].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const lx = 80 + 60 * Math.cos(rad);
        const ly = 80 + 60 * Math.sin(rad);
        return <circle key={`l-${i}`} cx={lx} cy={ly} r="2.5" fill={color} opacity="0.3" />;
      })}
      {/* Center star sparkles */}
      <circle cx="80" cy="80" r={cr} fill="white" opacity="0" />
    </svg>
  );
}

// ─────────── Gold Bank Card ───────────
function GoldBankCard({ gift, copiedId, onCopy }) {
  return (
    <div
      className="relative w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl"
      style={{
        background: "linear-gradient(135deg, #C8A96A 0%, #8B6B30 40%, #5C4010 100%)",
        minHeight: 180,
      }}
    >
      {/* Luxury texture overlay */}
      <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(45deg,white,white_1px,transparent_0,transparent_12px)]" />
      <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white/30 to-transparent" />

      {/* Decorative circles */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-white/15" />
      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full border border-white/10" />
      <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full border border-white/10" />

      <div className="relative z-10 p-6 flex flex-col gap-4">
        {/* Top: bank name + chip */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] text-white/60 tracking-[0.25em] uppercase">Bank Transfer</p>
            <p className="text-white font-bold text-lg tracking-wide font-cormorant">{gift.providerName}</p>
          </div>
          {/* Chip */}
          <div className="w-10 h-8 rounded-md bg-gradient-to-br from-yellow-100 via-yellow-300 to-amber-200 shadow-inner flex items-center justify-center">
            <div className="w-6 h-5 rounded border border-amber-400/60 grid grid-cols-2 gap-[2px] p-[2px]">
              {[...Array(4)].map((_, i) => <div key={i} className="bg-amber-300/60 rounded-[1px]" />)}
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

        {/* Bottom: name + copy */}
        <div className="flex items-end justify-between pt-2">
          <div>
            <p className="text-[9px] text-white/50 tracking-[0.15em] uppercase">Atas Nama</p>
            <p className="text-white font-semibold text-sm">{gift.accountName}</p>
          </div>
          <button
            type="button"
            onClick={() => onCopy(gift.accountNumber, gift.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[10px] font-semibold transition-all cursor-pointer"
          >
            {copiedId === gift.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copiedId === gift.id ? "Tersalin!" : "Salin"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────── Gold Ornate Divider ───────────
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-3 py-2 w-full max-w-[280px] sm:max-w-md mx-auto" aria-hidden="true">
      <div className="h-px flex-grow max-w-[24px] bg-gradient-to-r from-transparent to-[#C8A96A] opacity-50" />
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path d="M12 1L14.5 9H22L15.5 14L18 22L12 17L6 22L8.5 14L2 9H9.5Z" fill="#C8A96A" opacity="0.65" />
      </svg>
      <div className="h-px flex-grow max-w-[48px] bg-[#C8A96A] opacity-35" />
      <svg width="8" height="8" viewBox="0 0 24 24" fill="#C8A96A" opacity="0.5" className="shrink-0">
        <circle cx="12" cy="12" r="6" />
      </svg>
      <div className="h-px flex-grow max-w-[48px] bg-[#C8A96A] opacity-35" />
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path d="M12 1L14.5 9H22L15.5 14L18 22L12 17L6 22L8.5 14L2 9Z" fill="#C8A96A" opacity="0.65" />
      </svg>
      <div className="h-px flex-grow max-w-[24px] bg-gradient-to-l from-transparent to-[#C8A96A] opacity-50" />
    </div>
  );
}

// ─────────── Section Heading ───────────
function SectionHeading({ title, subtitle }) {
  const GOLD = "#C8A96A";
  return (
    <Reveal direction="up">
      <div className="text-center space-y-3">
        <GoldDivider />
        <h2 className="font-cormorant text-4xl font-bold" style={{ color: GOLD }}>{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 font-light max-w-xs mx-auto">{subtitle}</p>}
        <GoldDivider />
      </div>
    </Reveal>
  );
}

// Fixed configs to avoid SSR hydration mismatch
const PARTICLE_CONFIGS = [
  { dur: 9,  del: 0   }, { dur: 13, del: 2   }, { dur: 11, del: 4   },
  { dur: 15, del: 1   }, { dur: 10, del: 6   }, { dur: 14, del: 3   },
  { dur: 12, del: 5   }, { dur: 9,  del: 7   }, { dur: 16, del: 1.5 },
  { dur: 11, del: 8   }, { dur: 13, del: 4   }, { dur: 10, del: 9   },
  { dur: 9,  del: 2.5 }, { dur: 15, del: 6.5 }, { dur: 12, del: 0.5 },
];

function GoldParticle({ style, dur = 10, del = 0 }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none w-1.5 h-1.5 rounded-full bg-[#C8A96A] opacity-0"
      style={style}
      animate={{ y: ["0vh", "110vh"], opacity: [0, 0.5, 0] }}
      transition={{ duration: dur, repeat: Infinity, delay: del, ease: "linear" }}
    />
  );
}

// ════════════════════════════════════════════
//              MAIN COMPONENT
// ════════════════════════════════════════════
export function ClassicEleganceTheme({ invitation, rsvps, guestName, onRsvpSuccess, isPreview, guest, isMuted, setIsMuted }) {
  const [copiedId, setCopiedId]     = useState(null);
  const [carouselIndex, setIdx]     = useState(0);

  const GOLD = "#C8A96A";

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

  // Fixed particle positions (deterministic, no Math.random on render)
  const PARTICLE_POSITIONS = [
    { left: "4%" }, { left: "11%" }, { left: "18%" }, { left: "25%" }, { left: "32%" },
    { left: "39%" }, { left: "46%" }, { left: "53%" }, { left: "60%" }, { left: "67%" },
    { left: "74%" }, { left: "81%" }, { left: "88%" }, { left: "93%" }, { left: "97%" },
  ];

  return (
    <div
      className="w-full text-[#1F1F1F] font-sans overflow-x-hidden min-h-screen relative pb-16 selection:bg-[#C8A96A] selection:text-white @container"
      style={{ background: "linear-gradient(180deg, #FEFCF8 0%, #FAF7F0 60%, #FEFCF8 100%)" }}
    >
      {/* ── AMBIENT GOLD PARTICLES ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {PARTICLE_POSITIONS.map((p, i) => (
          <GoldParticle key={i} style={{ left: p.left, top: "-10px" }} dur={PARTICLE_CONFIGS[i].dur} del={PARTICLE_CONFIGS[i].del} />
        ))}
      </div>

      {/* ── MUSIC TOGGLE ── */}
      {invitation?.isMusicEnabled && (
        <motion.button
          type="button"
          onClick={() => setIsMuted((p) => !p)}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#FEFCF8] border-2 shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
          style={{ borderColor: GOLD }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          {isMuted
            ? <VolumeX className="w-5 h-5" style={{ color: GOLD }} />
            : <Volume2 className="w-5 h-5 animate-pulse" style={{ color: GOLD }} />}
        </motion.button>
      )}

      {/* ════════ 1. HERO ════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-8 pb-16 overflow-hidden">
        {/* Ornate border frame */}
        <div className="absolute inset-4 border pointer-events-none rounded-2xl" style={{ borderColor: `${GOLD}25` }} />
        <div className="absolute inset-6 border pointer-events-none rounded-xl" style={{ borderColor: `${GOLD}15` }} />

        {/* Corner ornaments */}
        {[["top-4 left-4"], ["top-4 right-4 rotate-90"], ["bottom-4 left-4 -rotate-90"], ["bottom-4 right-4 rotate-180"]].map(([cls], i) => (
          <div key={i} className={`absolute ${cls} pointer-events-none`} aria-hidden>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M2 2 L2 12 L6 12 L6 6 L12 6 L12 2 Z" fill={GOLD} opacity="0.5" />
              <circle cx="2" cy="2" r="2" fill={GOLD} opacity="0.7" />
            </svg>
          </div>
        ))}

        <div className="relative z-10 space-y-6 max-w-xl">
          <Reveal direction="down">
            <p className="text-[10px] tracking-[0.4em] font-bold uppercase" style={{ color: GOLD }}>
              ✦ WALIMATUL 'URS ✦
            </p>
          </Reveal>

          <Reveal direction="zoom" delay={0.15}>
            <h1
              className="font-cormorant font-extrabold leading-tight"
              style={{ color: GOLD, fontSize: "clamp(2.2rem,11cqw,4.2rem)" }}
            >
              {groom}
              <span className="block font-greatvibes text-3xl sm:text-4xl py-1 opacity-70">&amp;</span>
              {bride}
            </h1>
          </Reveal>

          <Reveal direction="up" delay={0.2}>
            <GoldDivider />
          </Reveal>

          {invitation?.openingText && (
            <Reveal direction="up" delay={0.25}>
              <p className="text-xs text-gray-500 font-light leading-relaxed max-w-sm mx-auto">{invitation.openingText}</p>
            </Reveal>
          )}

          {invitation?.events?.[0]?.date && (
            <Reveal direction="up" delay={0.3}>
              <CountdownTimer targetDate={invitation.events[0].date} />
            </Reveal>
          )}

          {/* Cover with Gold Wreath */}
          {invitation?.coverUrl && (
            <Reveal direction="zoom" delay={0.4}>
              <div className="relative w-52 h-52 mx-auto mt-4">
                <GoldWreath color={GOLD} size={208} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={invitation.coverUrl}
                    alt="Cover Prewedding"
                    className="w-[105px] h-[105px] rounded-full object-cover border-4 border-white shadow-xl"
                    style={{ boxShadow: `0 0 0 4px ${GOLD}30, 0 8px 30px ${GOLD}25` }}
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
          <div className="w-0.5 h-10 rounded-full opacity-30" style={{ background: GOLD }} />
          <div className="text-[9px] tracking-[0.25em] opacity-40 font-semibold uppercase" style={{ color: GOLD }}>Scroll</div>
        </motion.div>
      </section>

      {/* ════════ 2. QUOTES ════════ */}
      <section className="py-20 px-6 max-w-2xl mx-auto text-center space-y-6">
        <Reveal direction="zoom">
          <Heart className="w-10 h-10 mx-auto animate-pulse" style={{ color: GOLD, fill: `${GOLD}25` }} />
        </Reveal>
        <Reveal direction="up" delay={0.1}>
          <blockquote className="font-cormorant text-2xl font-medium italic leading-relaxed" style={{ color: GOLD }}>
            &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya...&rdquo;
          </blockquote>
        </Reveal>
        <Reveal direction="up" delay={0.2}>
          <p className="text-xs text-gray-400 font-light tracking-wider">{invitation?.quotes || "QS. Ar-Rum: 21"}</p>
        </Reveal>
      </section>

      {/* ════════ 3. COUPLES ════════ */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(180deg, #FAF7F0 0%, #FEFCF8 100%)" }}>
        <div className="max-w-xl mx-auto space-y-12">
          <SectionHeading title="Mempelai Pernikahan" subtitle="Dengan rahmat Allah SWT, kami memperkenalkan diri" />

          {/* Groom */}
          <Reveal direction="up">
            <div className="flex flex-col items-center gap-4 p-5 rounded-3xl bg-white/80 border shadow-sm text-center" style={{ borderColor: `${GOLD}25` }}>
              <div className="relative w-28 h-28 shrink-0">
                <GoldWreath color={GOLD} size={112} />
                <div className="absolute inset-0 flex items-center justify-center">
                  {invitation?.groomPhotoUrl ? (
                    <img src={invitation.groomPhotoUrl} alt={groom} className="w-[56px] h-[56px] rounded-full object-cover border-3 border-white shadow-lg" />
                  ) : (
                    <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center border-3 border-white shadow-lg font-cormorant text-xl font-black" style={{ background: `${GOLD}15`, color: GOLD }}>
                      {groom[0]}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] tracking-[0.25em] font-bold uppercase opacity-60" style={{ color: GOLD }}>The Groom</p>
                <h3 className="font-cormorant text-xl font-bold leading-tight" style={{ color: GOLD }}>{groomFull}</h3>
                <p className="text-[11px] text-gray-500 font-light leading-relaxed">
                  Putra dari Bapak {invitation?.groomFather || "—"} &amp; Ibu {invitation?.groomMother || "—"}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="zoom" delay={0.1}>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px flex-1 opacity-20" style={{ background: GOLD }} />
              <span className="font-greatvibes text-4xl opacity-50" style={{ color: GOLD }}>&amp;</span>
              <div className="h-px flex-1 opacity-20" style={{ background: GOLD }} />
            </div>
          </Reveal>

          {/* Bride */}
          <Reveal direction="up">
            <div className="flex flex-col items-center gap-4 p-5 rounded-3xl bg-white/80 border shadow-sm text-center" style={{ borderColor: `${GOLD}25` }}>
              <div className="relative w-28 h-28 shrink-0">
                <GoldWreath color={GOLD} size={112} />
                <div className="absolute inset-0 flex items-center justify-center">
                  {invitation?.bridePhotoUrl ? (
                    <img src={invitation.bridePhotoUrl} alt={bride} className="w-[56px] h-[56px] rounded-full object-cover border-3 border-white shadow-lg" />
                  ) : (
                    <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center border-3 border-white shadow-lg font-cormorant text-xl font-black" style={{ background: `${GOLD}15`, color: GOLD }}>
                      {bride[0]}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] tracking-[0.25em] font-bold uppercase opacity-60" style={{ color: GOLD }}>The Bride</p>
                <h3 className="font-cormorant text-xl font-bold leading-tight" style={{ color: GOLD }}>{brideFull}</h3>
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
          <SectionHeading title="Jadwal Akad & Resepsi" subtitle="Dengan segala kerendahan hati, kami mengundang Bapak/Ibu hadir" />
          <div className="space-y-6">
            {invitation?.events?.map((evt, i) => (
              <Reveal key={evt.id} direction="up" delay={i * 0.12}>
                <div className="rounded-3xl bg-white border shadow-sm overflow-hidden" style={{ borderColor: `${GOLD}25` }}>
                  <div className="px-6 py-4 text-white text-center relative" style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #7A5C1E 100%)` }}>
                    <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,white,white_1px,transparent_0,transparent_12px)]" />
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
                    <div className="col-span-2 space-y-1 pt-3 border-t" style={{ borderColor: `${GOLD}20` }}>
                      <p className="text-[9px] tracking-[0.2em] font-bold uppercase text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" style={{ color: GOLD }} /> Lokasi
                      </p>
                      <p className="font-bold text-gray-800">{evt.locationName}</p>
                      <p className="text-gray-500 font-light leading-relaxed">{evt.address}</p>
                    </div>
                  </div>
                  {evt.mapUrl && (
                    <div className="px-6 pb-6">
                      <a href={evt.mapUrl} target="_blank" rel="noreferrer"
                        className="w-full h-10 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-bold text-white cursor-pointer hover:opacity-90"
                        style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #7A5C1E 100%)` }}>
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
        <section className="py-20 px-6" style={{ background: "linear-gradient(180deg, #FAF7F0 0%, #FEFCF8 100%)" }}>
          <div className="max-w-xl mx-auto space-y-10">
            <SectionHeading title="Kisah Cinta Kami" />
            <div className="relative pl-8 border-l-2 space-y-10" style={{ borderColor: `${GOLD}30` }}>
              {invitation.loveStories.map((story, i) => (
                <Reveal key={story.id} direction="left" delay={i * 0.1}>
                  <div className="relative">
                    <div className="absolute -left-[39px] top-2 w-5 h-5 rounded-full border-4 border-white shadow-md" style={{ background: GOLD }} />
                    <div className="bg-white/70 rounded-2xl p-5 border shadow-sm space-y-2" style={{ borderColor: `${GOLD}20` }}>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: GOLD }}>{story.date}</p>
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
            <SectionHeading title="Galeri Kebahagiaan" subtitle="Setiap foto menyimpan kenangan yang tak terlupakan" />
            {layout === "CAROUSEL" ? (
              <Reveal direction="zoom">
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden border shadow-xl" style={{ borderColor: `${GOLD}30` }}>
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    {galleries.length > 1 && (
                      <>
                        <button type="button" onClick={() => setIdx((p) => (p - 1 + galleries.length) % galleries.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white shadow-md">
                          <ChevronLeft className="w-5 h-5" style={{ color: GOLD }} />
                        </button>
                        <button type="button" onClick={() => setIdx((p) => (p + 1) % galleries.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white shadow-md">
                          <ChevronRight className="w-5 h-5" style={{ color: GOLD }} />
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
                        style={{ background: carouselIndex === i ? GOLD : `${GOLD}40` }} />
                    ))}
                  </div>
                </div>
              </Reveal>
            ) : (
              <div className="columns-2 gap-3 space-y-3">
                {galleries.map((gal, i) => (
                  <Reveal key={gal.id} direction="zoom" delay={i * 0.07}>
                    <div className="break-inside-avoid rounded-2xl overflow-hidden shadow-sm border" style={{ borderColor: `${GOLD}20` }}>
                      <img src={gal.mediaUrl} alt="Kolase" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
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
        <section className="py-20 px-6" style={{ background: "linear-gradient(180deg, #FAF7F0 0%, #FEFCF8 100%)" }}>
          <div className="max-w-xl mx-auto space-y-10">
            <SectionHeading title="Amplop Digital" subtitle="Bagi yang berkenan memberikan tanda kasih untuk pengantin baru:" />
            <div className="space-y-6 max-w-sm mx-auto">
              {invitation.gifts.map((gft, i) => (
                <Reveal key={gft.id} direction="up" delay={i * 0.15}>
                  {gft.type === "PHYSICAL" ? (
                    <div className="p-6 rounded-3xl bg-white border shadow-sm text-left space-y-3" style={{ borderColor: `${GOLD}25` }}>
                      <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5" style={{ color: GOLD }} />
                        <h3 className="font-semibold text-gray-800">Kirim Kado Fisik</h3>
                      </div>
                      <p className="font-bold text-gray-800">{invitation?.physicalGiftReceiver}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{invitation?.physicalGiftAddress}</p>
                      {invitation?.physicalGiftPhone && <p className="text-xs text-gray-400">📞 {invitation.physicalGiftPhone}</p>}
                    </div>
                  ) : (
                    <GoldBankCard gift={gft} copiedId={copiedId} onCopy={handleCopy} />
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
          <SectionHeading title="Konfirmasi RSVP & Ucapan" subtitle="Berikan konfirmasi kehadiran dan doa restu terbaik:" />
          <Reveal direction="up">
            <div className="p-6 rounded-3xl bg-white border shadow-sm" style={{ borderColor: `${GOLD}25` }}>
              <RsvpForm invitationId={invitation.id} defaultGuestName={guestName} onRsvpSuccess={onRsvpSuccess} guest={guest} />
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Buku Doa &amp; Ucapan ({rsvps?.length || 0})</h3>
              <GuestWishes rsvps={rsvps} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════ 9. FOOTER ════════ */}
      <footer className="py-16 text-center space-y-6 border-t" style={{ borderColor: `${GOLD}20`, background: `${GOLD}06` }}>
        <Reveal direction="up"><GoldWreath color={GOLD} size={80} /></Reveal>
        <Reveal direction="up" delay={0.1}>
          <div className="space-y-2">
            <p className="text-[10px] text-gray-400 font-light tracking-wider uppercase">Merupakan kehormatan bagi kami</p>
            <p className="font-cormorant text-xl font-bold" style={{ color: GOLD }}>Kami Yang Berbahagia,</p>
            <h4 className="font-greatvibes text-3xl" style={{ color: GOLD }}>{groom} &amp; {bride}</h4>
          </div>
        </Reveal>
        <Reveal direction="up" delay={0.2}>
          <div className="text-[9px] text-gray-400 tracking-[0.3em] font-semibold uppercase flex items-center justify-center gap-2">
            <span>CREATED WITH ♥ BY</span>
            <span className="font-cormorant text-sm font-bold" style={{ color: GOLD }}>IKARA</span>
          </div>
        </Reveal>
      </footer>
    </div>
  );
}
