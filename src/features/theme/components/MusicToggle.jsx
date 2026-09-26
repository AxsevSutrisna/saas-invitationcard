"use client";

import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

/**
 * MusicToggle bersama — tombol musik fixed di kanan bawah.
 * Warna aksen & background via style inline (bukan class dinamis).
 * Pemanggil bertanggung jawab menggerbang dengan `invitation.isMusicEnabled`.
 */
export function MusicToggle({ isMuted, setIsMuted, accent = "#C8A96A", bg = "#FFFFFF", title }) {
  return (
    <motion.button
      type="button"
      onClick={() => setIsMuted((p) => !p)}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full border-2 shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
      style={{ background: bg, borderColor: accent }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      title={title}
      aria-label={isMuted ? "Nyalakan musik" : "Matikan musik"}
      aria-pressed={!isMuted}
    >
      {isMuted
        ? <VolumeX className="w-5 h-5" style={{ color: accent }} aria-hidden="true" />
        : <Volume2 className="w-5 h-5 animate-pulse" style={{ color: accent }} aria-hidden="true" />}
    </motion.button>
  );
}
