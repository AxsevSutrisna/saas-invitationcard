"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { EnvelopeCover } from "./EnvelopeCover";
import { ThemeRegistry } from "./ThemeRegistry";

export function PublicInvitationClient({ invitation, initialRsvps, guestName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [rsvps, setRsvps] = useState(initialRsvps || []);
  const audioRef = useRef(null);

  const isMusicEnabled = invitation?.isMusicEnabled && invitation?.musicUrl;

  // Sinkronisasi pemutaran musik latar
  useEffect(() => {
    if (!isMusicEnabled || !audioRef.current) return;

    if (isOpen && !isMuted) {
      audioRef.current.play().catch((err) => {
        console.warn("[AUDIO] Autoplay blocked or failed:", err);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isOpen, isMuted, isMusicEnabled]);

  // Lock body scroll when envelope cover is closed
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.height = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.height = "unset";
    };
  }, [isOpen]);

  const handleOpenInvitation = () => {
    setIsOpen(true);
  };

  const handleRsvpSuccess = (newRsvp) => {
    // Tambahkan RSVP baru di atas daftar buku tamu secara langsung
    setRsvps((prev) => [newRsvp, ...prev]);
  };

  return (
    <div className="relative min-h-screen">
      {/* 1. LAYAR SAMPUL PEMBUKA (Envelope Cover) */}
      <AnimatePresence>
        {!isOpen && (
          <EnvelopeCover
            invitation={invitation}
            guestName={guestName}
            onOpen={handleOpenInvitation}
          />
        )}
      </AnimatePresence>

      {/* 2. THEME COMPONENT RENDERER */}
      {isOpen && (
        <ThemeRegistry
          invitation={invitation}
          rsvps={rsvps}
          guestName={guestName}
          onRsvpSuccess={handleRsvpSuccess}
        />
      )}

      {/* 3. PEMUTAR AUDIO LATAR (HTML5 Audio) */}
      {isMusicEnabled && (
        <>
          <audio
            ref={audioRef}
            src={invitation.musicUrl}
            loop
            preload="auto"
          />

          {/* Floating Audio Controller Widget */}
          {isOpen && (
            <button
              type="button"
              onClick={() => setIsMuted((prev) => !prev)}
              className="fixed bottom-5 right-5 z-40 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800/80 shadow-lg backdrop-blur-sm flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300"
              title={isMuted ? "Mainkan Musik" : "Senyapkan Musik"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 animate-pulse text-zinc-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-zinc-600 dark:text-zinc-300 animate-bounce" />
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}
