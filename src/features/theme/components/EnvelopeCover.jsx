"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";

// Fixed configs for background elements to avoid SSR hydration mismatches
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

const THEME_CONFIG = {
  "classic-elegance": {
    bg: "bg-[#F8F6F2]/90 dark:bg-zinc-950/90",
    textPrimary: "text-[#C8A96A]",
    textSecondary: "text-zinc-500 dark:text-zinc-400",
    fontName: "font-greatvibes text-3xl sm:text-4xl font-medium",
    cardBg: "bg-white/80 dark:bg-zinc-900/80 border-[#C8A96A]/20 shadow-xl",
    btnColor: "bg-[#C8A96A] text-white hover:bg-[#b39150] hover:shadow-[#C8A96A]/35",
    btnText: "text-[#C8A96A]",
    ornamentsColor: "#C8A96A",
  },
  "floral-blossom": {
    bg: "bg-[#F8F6F2]/90 dark:bg-zinc-950/90",
    textPrimary: "text-[#B76E79]",
    textSecondary: "text-zinc-500 dark:text-zinc-400",
    fontName: "font-greatvibes text-3xl sm:text-4xl font-medium",
    cardBg: "bg-white/85 dark:bg-zinc-900/80 border-[#B76E79]/20 shadow-xl",
    btnColor: "bg-[#B76E79] text-white hover:bg-[#a65f6a] hover:shadow-[#B76E79]/35",
    btnText: "text-[#B76E79]",
    ornamentsColor: "#B76E79",
  },
  "modern-minimalist": {
    bg: "bg-[#0F172A]/90 dark:bg-[#090d16]/95",
    textPrimary: "text-zinc-100",
    textSecondary: "text-zinc-400",
    fontName: "font-sans font-black text-xl sm:text-2xl tracking-widest uppercase",
    cardBg: "bg-slate-900/90 dark:bg-zinc-900/90 border-slate-700/60 shadow-2xl",
    btnColor: "bg-zinc-100 text-slate-950 hover:bg-white hover:shadow-white/20",
    btnText: "text-zinc-200",
    ornamentsColor: "#FFFFFF",
  },
  "floral-blue": {
    bg: "bg-[#E8F4FD]/90 dark:bg-[#0b1420]/90",
    textPrimary: "text-[#1A365D]",
    textSecondary: "text-zinc-500 dark:text-zinc-400",
    fontName: "font-greatvibes text-3xl sm:text-4xl font-medium",
    cardBg: "bg-white/80 dark:bg-zinc-900/80 border-[#1A365D]/20 shadow-xl",
    btnColor: "bg-[#1A365D] text-white hover:bg-[#122744] hover:shadow-[#1A365D]/35",
    btnText: "text-[#1A365D]",
    ornamentsColor: "#1A365D",
  },
};

function PhotoFrame({ theme, coverUrl, title }) {
  const defaultPlaceholder = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600";
  const imgUrl = coverUrl || defaultPlaceholder;

  switch (theme) {
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

    case "classic-elegance":
      return (
        <div className="relative w-[150px] h-[200px] p-1 bg-white dark:bg-zinc-800 shadow-xl border border-[#C8A96A]/60 rounded-md">
          <div className="absolute inset-0.5 border border-dashed border-[#C8A96A]/40" />
          <div className="w-full h-full overflow-hidden rounded-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-100">
            <img src={imgUrl} alt={title} className="w-full h-full object-cover" />
          </div>
        </div>
      );

    case "modern-minimalist":
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
  const config = THEME_CONFIG[theme] || THEME_CONFIG["classic-elegance"];

  const groom = invitation?.groomNickname || "Pria";
  const bride = invitation?.brideNickname || "Wanita";
  const title = invitation?.title || `Pernikahan ${groom} & ${bride}`;

  const guestCardClass = theme === "modern-minimalist" ? "rounded-none" : "rounded-2xl";

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-between py-4 sm:py-8 px-4 sm:px-6 select-none overflow-hidden"
    >
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
      {theme === "floral-blossom" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
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

      {theme === "classic-elegance" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
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

      {theme === "floral-blue" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
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

      {theme === "modern-minimalist" && (
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-10" />
      )}

      {/* Decorative Wreath / SVG frame behind the content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.04] z-10">
        <svg width="400" height="400" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke={config.ornamentsColor} strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      </div>

      {/* 4. Couple Names (Top Section) */}
      <div className="text-center z-20 space-y-0.5 mt-2">
        <span className="text-[8px] tracking-[0.35em] uppercase font-bold text-muted-foreground opacity-70">
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
        <PhotoFrame theme={theme} coverUrl={invitation?.coverUrl} title={title} />
      </div>

      {/* 6. Guest Invitation Card & CTA Button (Bottom Section) */}
      <div className="w-full max-w-xs mx-auto z-20 space-y-3 flex flex-col items-center">
        {/* Guest Name Card */}
        <div className={`py-2 px-3 ${guestCardClass} ${config.cardBg} backdrop-blur-md w-[220px] text-center space-y-1`}>
          <p className="text-[8px] tracking-[0.25em] uppercase font-bold text-muted-foreground opacity-75">
            Kepada Yth.
          </p>
          <div className="space-y-0.5">
            <h2 className="text-base font-bold tracking-normal text-foreground">
              {guestName || "Tamu Undangan"}
            </h2>
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent via-[#C8A96A] to-transparent mx-auto opacity-40" />
          </div>
          <p className="text-[8px] text-muted-foreground leading-relaxed font-light px-1">
            Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di hari bahagia kami.
          </p>
        </div>

        {/* CTA Buka Button (Circular button + text label below) */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={onOpen}
            className="group flex flex-col items-center gap-1 cursor-pointer focus:outline-none"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border border-white/20 transition-all duration-300 ${config.btnColor}`}
            >
              <Mail className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" />
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
