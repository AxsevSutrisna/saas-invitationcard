"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * FloralOrnaments — dekorasi SVG cat-air-esque untuk tema "Floral Blossom"
 * (terinspirasi undangan floral: mawar/peach + dedaunan hijau sage, ornamen
 * filigree, sudut bunga, border taman, dan bunga menjuntai).
 *
 * Semua murni SVG (aset sendiri, tanpa gambar eksternal), diwarnai palet floral
 * tetap (pink/peach/hijau) agar konsisten apa pun warna aksen tema.
 */

export const FLORAL = {
  rose: "#E0919E",
  roseDk: "#C56E7D",
  peach: "#F1B892",
  peachDk: "#E79A72",
  cream: "#FBEFE6",
  leaf: "#7E9A6A",
  leafDk: "#5E7A4E",
};

/**
 * RoseCluster — gugus mawar + dedaunan, berpusat di titik (cx, cy) skala `scale`.
 * Dipakai ulang oleh wreath foto, sudut section, dan border taman.
 */
export function RoseCluster({ cx = 0, cy = 0, scale = 1, opacity = 1 }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`} opacity={opacity}>
      {/* dedaunan di belakang */}
      <ellipse cx="-15" cy="-6" rx="5" ry="12" fill={FLORAL.leafDk} opacity="0.6" transform="rotate(-35 -15 -6)" />
      <ellipse cx="15" cy="-6" rx="5" ry="12" fill={FLORAL.leaf} opacity="0.6" transform="rotate(35 15 -6)" />
      <ellipse cx="0" cy="-13" rx="4.5" ry="11" fill={FLORAL.leaf} opacity="0.5" />
      <ellipse cx="-22" cy="3" rx="4" ry="9" fill={FLORAL.leafDk} opacity="0.45" transform="rotate(-70 -22 3)" />
      <ellipse cx="22" cy="3" rx="4" ry="9" fill={FLORAL.leaf} opacity="0.45" transform="rotate(70 22 3)" />
      {/* mawar */}
      <circle cx="-9" cy="0" r="9" fill={FLORAL.rose} />
      <circle cx="-9" cy="0" r="4.5" fill={FLORAL.roseDk} opacity="0.85" />
      <circle cx="9" cy="-1" r="9" fill={FLORAL.peach} />
      <circle cx="9" cy="-1" r="4.5" fill={FLORAL.peachDk} opacity="0.85" />
      <circle cx="0" cy="8" r="10.5" fill={FLORAL.rose} />
      <circle cx="0" cy="8" r="5.5" fill={FLORAL.roseDk} opacity="0.85" />
      {/* kuncup kecil */}
      <circle cx="-19" cy="6" r="3.5" fill={FLORAL.peach} />
      <circle cx="19" cy="6" r="3.5" fill={FLORAL.rose} />
      <circle cx="0" cy="-5" r="3" fill="#FFFFFF" opacity="0.75" />
    </g>
  );
}

/** FiligreeFlourish — ukel ornamen untuk mengapit label kecil (The Groom/Bride). */
export function FiligreeFlourish({ color = "#5E7152", className = "", flip = false }) {
  return (
    <svg
      width="64"
      height="16"
      viewBox="0 0 64 16"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <path d="M2 8 C16 8, 20 3, 32 8 C42 12, 48 4, 58 8" stroke={color} strokeWidth="1" opacity="0.55" strokeLinecap="round" />
      <path d="M58 8 C60 8, 61 6, 62 8" stroke={color} strokeWidth="1" opacity="0.55" strokeLinecap="round" />
      <path d="M8 8 C8 4, 12 4, 12 8" stroke={color} strokeWidth="0.8" opacity="0.45" />
      <circle cx="32" cy="8" r="1.7" fill={color} opacity="0.7" />
      <circle cx="2" cy="8" r="1.2" fill={color} opacity="0.5" />
    </svg>
  );
}

/** FloralCorner — gugus bunga sudut (pakai `className` untuk posisi absolut).
 *  Beranimasi: fade-in saat muncul + sway lembut terus-menerus (seolah tertiup
 *  angin). Menghormati prefers-reduced-motion. */
export function FloralCorner({ className = "", size = 120, rotate = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "50% 80%" }}
        animate={reduce ? undefined : { rotate: [-2.5, 2.5, -2.5] }}
        transition={reduce ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="78" cy="22" rx="6" ry="15" fill={FLORAL.leaf} opacity="0.45" transform="rotate(40 78 22)" />
        <ellipse cx="24" cy="78" rx="6" ry="15" fill={FLORAL.leafDk} opacity="0.45" transform="rotate(40 24 78)" />
        <RoseCluster cx={42} cy={42} scale={1.25} />
      </motion.g>
    </motion.svg>
  );
}

/** HangingFlorals — rangkaian bunga dengan tangkai menjuntai (bawah arch/kutipan).
 *  Beranimasi: muncul "jatuh" lembut + berayun seperti bandul dari titik gantung
 *  di atas (seolah tertiup angin). Menghormati prefers-reduced-motion. */
export function HangingFlorals({ className = "", width = 260 }) {
  const reduce = useReducedMotion();
  const stems = [
    { x: 96, len: 58, bud: FLORAL.rose },
    { x: 118, len: 84, bud: FLORAL.peach },
    { x: 140, len: 70, bud: FLORAL.rose },
    { x: 164, len: 92, bud: FLORAL.peach },
  ];
  return (
    <motion.svg
      width={width}
      height={width * 0.75}
      viewBox="0 0 260 195"
      fill="none"
      className={className}
      aria-hidden="true"
      initial={reduce ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
        animate={reduce ? undefined : { rotate: [-2, 2, -2] }}
        transition={reduce ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* tangkai menjuntai */}
        {stems.map((s, i) => (
          <g key={i}>
            <path d={`M${s.x} 40 Q${s.x + 4} ${40 + s.len / 2}, ${s.x} ${40 + s.len}`} stroke={FLORAL.leafDk} strokeWidth="0.8" opacity="0.5" />
            <circle cx={s.x} cy={40 + s.len} r="2.6" fill={s.bud} opacity="0.85" />
            <circle cx={s.x + 3} cy={40 + s.len * 0.6} r="1.6" fill={FLORAL.leaf} opacity="0.7" />
          </g>
        ))}
        {/* karangan utama */}
        <RoseCluster cx={80} cy={40} scale={1.4} />
        <RoseCluster cx={180} cy={40} scale={1.4} />
        <RoseCluster cx={130} cy={48} scale={1.7} />
      </motion.g>
    </motion.svg>
  );
}

/** GardenBorder — jajaran taman bunga + rumput untuk dasar hero/cover. */
export function GardenBorder({ className = "" }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 390 96" width="100%" height="100%" fill="none" preserveAspectRatio="xMidYMax slice">
        {/* gundukan hijau */}
        <path d="M0 96 L0 62 Q60 42 120 60 Q190 80 260 56 Q330 36 390 58 L390 96 Z" fill={FLORAL.leaf} opacity="0.45" />
        <path d="M0 96 L0 72 Q80 56 160 70 Q250 86 330 66 Q372 58 390 68 L390 96 Z" fill={FLORAL.leafDk} opacity="0.5" />
        {/* helai rumput */}
        {Array.from({ length: 26 }).map((_, i) => {
          const x = 8 + i * 15;
          return <path key={i} d={`M${x} 96 Q${x + 2} 74, ${x} 66`} stroke={FLORAL.leafDk} strokeWidth="0.8" opacity="0.4" />;
        })}
        {/* gugus mawar di sepanjang taman */}
        <RoseCluster cx={40} cy={66} scale={0.9} />
        <RoseCluster cx={120} cy={62} scale={1.15} />
        <RoseCluster cx={200} cy={66} scale={0.85} />
        <RoseCluster cx={275} cy={60} scale={1.1} />
        <RoseCluster cx={350} cy={66} scale={0.95} />
      </svg>
    </div>
  );
}

// Posisi & timing TETAP (deterministik) → aman dari hydration mismatch SSR.
const LIGHT_MOTES = [
  { left: "12%", size: 5, dur: 9,  del: 0,   drift: 14 },
  { left: "27%", size: 3, dur: 12, del: 2.2, drift: -10 },
  { left: "44%", size: 6, dur: 10, del: 4,   drift: 18 },
  { left: "61%", size: 4, dur: 13, del: 1.2, drift: -14 },
  { left: "77%", size: 5, dur: 11, del: 5,   drift: 12 },
  { left: "90%", size: 3, dur: 14, del: 3.3, drift: -8 },
];

/**
 * FloralAmbience — atmosfer dreamy untuk hero floral: cahaya hangat lembut yang
 * menghanyut pelan + butiran cahaya (seperti serbuk sari) naik dari taman.
 * Semua berbasis transform/opacity (ringan di GPU) & menghormati reduced-motion.
 */
export function FloralAmbience({ className = "" }) {
  const reduce = useReducedMotion();
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* Cahaya hangat yang menghanyut */}
      <motion.div
        className="absolute inset-x-0 top-1/4 mx-auto h-64 w-64 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,228,205,0.55) 0%, rgba(255,228,205,0) 70%)",
          filter: "blur(6px)",
        }}
        animate={reduce ? undefined : { x: [-24, 24, -24], y: [-12, 14, -12], opacity: [0.45, 0.75, 0.45] }}
        transition={reduce ? undefined : { duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Butiran cahaya naik dari dasar (taman) */}
      {LIGHT_MOTES.map((m, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: m.left,
            bottom: 0,
            width: m.size,
            height: m.size,
            background: "rgba(255,249,238,0.95)",
            boxShadow: "0 0 6px 1px rgba(255,235,198,0.75)",
          }}
          animate={reduce ? undefined : { y: [0, -460], x: [0, m.drift, 0], opacity: [0, 0.9, 0] }}
          transition={reduce ? undefined : { duration: m.dur, repeat: Infinity, delay: m.del, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ───────────────────────── ASET COVER "GARDEN" ─────────────────────────
// Dipakai sampul Floral Blossom (latar taman pastel + dedaunan menjuntai +
// karangan bunga lebat), terinspirasi undangan floral — semua aset SVG sendiri.

const rnd = (n) => Math.round(n);

/** Dahlia — bunga pompom berlapis (petal konsentris). */
function Dahlia({ cx, cy, scale = 1, outer = "#EBB0BD", mid = "#DB8C9C", inner = "#C76B7D" }) {
  const ring = (n, r, rx, ry, fill, op) =>
    Array.from({ length: n }).map((_, i) => (
      <ellipse key={`${fill}-${i}`} cx="0" cy={-r} rx={rx} ry={ry} fill={fill} opacity={op} transform={`rotate(${rnd((i / n) * 360)})`} />
    ));
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      {ring(13, 15, 4.5, 9, outer, 0.95)}
      {ring(11, 10, 3.8, 7, mid, 0.95)}
      {ring(8, 5.5, 3, 5, inner, 1)}
      <circle r="2.4" fill="#F4C56C" />
    </g>
  );
}

/** Lily — lili putih 5 kelopak + benang sari. */
function Lily({ cx, cy, scale = 1 }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <path key={i} d="M0 0 C-4 -10 -2.4 -22 0 -27 C2.4 -22 4 -10 0 0 Z" fill="#FFFFFF" stroke="#EFDCE3" strokeWidth="0.4" opacity="0.97" transform={`rotate(${i * 72})`} />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={`s${i}`} transform={`rotate(${i * 72 + 36})`}>
          <line x1="0" y1="0" x2="0" y2="-10" stroke="#E6B85C" strokeWidth="0.7" />
          <circle cx="0" cy="-11" r="1.3" fill="#D98E3C" />
        </g>
      ))}
      <circle r="1.7" fill="#F2C76B" />
    </g>
  );
}

/** Ranting eukaliptus menjuntai (stem Bézier kuadratik + daun sepanjangnya). */
function EucalyptusBranch({ p0, p1, p2, leaves = 9 }) {
  const items = [];
  for (let i = 1; i <= leaves; i++) {
    const t = i / (leaves + 1);
    const mt = 1 - t;
    const x = rnd(mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0]);
    const y = rnd(mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1]);
    const tx = 2 * mt * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
    const ty = 2 * mt * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
    const ang = rnd((Math.atan2(ty, tx) * 180) / Math.PI);
    const s = rnd(6 + 7 * Math.sin(t * Math.PI));
    items.push(
      <g key={i} transform={`translate(${x} ${y}) rotate(${ang})`}>
        <ellipse cx="0" cy={-s} rx={rnd(s * 0.52)} ry={s} fill={i % 2 ? FLORAL.leaf : FLORAL.leafDk} opacity="0.9" />
        <ellipse cx="0" cy={s} rx={rnd(s * 0.52)} ry={s} fill={i % 2 ? FLORAL.leafDk : FLORAL.leaf} opacity="0.85" />
      </g>
    );
  }
  return (
    <g>
      <path d={`M${p0[0]} ${p0[1]} Q${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`} stroke={FLORAL.leafDk} strokeWidth="1.4" fill="none" opacity="0.7" />
      {items}
    </g>
  );
}

/** HangingLeavesTop — dedaunan hijau menjuntai dari tepi atas sampul.
 *  Asimetris: KIRI lebih dominan & lebat (seperti referensi), kanan lebih ringan.
 *  Kedua sisi bergoyang lembut (sway) — menghormati prefers-reduced-motion. */
export function HangingLeavesTop({ className = "" }) {
  const reduce = useReducedMotion();
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 390 160" width="100%" height="100%" fill="none" preserveAspectRatio="xMidYMin slice">
        {/* KIRI — dominan & lebat */}
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "12% 0%" }}
          animate={reduce ? undefined : { rotate: [-1.6, 1.6, -1.6] }}
          transition={reduce ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <EucalyptusBranch p0={[-12, -10]} p1={[110, 24]} p2={[182, 150]} leaves={12} />
          <EucalyptusBranch p0={[-10, -8]} p1={[150, 20]} p2={[150, 120]} leaves={10} />
          <EucalyptusBranch p0={[-12, -8]} p1={[70, 32]} p2={[56, 134]} leaves={9} />
          <EucalyptusBranch p0={[60, -10]} p1={[150, 26]} p2={[106, 108]} leaves={8} />
        </motion.g>
        {/* KANAN — lebih ringan */}
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "88% 0%" }}
          animate={reduce ? undefined : { rotate: [1.3, -1.3, 1.3] }}
          transition={reduce ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <EucalyptusBranch p0={[402, -10]} p1={[300, 24]} p2={[262, 120]} leaves={9} />
          <EucalyptusBranch p0={[352, -10]} p1={[312, 26]} p2={[338, 98]} leaves={6} />
        </motion.g>
      </svg>
    </div>
  );
}

/** GardenScene — latar taman pastel (sun glow + bukit + pepohonan + gazebo tegas
 *  + hamparan lavender padat + air mancur). Opacity rendah → tetap dreamy & teks
 *  terbaca. */
export function GardenScene({ className = "" }) {
  const lavender = [];
  let k = 0;
  for (let row = 0; row < 5; row++) {
    const y = 418 + row * 24;
    const h = 9 + row * 3;
    for (let x = 10; x < 390; x += 13) {
      const xx = x + (row % 2 ? 6 : 0);
      lavender.push(
        <line key={k++} x1={xx} y1={y} x2={xx} y2={y - h} stroke="#9F84C4" strokeWidth="2.4" strokeLinecap="round" opacity={0.3 + row * 0.07} />
      );
    }
  }
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 390 620" width="100%" height="100%" fill="none" preserveAspectRatio="xMidYMid slice">
        {/* cahaya matahari lembut */}
        <circle cx="205" cy="135" r="155" fill="#FFF1E2" opacity="0.55" />
        {/* bukit berlapis */}
        <path d="M0 418 Q120 384 220 410 T390 400 L390 620 L0 620 Z" fill="#E8CBD8" opacity="0.34" />
        <path d="M0 460 Q140 430 260 454 T390 446 L390 620 L0 620 Z" fill="#D9C4E4" opacity="0.42" />
        {/* pepohonan samar */}
        <ellipse cx="44" cy="362" rx="33" ry="48" fill="#C9B79E" opacity="0.3" />
        <ellipse cx="90" cy="380" rx="22" ry="34" fill="#BEAD95" opacity="0.26" />
        <ellipse cx="350" cy="352" rx="31" ry="47" fill="#C7B4A0" opacity="0.3" />
        <ellipse cx="312" cy="378" rx="20" ry="31" fill="#BBA995" opacity="0.26" />
        {/* gazebo (lebih tegas) */}
        <g opacity="0.4" stroke="#A98FBA" strokeWidth="1.6" fill="none">
          <path d="M146 300 Q200 238 254 300 Z" fill="#CDBBDA" opacity="0.45" stroke="none" />
          <path d="M146 300 Q200 238 254 300" />
          <path d="M157 300 Q200 252 243 300" />
          <path d="M169 300 Q200 266 231 300" />
          <line x1="200" y1="238" x2="200" y2="226" />
          <circle cx="200" cy="223" r="3.5" fill="#A98FBA" stroke="none" />
          <line x1="152" y1="300" x2="152" y2="412" />
          <line x1="176" y1="300" x2="176" y2="412" />
          <line x1="224" y1="300" x2="224" y2="412" />
          <line x1="248" y1="300" x2="248" y2="412" />
          <line x1="144" y1="412" x2="256" y2="412" />
          <line x1="150" y1="418" x2="250" y2="418" />
        </g>
        {/* hamparan lavender */}
        <g>{lavender}</g>
        {/* air mancur */}
        <g opacity="0.34" stroke="#B49CC0" strokeWidth="1.4" fill="none">
          <ellipse cx="200" cy="540" rx="44" ry="11" fill="#D2C1DE" opacity="0.5" stroke="none" />
          <path d="M182 540 Q200 520 218 540" />
          <ellipse cx="200" cy="520" rx="17" ry="5" fill="#D2C1DE" opacity="0.5" stroke="none" />
          <line x1="200" y1="520" x2="200" y2="505" />
          <circle cx="200" cy="503" r="4" fill="#D2C1DE" opacity="0.6" stroke="none" />
          <path d="M200 507 Q187 520 189 532" opacity="0.4" />
          <path d="M200 507 Q213 520 211 532" opacity="0.4" />
        </g>
      </svg>
    </div>
  );
}

/** Bud — kuncup kecil bertangkai (pengisi sela karangan). */
function Bud({ cx, cy, scale = 1, c = "#E79CA8" }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <path d="M0 7 L0 -1" stroke={FLORAL.leafDk} strokeWidth="0.8" />
      <ellipse cx="0" cy="-3" rx="2.6" ry="4.4" fill={c} />
      <ellipse cx="0" cy="-3" rx="1.2" ry="3" fill="#FFFFFF" opacity="0.35" />
    </g>
  );
}

// Dedaunan dasar karangan (deterministik) — lebih banyak & besar.
const COVER_LEAVES = [
  { x: 10, y: 160, rx: 8, ry: 26, r: -28, c: "#7E9A6A", o: 0.85 },
  { x: 26, y: 174, rx: 7, ry: 20, r: 12, c: "#5E7A4E", o: 0.82 },
  { x: 44, y: 158, rx: 9, ry: 27, r: -12, c: "#9DB487", o: 0.8 },
  { x: 64, y: 176, rx: 7, ry: 19, r: 22, c: "#5E7A4E", o: 0.78 },
  { x: 86, y: 162, rx: 8, ry: 24, r: -20, c: "#7E9A6A", o: 0.82 },
  { x: 110, y: 180, rx: 7, ry: 18, r: 10, c: "#9DB487", o: 0.76 },
  { x: 134, y: 170, rx: 8, ry: 22, r: -14, c: "#5E7A4E", o: 0.8 },
  { x: 160, y: 184, rx: 7, ry: 17, r: 18, c: "#7E9A6A", o: 0.74 },
  { x: 186, y: 178, rx: 7, ry: 20, r: -8, c: "#9DB487", o: 0.78 },
  { x: 210, y: 186, rx: 7, ry: 18, r: 14, c: "#5E7A4E", o: 0.76 },
  { x: 234, y: 180, rx: 8, ry: 21, r: -16, c: "#7E9A6A", o: 0.8 },
  { x: 258, y: 186, rx: 7, ry: 17, r: 8, c: "#9DB487", o: 0.74 },
  { x: 282, y: 176, rx: 8, ry: 22, r: -22, c: "#5E7A4E", o: 0.8 },
  { x: 306, y: 162, rx: 9, ry: 26, r: 10, c: "#9DB487", o: 0.82 },
  { x: 330, y: 178, rx: 7, ry: 20, r: -12, c: "#5E7A4E", o: 0.8 },
  { x: 352, y: 160, rx: 8, ry: 26, r: 26, c: "#7E9A6A", o: 0.85 },
  { x: 374, y: 174, rx: 7, ry: 19, r: -10, c: "#5E7A4E", o: 0.8 },
  { x: 382, y: 158, rx: 7, ry: 22, r: 30, c: "#9DB487", o: 0.78 },
  { x: 20, y: 184, rx: 6, ry: 14, r: 34, c: "#9DB487", o: 0.7 },
  { x: 72, y: 188, rx: 6, ry: 15, r: -30, c: "#5E7A4E", o: 0.7 },
  { x: 200, y: 160, rx: 7, ry: 19, r: 4, c: "#7E9A6A", o: 0.72 },
  { x: 320, y: 190, rx: 6, ry: 14, r: -34, c: "#9DB487", o: 0.7 },
  { x: 148, y: 158, rx: 7, ry: 20, r: -6, c: "#7E9A6A", o: 0.7 },
  { x: 268, y: 160, rx: 7, ry: 20, r: 6, c: "#5E7A4E", o: 0.72 },
  { x: 100, y: 190, rx: 6, ry: 13, r: 28, c: "#9DB487", o: 0.68 },
  { x: 356, y: 188, rx: 6, ry: 14, r: -26, c: "#7E9A6A", o: 0.7 },
];

/** CoverGardenBorder — karangan bunga LEBAT (dahlia/lili/mawar/kuncup) di dasar
 *  sampul: dua rumpun besar di sudut + sambungan di tengah (seperti referensi). */
export function CoverGardenBorder({ className = "" }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 390 200" width="100%" height="100%" fill="none" preserveAspectRatio="xMidYMax slice">
        {COVER_LEAVES.map((l, i) => (
          <ellipse key={i} cx={l.x} cy={l.y} rx={l.rx} ry={l.ry} fill={l.c} opacity={l.o} transform={`rotate(${l.r} ${l.x} ${l.y})`} />
        ))}
        {/* mawar */}
        <RoseCluster cx={54} cy={150} scale={1.3} />
        <RoseCluster cx={120} cy={168} scale={0.95} />
        <RoseCluster cx={336} cy={152} scale={1.25} />
        <RoseCluster cx={274} cy={170} scale={0.95} />
        <RoseCluster cx={168} cy={184} scale={0.8} />
        <RoseCluster cx={228} cy={186} scale={0.82} />
        {/* dahlia pink & peach (besar) */}
        <Dahlia cx={28} cy={158} scale={1.5} />
        <Dahlia cx={96} cy={172} scale={1.15} outer="#F1C6A6" mid="#E8A87C" inner="#DA8A5C" />
        <Dahlia cx={150} cy={184} scale={0.95} />
        <Dahlia cx={364} cy={160} scale={1.45} />
        <Dahlia cx={298} cy={174} scale={1.1} outer="#F1C6A6" mid="#E8A87C" inner="#DA8A5C" />
        <Dahlia cx={244} cy={186} scale={0.9} />
        {/* lili putih */}
        <Lily cx={78} cy={146} scale={1.3} />
        <Lily cx={134} cy={166} scale={1.0} />
        <Lily cx={316} cy={144} scale={1.25} />
        <Lily cx={200} cy={180} scale={1.05} />
        {/* kuncup pengisi */}
        <Bud cx={44} cy={140} scale={1.2} />
        <Bud cx={110} cy={150} scale={1.0} c="#F0B48C" />
        <Bud cx={350} cy={138} scale={1.2} />
        <Bud cx={286} cy={150} scale={1.0} c="#F0B48C" />
        <Bud cx={190} cy={166} scale={0.9} />
      </svg>
    </div>
  );
}
