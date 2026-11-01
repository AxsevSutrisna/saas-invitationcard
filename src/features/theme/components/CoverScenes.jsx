"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HangingLeavesTop } from "@/features/theme/components/FloralOrnaments";

/* ═══════════════════ Helper bunga/daun ═══════════════════ */

// Floret 4-kelopak (penyusun hydrangea).
function Floret({ x, y, s, fill }) {
  return (
    <g>
      {[0, 90, 180, 270].map((a) => (
        <ellipse key={a} cx={x} cy={y - 3.2 * s} rx={2.1 * s} ry={3.1 * s} fill={fill} transform={`rotate(${a} ${x} ${y})`} />
      ))}
      <circle cx={x} cy={y} r={1 * s} fill="#F6EDB0" />
    </g>
  );
}

// Hydrangea — gugus floret biru (tema floral-blue).
function Hydrangea({ cx, cy, scale = 1 }) {
  const cols = ["#AEC4E8", "#89A6D6", "#6E8FC7", "#536FA9"];
  const spots = [
    [0, 0, 1], [-9, -2, 0.92], [9, -2, 0.92], [-5, -10, 0.82], [5, -10, 0.82],
    [0, -15, 0.72], [-14, -8, 0.7], [14, -8, 0.7], [-7, 5, 0.82], [7, 5, 0.82], [0, 7, 0.72],
  ];
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      {spots.map(([x, y, s], i) => (
        <Floret key={i} x={x} y={y} s={s} fill={cols[i % cols.length]} />
      ))}
    </g>
  );
}

// Bunga putih sederhana (aksen).
function WhiteBloom({ cx, cy, scale = 1, petals = 6 }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      {Array.from({ length: petals }).map((_, i) => (
        <ellipse key={i} cx="0" cy="-7" rx="3" ry="7" fill="#FFFFFF" stroke="#E7EEF5" strokeWidth="0.4" transform={`rotate(${(360 / petals) * i})`} />
      ))}
      <circle r="2" fill="#F2C76B" />
    </g>
  );
}

// Daun elips (greenery).
function GLeaf({ x, y, rot = 0, len = 18, w = 7, fill = "#6E8B57", op = 0.9 }) {
  return <ellipse cx={x} cy={y} rx={w} ry={len} fill={fill} opacity={op} transform={`rotate(${rot} ${x} ${y})`} />;
}

// Pelepah pakis (tema nature).
function Fern({ cx, cy, scale = 1, rot = 0, fill = "#4A6B3D", fill2 = "#6E8B57" }) {
  const pairs = 7;
  const items = [];
  for (let i = 1; i <= pairs; i++) {
    const t = i / (pairs + 1);
    const y = -i * 9;
    const ll = 14 * (1 - t) + 4;
    items.push(<ellipse key={`l${i}`} cx={-ll * 0.6} cy={y} rx={ll * 0.4} ry={ll} fill={i % 2 ? fill : fill2} opacity="0.9" transform={`rotate(-38 ${-ll * 0.6} ${y})`} />);
    items.push(<ellipse key={`r${i}`} cx={ll * 0.6} cy={y} rx={ll * 0.4} ry={ll} fill={i % 2 ? fill2 : fill} opacity="0.9" transform={`rotate(38 ${ll * 0.6} ${y})`} />);
  }
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale}) rotate(${rot})`}>
      <path d={`M0 0 L0 ${-pairs * 9 - 6}`} stroke={fill} strokeWidth="1.2" opacity="0.7" />
      {items}
    </g>
  );
}

/* ═══════════════════ FLORAL BLUE — taman biru ═══════════════════ */

const BLUE_LEAVES = [
  { x: 16, y: 150, rx: 7, ry: 22, r: -24, c: "#6E8B57" }, { x: 40, y: 162, rx: 6, ry: 18, r: 14, c: "#4A6B3D" },
  { x: 92, y: 158, rx: 7, ry: 20, r: -14, c: "#7E9A6A" }, { x: 150, y: 168, rx: 6, ry: 16, r: 10, c: "#4A6B3D" },
  { x: 240, y: 168, rx: 6, ry: 16, r: -10, c: "#7E9A6A" }, { x: 300, y: 158, rx: 7, ry: 20, r: 14, c: "#4A6B3D" },
  { x: 352, y: 150, rx: 7, ry: 22, r: 24, c: "#6E8B57" }, { x: 374, y: 164, rx: 6, ry: 17, r: -12, c: "#4A6B3D" },
  { x: 200, y: 172, rx: 6, ry: 15, r: 4, c: "#7E9A6A" },
];

export function BlueGardenDecor() {
  const reduce = useReducedMotion();
  return (
    <>
      {/* Langit biru + awan + matahari lembut */}
      <svg className="absolute inset-0 z-0 h-full w-full" viewBox="0 0 390 620" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <circle cx="200" cy="140" r="150" fill="#FFFFFF" opacity="0.5" />
        <ellipse cx="70" cy="300" rx="46" ry="20" fill="#FFFFFF" opacity="0.35" />
        <ellipse cx="320" cy="250" rx="54" ry="22" fill="#FFFFFF" opacity="0.3" />
        <ellipse cx="250" cy="360" rx="40" ry="16" fill="#FFFFFF" opacity="0.25" />
        <path d="M0 470 Q140 440 260 460 T390 452 L390 620 L0 620 Z" fill="#CBD9EC" opacity="0.35" />
      </svg>

      {/* Dedaunan menjuntai (reuse, bergoyang) */}
      <HangingLeavesTop className="absolute inset-x-0 top-0 z-10 h-40" />

      {/* Karangan hydrangea biru di dasar (float lembut) */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 h-48 pointer-events-none"
        aria-hidden="true"
        animate={reduce ? undefined : { y: [0, -5, 0] }}
        transition={reduce ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 390 180" width="100%" height="100%" preserveAspectRatio="xMidYMax slice">
          {BLUE_LEAVES.map((l, i) => (
            <GLeaf key={i} x={l.x} y={l.y} rot={l.r} len={l.ry} w={l.rx} fill={l.c} />
          ))}
          <Hydrangea cx={46} cy={142} scale={1.6} />
          <Hydrangea cx={108} cy={160} scale={1.05} />
          <Hydrangea cx={344} cy={144} scale={1.5} />
          <Hydrangea cx={286} cy={160} scale={1.05} />
          <Hydrangea cx={196} cy={170} scale={0.9} />
          <WhiteBloom cx={82} cy={130} scale={1.25} />
          <WhiteBloom cx={312} cy={130} scale={1.15} />
          <WhiteBloom cx={150} cy={156} scale={0.95} />
          <WhiteBloom cx={244} cy={156} scale={0.95} />
        </svg>
      </motion.div>
    </>
  );
}

/* ═══════════════════ NATURE HARMONY — botani hijau ═══════════════════ */

const NATURE_LEAVES = [
  { x: 14, y: 150, rx: 8, ry: 26, r: -26, c: "#4A6B3D" }, { x: 34, y: 166, rx: 7, ry: 20, r: 12, c: "#2F4A28" },
  { x: 58, y: 154, rx: 9, ry: 27, r: -10, c: "#6E8B57" }, { x: 110, y: 170, rx: 7, ry: 18, r: 18, c: "#2F4A28" },
  { x: 150, y: 160, rx: 8, ry: 22, r: -12, c: "#4A6B3D" }, { x: 200, y: 174, rx: 7, ry: 17, r: 6, c: "#6E8B57" },
  { x: 250, y: 162, rx: 8, ry: 22, r: 12, c: "#4A6B3D" }, { x: 290, y: 170, rx: 7, ry: 18, r: -16, c: "#2F4A28" },
  { x: 330, y: 156, rx: 9, ry: 26, r: 10, c: "#6E8B57" }, { x: 356, y: 152, rx: 8, ry: 25, r: 24, c: "#4A6B3D" },
  { x: 376, y: 166, rx: 7, ry: 19, r: -10, c: "#2F4A28" },
];

export function NatureDecor() {
  const reduce = useReducedMotion();
  return (
    <>
      {/* Latar krem + bukit hijau lembut */}
      <svg className="absolute inset-0 z-0 h-full w-full" viewBox="0 0 390 620" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <circle cx="200" cy="140" r="150" fill="#FBFAF2" opacity="0.6" />
        <path d="M0 440 Q120 408 220 432 T390 422 L390 620 L0 620 Z" fill="#CBD3B4" opacity="0.4" />
        <path d="M0 486 Q150 456 270 480 T390 470 L390 620 L0 620 Z" fill="#B7C79A" opacity="0.45" />
      </svg>

      {/* Dedaunan menjuntai (atas) + pakis di sudut */}
      <HangingLeavesTop className="absolute inset-x-0 top-0 z-10 h-44" />
      <motion.svg
        className="absolute left-0 top-0 z-10 w-40 h-56" viewBox="0 0 160 220" aria-hidden="true"
        style={{ transformOrigin: "20% 0%" }}
        animate={reduce ? undefined : { rotate: [-1.5, 1.5, -1.5] }}
        transition={reduce ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Fern cx={40} cy={210} scale={1.1} rot={-18} />
        <Fern cx={70} cy={215} scale={0.9} rot={6} />
      </motion.svg>
      <motion.svg
        className="absolute right-0 top-0 z-10 w-40 h-56" viewBox="0 0 160 220" aria-hidden="true"
        style={{ transformOrigin: "80% 0%" }}
        animate={reduce ? undefined : { rotate: [1.5, -1.5, 1.5] }}
        transition={reduce ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Fern cx={120} cy={210} scale={1.1} rot={18} />
        <Fern cx={90} cy={215} scale={0.9} rot={-6} />
      </motion.svg>

      {/* Border greenery rimbun di dasar */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 h-48 pointer-events-none"
        aria-hidden="true"
        animate={reduce ? undefined : { y: [0, -4, 0] }}
        transition={reduce ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 390 180" width="100%" height="100%" preserveAspectRatio="xMidYMax slice">
          {NATURE_LEAVES.map((l, i) => (
            <GLeaf key={i} x={l.x} y={l.y} rot={l.r} len={l.ry} w={l.rx} fill={l.c} />
          ))}
          <Fern cx={40} cy={175} scale={1.2} rot={-20} />
          <Fern cx={350} cy={175} scale={1.2} rot={20} />
          <Fern cx={120} cy={178} scale={0.8} rot={-8} />
          <Fern cx={270} cy={178} scale={0.8} rot={8} />
          <WhiteBloom cx={80} cy={150} scale={1.1} />
          <WhiteBloom cx={310} cy={150} scale={1.1} />
          <WhiteBloom cx={200} cy={166} scale={0.95} />
        </svg>
      </motion.div>
    </>
  );
}

/* ═══════════════════ MODERN MINIMALIST — geometris ═══════════════════ */

export function ModernDecor() {
  const reduce = useReducedMotion();
  const ink = "#1E293B";
  const draw = reduce
    ? {}
    : { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 1.8, ease: "easeInOut" } };
  return (
    <>
      {/* Bingkai tipis & garis geometris (draw-in) */}
      <svg className="absolute inset-0 z-10 h-full w-full" viewBox="0 0 390 740" preserveAspectRatio="none" aria-hidden="true">
        {/* Frame tipis inset */}
        <motion.rect x="22" y="22" width="346" height="696" fill="none" stroke={ink} strokeOpacity="0.28" strokeWidth="1" {...draw} />
      </svg>
      {/* Cincin tipis berputar di belakang nama */}
      <motion.svg
        className="absolute left-1/2 top-[30%] z-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 200 200" aria-hidden="true"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={reduce ? undefined : { duration: 60, repeat: Infinity, ease: "linear" }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <circle cx="100" cy="100" r="92" fill="none" stroke={ink} strokeOpacity="0.14" strokeWidth="1" strokeDasharray="2 10" />
        <circle cx="100" cy="100" r="78" fill="none" stroke={ink} strokeOpacity="0.1" strokeWidth="0.6" />
      </motion.svg>
      {/* Garis hairline vertikal di bawah (aksen) + titik */}
      <svg className="absolute inset-x-0 bottom-0 z-10 h-28 w-full" viewBox="0 0 390 112" aria-hidden="true">
        <motion.line x1="195" y1="18" x2="195" y2="86" stroke={ink} strokeOpacity="0.3" strokeWidth="1" {...draw} />
        <motion.circle cx="195" cy="96" r="2.2" fill={ink} fillOpacity="0.4" initial={reduce ? false : { scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.6, duration: 0.5, ease: "backOut" }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        <rect x="150" y="44" width="10" height="10" fill="none" stroke={ink} strokeOpacity="0.25" strokeWidth="1" transform="rotate(45 155 49)" />
        <rect x="230" y="44" width="10" height="10" fill="none" stroke={ink} strokeOpacity="0.25" strokeWidth="1" transform="rotate(45 235 49)" />
      </svg>
    </>
  );
}
