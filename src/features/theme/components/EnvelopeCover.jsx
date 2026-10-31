"use client";

import { motion } from "framer-motion";
import { Mail, Leaf } from "lucide-react";
import { getThemeConfig } from "@/features/theme/theme-config";
import { HangingLeavesTop, GardenScene, CoverGardenBorder } from "@/features/theme/components/FloralOrnaments";
import { FloralCoverLayers } from "@/features/theme/components/FloralCoverLayers";
import { FLORAL_USE_PNG } from "@/features/theme/floral-assets";

const ROSE_PETALS = [
  { left: "12%", xEnd: 30,  dur: 9,   del: 0   },
  { left: "32%", xEnd: -25, dur: 13,  del: 1.5 },
  { left: "52%", xEnd: 20,  dur: 11,  del: 3   },
  { left: "72%", xEnd: -35, dur: 15,  del: 0.5 },
  { left: "88%", xEnd: 25,  dur: 10,  del: 4.5 },
];

const GOLD_PARTICLES = [
  { left: "15%", dur: 8,  del: 0   },
  { left: "35%", dur: 12, del: 2   },
  { left: "55%", dur: 10, del: 4   },
  { left: "75%", dur: 14, del: 1   },
  { left: "92%", dur: 11, del: 5.5 },
];

const BLUE_BUBBLES = [
  { left: "18%", w: "10px", h: "10px", dur: 11, del: 0 },
  { left: "38%", w: "14px", h: "14px", dur: 16, del: 2 },
  { left: "58%", w: "8px",  h: "8px",  dur: 13, del: 4 },
  { left: "78%", w: "12px", h: "12px", dur: 15, del: 1 },
  { left: "92%", w: "6px",  h: "6px",  dur: 10, del: 5 },
];

const GREEN_LEAVES = [
  { left: "14%", xEnd: 24,  dur: 10, del: 0,   fontSize: "16px" },
  { left: "34%", xEnd: -20, dur: 14, del: 2,   fontSize: "20px" },
  { left: "54%", xEnd: 18,  dur: 12, del: 4,   fontSize: "14px" },
  { left: "74%", xEnd: -26, dur: 16, del: 1,   fontSize: "18px" },
  { left: "90%", xEnd: 20,  dur: 11, del: 5.5, fontSize: "15px" },
];

/**
 * Transisi "buka undangan" — FADE + ZOOM-THROUGH: cover memudar (opacity 1→0)
 * sambil sedikit membesar (scale 1→1.08), seolah resesi/larut ke arah penonton.
 * Saat cover larut, isi undangan di belakangnya tersingkap halus (cross-dissolve).
 * Dipakai BERSAMA oleh kedua varian cover (fullbleed & framed) agar tak duplikat.
 *
 * PENTING — cover dirender `fixed inset-0`, BUKAN `absolute`. Begitu undangan
 * dibuka, isi undangan (tinggi) ikut ter-render sebagai sibling dan membuat
 * parent membengkak setinggi seluruh halaman. Kalau cover `absolute`, tingginya
 * ikut membengkak → titik pusat skala jatuh di tengah HALAMAN (jauh di bawah
 * viewport) dan konten cover meloncat. Dengan `fixed`, cover selalu seukuran
 * viewport (di preview: terkurung ke layar HP via transform parent) → pusat
 * skala di tengah layar, zoom terasa benar.
 *
 * Isi undangan TIDAK diberi transform zoom sendiri (hanya tersingkap oleh cover
 * yang larut): transform yang menetap akan membuat elemen `fixed` (partikel &
 * tombol musik) terkurung + ikut ter-scroll, dan merusak rantai tinggi
 * `min-h-screen` di preview. Hero isi sengaja statis (lihat Reveal.jsx).
 *
 * Blur lembut (0→8px) saat memudar → kesan "larut"/dreamy. Blur hanya pada cover
 * (unmount setelah transisi) & tak memengaruhi isi undangan (cover = sibling).
 */
const COVER_TRANSITION = {
  initial: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 1.08, filter: "blur(8px)" },
  transition: { duration: 1, ease: [0.4, 0, 0.2, 1] },
};

function PhotoFrame({ frameKind, coverUrl, title }) {
  const defaultPlaceholder = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600";
  const imgUrl = coverUrl || defaultPlaceholder;

  switch (frameKind) {
    case "floral-blossom":
      return (
        <div className="relative w-[150px] h-[200px] flex items-center justify-center p-2.5 select-none filter drop-shadow-md">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 150 200" preserveAspectRatio="none">
            <defs>
              <mask id="stamp-mask-card">
                <rect width="150" height="200" fill="white" rx="4" />
                {[...Array(9)].map((_, i) => (
                  <circle key={`t-${i}`} cx={10 + i * 16} cy={0} r={3.5} fill="black" />
                ))}
                {[...Array(9)].map((_, i) => (
                  <circle key={`b-${i}`} cx={10 + i * 16} cy={200} r={3.5} fill="black" />
                ))}
                {[...Array(12)].map((_, i) => (
                  <circle key={`l-${i}`} cx={0} cy={10 + i * 16} r={3.5} fill="black" />
                ))}
                {[...Array(12)].map((_, i) => (
                  <circle key={`r-${i}`} cx={150} cy={10 + i * 16} r={3.5} fill="black" />
                ))}
              </mask>
            </defs>
            <rect width="150" height="200" fill="white" mask="url(#stamp-mask-card)" />
          </svg>
          <div className="w-[126px] h-[168px] overflow-hidden rounded-sm bg-zinc-100 z-10 border border-zinc-200/50">
            <img src={imgUrl} alt={title} className="w-full h-full object-cover" />
          </div>
        </div>
      );

    case "classic":
      return (
        <div className="relative w-[150px] h-[200px] p-1 bg-white dark:bg-zinc-800 shadow-xl border border-[#C8A96A]/60 rounded-md">
          <div className="absolute inset-0.5 border border-dashed border-[#C8A96A]/40" />
          <div className="w-full h-full overflow-hidden rounded-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-100">
            <img src={imgUrl} alt={title} className="w-full h-full object-cover" />
          </div>
        </div>
      );

    case "modern":
      return (
        <div className="relative w-[150px] h-[200px] bg-slate-900 border border-slate-700/60 p-1 shadow-2xl">
          <div className="absolute -inset-1 border border-slate-700/20 pointer-events-none -z-10" />
          <div className="w-full h-full overflow-hidden bg-slate-800">
            <img src={imgUrl} alt={title} className="w-full h-full object-cover" />
          </div>
        </div>
      );

    case "floral-blue":
      return (
        <div className="relative w-[150px] h-[200px] p-1 bg-white dark:bg-zinc-800 shadow-lg border-2 border-[#1A365D]/30 rounded-xl">
          <div className="absolute inset-0.5 border border-dashed border-[#1A365D]/20 rounded-lg" />
          <div className="w-full h-full overflow-hidden rounded-lg border border-zinc-100 bg-zinc-100">
            <img src={imgUrl} alt={title} className="w-full h-full object-cover" />
          </div>
        </div>
      );

    case "blob":
      return (
        <div className="relative w-[150px] h-[200px] flex items-center justify-center select-none">
          <div
            className="w-[140px] h-[184px] overflow-hidden border-[5px] border-white shadow-xl bg-zinc-100"
            style={{ borderRadius: "63% 37% 54% 46% / 55% 45% 55% 45%" }}
          >
            <img src={imgUrl} alt={title} className="w-full h-full object-cover" />
          </div>
          <Leaf className="absolute bottom-2 right-2 w-7 h-7 rotate-[15deg] drop-shadow" style={{ color: "#4A6B3D", opacity: 0.55 }} />
        </div>
      );

    default:
      return (
        <div className="w-[150px] h-[200px] overflow-hidden rounded-2xl shadow-md border border-zinc-200/50 bg-zinc-100">
          <img src={imgUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      );
  }
}

export function EnvelopeCover({ invitation, guestName, onOpen }) {
  const theme = invitation?.theme?.slug || "classic-elegance";
  const config = getThemeConfig(theme).cover;

  const groom = invitation?.groomNickname || "Pria";
  const bride = invitation?.brideNickname || "Wanita";
  const title = invitation?.title || `Pernikahan ${groom} & ${bride}`;

  const guestCardClass = config.guestCardShape;

  if (config.layout === "fullbleed") {
    return (
      <motion.div
        {...COVER_TRANSITION}
        className="fixed inset-0 z-60 flex flex-col items-center justify-between py-12 px-6 select-none overflow-hidden bg-[#F8F6F2]"
      >
        {/* Background Photo (Full Screen) */}
        {invitation?.coverUrl && (
          <img
            src={invitation.coverUrl}
            className="absolute inset-0 w-full h-full object-cover z-0"
            alt={title}
          />
        )}

        {/* Dark Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-black/20 z-0" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-black/40 z-0" />

        {/* Ambient Gold Particles (Optional subtle effect) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
          {GOLD_PARTICLES.map((part, i) => (
            <motion.div
              key={`gold-${i}`}
              className="absolute pointer-events-none select-none w-1.5 h-1.5 rounded-full bg-[#FEFCF8] shadow-[0_0_5px_rgba(255,255,255,0.8)]"
              style={{ top: "-5%", left: part.left }}
              animate={{ y: ["0vh", "110vh"], opacity: [0, 0.5, 0] }}
              transition={{ duration: part.dur, repeat: Infinity, delay: part.del, ease: "linear" }}
            />
          ))}
        </div>

        {/* Foreground Content */}
        <div className="relative z-20 flex flex-col h-full w-full items-center justify-between">

          {/* Top Section: Couple Names */}
          <div className="text-center mt-6 sm:mt-12 space-y-2">
            <h1 className="font-heading text-5xl sm:text-6xl text-[#FEFCF8] font-semibold leading-tight drop-shadow-md">
              <span className="block">{groom}</span>
              <span className="block font-greatvibes text-4xl my-1 text-[#FEFCF8] drop-shadow-sm">&amp;</span>
              <span className="block">{bride}</span>
            </h1>
          </div>

          {/* Bottom Section: Guest & CTA */}
          <div className="w-full flex flex-col items-center space-y-6 mb-4 sm:mb-8">
            <div className="text-center space-y-1.5">
              <p className="text-[10px] tracking-[0.25em] font-bold text-white/80 uppercase">
                Kepada Yth.
              </p>
              <p className="text-lg sm:text-xl font-bold text-white drop-shadow-md">
                {guestName || "Tamu Undangan"}
              </p>
            </div>

            <button
              onClick={onOpen}
              className="px-8 py-3.5 bg-[#FEFCF8] hover:bg-white text-[#5C4D3C] text-[11px] font-extrabold tracking-widest uppercase rounded-full shadow-[0_0_20px_rgba(254,252,248,0.2)] transition-all hover:scale-105 active:scale-95"
            >
              Buka Undangan
            </button>
          </div>

        </div>
      </motion.div>
    );
  }

  // ── Cover "GARDEN" (floral-blossom): taman pastel dreamy, dedaunan menjuntai,
  //    nama putih, foto perangko, karangan bunga lebat di dasar. ──
  if (config.layout === "garden") {
    return (
      <motion.div
        {...COVER_TRANSITION}
        className="fixed inset-0 z-60 flex flex-col items-center justify-center overflow-hidden select-none px-6 pt-24 pb-28 gap-4"
      >
        {/* Langit pastel (pink → lavender) */}
        <div
          className="absolute inset-0 z-0"
          style={{ background: "linear-gradient(175deg, #F9E4D3 0%, #F6D7D9 22%, #F0D1DF 46%, #E1CCE8 74%, #D4C6EA 100%)" }}
        />
        {/* Dekor floral: layer PNG fotorealistis bila FLORAL_USE_PNG aktif,
            selain itu ornamen SVG bawaan (fallback aman). */}
        {FLORAL_USE_PNG ? (
          <FloralCoverLayers />
        ) : (
          <>
            {/* Taman pastel lembut */}
            <GardenScene className="absolute inset-0 z-0 h-full w-full" />
            {/* Dedaunan menjuntai dari atas */}
            <HangingLeavesTop className="absolute inset-x-0 top-0 z-10 h-44" />
          </>
        )}

        {/* Hujan kelopak */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden" aria-hidden="true">
          {ROSE_PETALS.map((petal, i) => (
            <motion.div
              key={`petal-${i}`}
              className="absolute pointer-events-none select-none"
              style={{
                top: "-5%",
                left: petal.left,
                width: 10,
                height: 7,
                borderRadius: "50% 0 50% 50%",
                background: "linear-gradient(135deg, #ffccd5 0%, #B76E79 100%)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
              animate={{ y: ["0vh", "110vh"], x: [0, petal.xEnd], rotate: [0, 360], opacity: [0, 0.7, 0] }}
              transition={{ duration: petal.dur, repeat: Infinity, delay: petal.del, ease: "linear" }}
            />
          ))}
        </div>

        {/* Karangan bunga SVG di dasar — hanya bila TIDAK memakai layer PNG
            (saat PNG aktif, bunga dasar sudah dari FloralCoverLayers). */}
        {!FLORAL_USE_PNG && (
          <CoverGardenBorder className="absolute inset-x-0 bottom-0 z-10 h-52" />
        )}

        {/* Konten */}
        <div className="relative z-20 flex w-full max-w-xs flex-col items-center text-center">
          <span className="text-[8px] tracking-[0.35em] uppercase font-semibold text-white/85 drop-shadow-sm">
            The Wedding Of
          </span>
          <h1 className="mt-1 font-greatvibes leading-[1.05] text-white drop-shadow-[0_2px_10px_rgba(130,90,120,0.45)]">
            <span className="block text-4xl sm:text-5xl">{groom}</span>
            <span className="block text-xl my-0.5 opacity-90">&amp;</span>
            <span className="block text-4xl sm:text-5xl">{bride}</span>
          </h1>
        </div>

        <div className="relative z-20 flex items-center justify-center">
          <PhotoFrame frameKind={config.frameKind} coverUrl={invitation?.coverUrl} title={title} />
        </div>

        <div className="relative z-20 flex flex-col items-center text-center">
          <p className="text-[8px] tracking-[0.3em] uppercase font-bold text-white/85 drop-shadow-sm">
            Kepada Yth.
          </p>
          <p className="mt-1 text-base font-bold text-white drop-shadow-[0_1px_6px_rgba(130,90,120,0.4)]">
            {guestName || "Tamu Undangan"}
          </p>
          <div className="my-2 h-px w-10 bg-white/55" />

          <button
            type="button"
            onClick={onOpen}
            aria-label="Buka undangan"
            className="group flex flex-col items-center gap-1 cursor-pointer focus:outline-none"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/20 text-white shadow-lg backdrop-blur-md transition-all"
            >
              <Mail className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
            </motion.div>
            <span className="text-[8px] tracking-[0.35em] font-bold uppercase text-white/90">Buka</span>
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      {...COVER_TRANSITION}
      className="fixed inset-0 z-60 flex flex-col items-center justify-center gap-8 sm:gap-12 py-10 px-4 sm:px-6 select-none overflow-hidden"
    >
      {/* 0. Base solid (OPAQUE) — tirai wajib menutup penuh konten di belakangnya
          selama transisi luncur-naik, agar isi undangan tak "menembus" (mencegah
          efek transisi ganda). Layer paling bawah, di bawah foto blur & overlay. */}
      <div className={`absolute inset-0 z-0 ${config.solid || "bg-[#F8F6F2] dark:bg-zinc-950"}`} />

      {/* 1. Blurred Background Image of Couple */}
      {invitation?.coverUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-xl scale-105 opacity-25 pointer-events-none z-0"
          style={{ backgroundImage: `url(${invitation.coverUrl})` }}
        />
      )}

      {/* 2. Theme Overlay Color Mask */}
      <div className={`absolute inset-0 ${config.bg} z-0 transition-colors duration-500`} />

      {/* 3. Theme-Specific Particle Systems */}
      {config.particleType === "petals" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
          {ROSE_PETALS.map((petal, i) => (
            <motion.div
              key={`petal-${i}`}
              className="absolute pointer-events-none select-none"
              style={{
                top: "-5%",
                left: petal.left,
                width: 10,
                height: 7,
                borderRadius: "50% 0 50% 50%",
                background: "linear-gradient(135deg, #ffccd5 0%, #B76E79 100%)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
              animate={{
                y: ["0vh", "110vh"],
                x: [0, petal.xEnd],
                rotate: [0, 360],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: petal.dur,
                repeat: Infinity,
                delay: petal.del,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {config.particleType === "gold" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
          {GOLD_PARTICLES.map((part, i) => (
            <motion.div
              key={`gold-${i}`}
              className="absolute pointer-events-none select-none w-1.5 h-1.5 rounded-full bg-[#C8A96A]"
              style={{
                top: "-5%",
                left: part.left,
              }}
              animate={{
                y: ["0vh", "110vh"],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: part.dur,
                repeat: Infinity,
                delay: part.del,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {config.particleType === "bubbles" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
          {BLUE_BUBBLES.map((bubble, i) => (
            <motion.div
              key={`bubble-${i}`}
              className="absolute pointer-events-none rounded-full border border-[#1A365D]/20"
              style={{
                top: "105%",
                left: bubble.left,
                width: bubble.w,
                height: bubble.h,
              }}
              animate={{
                y: ["0vh", "-110vh"],
                opacity: [0, 0.4, 0],
                scale: [0.8, 1.2],
              }}
              transition={{
                duration: bubble.dur,
                repeat: Infinity,
                delay: bubble.del,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {config.particleType === "leaves" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
          {GREEN_LEAVES.map((leaf, i) => (
            <motion.div
              key={`leaf-${i}`}
              className="absolute pointer-events-none select-none"
              style={{ top: "-5%", left: leaf.left, fontSize: leaf.fontSize }}
              animate={{
                y: ["0vh", "110vh"],
                x: [0, leaf.xEnd],
                rotate: [0, 300],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: leaf.dur,
                repeat: Infinity,
                delay: leaf.del,
                ease: "linear",
              }}
            >
              🍃
            </motion.div>
          ))}
        </div>
      )}

      {config.particleType === "grid" && (
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-10" aria-hidden="true" />
      )}

      {/* Decorative Wreath / SVG frame behind the content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.04] z-10" aria-hidden="true">
        <svg width="400" height="400" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke={config.ornamentsColor} strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      </div>

      {/* 4. Couple Names (Top Section) */}
      <div className="text-center z-20 space-y-0.5 mt-2">
        <span className={`text-[8px] tracking-[0.35em] uppercase font-bold ${config.textSecondary}`}>
          THE WEDDING OF
        </span>

        {theme === "modern-minimalist" ? (
          <h1 className={`${config.fontName} ${config.textPrimary} tracking-widest leading-none pt-1`}>
            <div>{groom}</div>
            <div className="text-[8px] my-1 text-zinc-500 font-light font-sans tracking-[0.2em]">— AND —</div>
            <div>{bride}</div>
          </h1>
        ) : (
          <h1 className={`${config.fontName} ${config.textPrimary} leading-none tracking-normal pt-1`}>
            <span className="block">{groom}</span>
            <span className="block font-greatvibes text-xl my-0.5 opacity-70 font-normal">&amp;</span>
            <span className="block">{bride}</span>
          </h1>
        )}
      </div>

      {/* 5. Center Photo Frame (Dynamically styled per theme) */}
      <div className="z-20 my-1 flex items-center justify-center">
        <PhotoFrame frameKind={config.frameKind} coverUrl={invitation?.coverUrl} title={title} />
      </div>

      {/* 6. Guest Invitation Card & CTA Button (Bottom Section) */}
      <div className="w-full max-w-xs mx-auto z-20 space-y-3 flex flex-col items-center">
        {/* Guest Name Card */}
        <div className={`py-2 px-3 ${guestCardClass} ${config.cardBg} backdrop-blur-md w-[220px] text-center space-y-1`}>
          <p className={`text-[8px] tracking-[0.25em] uppercase font-bold ${config.cardMuted || "text-zinc-500"}`}>
            Kepada Yth.
          </p>
          <div className="space-y-0.5">
            <h2 className={`text-base font-bold tracking-normal ${config.cardName || "text-zinc-800"}`}>
              {guestName || "Tamu Undangan"}
            </h2>
            <div className="h-[1px] w-8 bg-linear-to-r from-transparent via-current to-transparent mx-auto opacity-30" style={{ color: config.ornamentsColor }} />
          </div>
          <p className={`text-[8px] leading-relaxed font-light px-1 ${config.cardMuted || "text-zinc-500"}`}>
            Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di hari bahagia kami.
          </p>
        </div>

        {/* CTA Buka Button (Circular button + text label below) */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={onOpen}
            aria-label="Buka undangan"
            className="group flex flex-col items-center gap-1 cursor-pointer focus:outline-none"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border border-white/20 transition-all duration-300 ${config.btnColor}`}
            >
              <Mail className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
            </motion.div>
            <span className={`text-[8px] tracking-[0.35em] font-bold uppercase ${config.btnText} mt-0.5`}>
              Buka
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
