"use client";

import { motion } from "framer-motion";

// Warna default per tipe partikel (setara dengan warna hardcoded di desain asli).
const DEFAULT_COLORS = {
  gold: "#C8A96A",
  petals: "#B76E79",
  bubbles: "#1A365D",
  leaves: "#4A6B3D",
};

// ─────────── GOLD PARTICLES (classic) ───────────
// Fixed configs to avoid SSR hydration mismatch
const PARTICLE_CONFIGS = [
  { dur: 9,  del: 0   }, { dur: 13, del: 2   }, { dur: 11, del: 4   },
  { dur: 15, del: 1   }, { dur: 10, del: 6   }, { dur: 14, del: 3   },
  { dur: 12, del: 5   }, { dur: 9,  del: 7   }, { dur: 16, del: 1.5 },
  { dur: 11, del: 8   }, { dur: 13, del: 4   }, { dur: 10, del: 9   },
  { dur: 9,  del: 2.5 }, { dur: 15, del: 6.5 }, { dur: 12, del: 0.5 },
];

// Fixed particle positions (deterministic, no Math.random on render)
const PARTICLE_POSITIONS = [
  { left: "4%" }, { left: "11%" }, { left: "18%" }, { left: "25%" }, { left: "32%" },
  { left: "39%" }, { left: "46%" }, { left: "53%" }, { left: "60%" }, { left: "67%" },
  { left: "74%" }, { left: "81%" }, { left: "88%" }, { left: "93%" }, { left: "97%" },
];

function GoldParticle({ style, color, dur = 10, del = 0 }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none w-1.5 h-1.5 rounded-full opacity-0"
      style={{ ...style, background: color }}
      animate={{ y: ["0vh", "110vh"], opacity: [0, 0.5, 0] }}
      transition={{ duration: dur, repeat: Infinity, delay: del, ease: "linear" }}
    />
  );
}

// ─────────── FALLING PETALS (blossom) ───────────
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

function FallingPetal({ style, color, xEnd = 40, dur = 10, del = 0 }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ ...style, color }}
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

// ─────────── BUBBLES (blue) ───────────
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

function Bubble({ style, color, dur = 12, del = 0 }) {
  return (
    <motion.div
      className="absolute pointer-events-none rounded-full border"
      style={{ ...style, borderColor: `${color}33` }}
      animate={{ y: ["0vh", "-120vh"], opacity: [0, 0.4, 0], scale: [0.8, 1.2] }}
      transition={{ duration: dur, repeat: Infinity, delay: del, ease: "linear" }}
    />
  );
}

// ─────────── FALLING LEAVES (nature) ───────────
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

/**
 * ParticleField — sistem partikel ambient fullscreen sesuai tipe tema.
 * type: "gold" | "petals" | "bubbles" | "leaves" | null (null → tidak merender apa pun).
 * accent (opsional) menimpa warna default partikel.
 */
export function ParticleField({ type, accent }) {
  if (!type) return null;
  const color = accent || DEFAULT_COLORS[type];

  if (type === "gold") {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        {PARTICLE_POSITIONS.map((p, i) => (
          <GoldParticle key={i} style={{ left: p.left, top: "-10px" }} color={color} dur={PARTICLE_CONFIGS[i].dur} del={PARTICLE_CONFIGS[i].del} />
        ))}
      </div>
    );
  }

  if (type === "petals") {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        {PETAL_POSITIONS.map((p, i) => (
          <FallingPetal key={i} style={{ left: p.left, top: p.top, fontSize: p.fontSize }} color={color} xEnd={PETAL_CONFIGS[i].xEnd} dur={PETAL_CONFIGS[i].dur} del={PETAL_CONFIGS[i].del} />
        ))}
      </div>
    );
  }

  if (type === "bubbles") {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        {BUBBLE_POSITIONS.map((b, i) => (
          <Bubble key={i} style={{ left: b.left, bottom: b.bottom, width: BUBBLE_CONFIGS[i].w, height: BUBBLE_CONFIGS[i].h }} color={color} dur={BUBBLE_CONFIGS[i].dur} del={BUBBLE_CONFIGS[i].del} />
        ))}
      </div>
    );
  }

  if (type === "leaves") {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
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
    );
  }

  return null;
}
