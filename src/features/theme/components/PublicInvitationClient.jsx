"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { EnvelopeCover } from "./EnvelopeCover";
import { ThemeRegistry } from "./ThemeRegistry";
import { trackGuestOpenAction, getGuestByCodeAction } from "@/server/actions/guest.actions";

export function PublicInvitationClient({ invitation, initialRsvps, guestName, guestCode, isPremium = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [rsvps, setRsvps] = useState(initialRsvps || []);
  const [guest, setGuest] = useState(null);
  const audioRef = useRef(null);

  const isMusicEnabled = invitation?.isMusicEnabled && invitation?.musicUrl;

  useEffect(() => {
    if (guestCode) {
      trackGuestOpenAction(guestCode).catch((err) => {
        console.error("Failed to track guest open:", err);
      });
      getGuestByCodeAction(guestCode).then((res) => {
        if (res.success && res.data) {
          setGuest(res.data);
        }
      }).catch((err) => {
        console.error("Failed to fetch guest details:", err);
      });
    }
  }, [guestCode]);

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

    // Kirim analitik kunjungan secara silent di latar belakang
    if (invitation?.id) {
      fetch("/api/v1/analytics/visit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invitationId: invitation.id,
          referrer: typeof document !== "undefined" ? document.referrer : "Direct",
        }),
      }).catch((err) => {
        console.error("Gagal melacak kunjungan analitik:", err);
      });
    }
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
          guest={guest}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
        />
      )}

      {/* 3. PEMUTAR AUDIO LATAR (HTML5 Audio) */}
      {isMusicEnabled && (
        <audio
          ref={audioRef}
          src={invitation.musicUrl}
          loop
          preload="auto"
        />
      )}

      {/* 4. WATERMARK UNTUK PENGGUNA GRATIS */}
      {isOpen && !isPremium && (
        <div className="w-full py-6 text-center bg-zinc-50 dark:bg-zinc-900 border-t border-border/40 text-[10px] tracking-wider text-muted-foreground font-semibold uppercase flex items-center justify-center gap-1.5 z-40 relative">
          <span>Powered by</span>
          <span className="text-[#C8A96A] font-heading font-bold text-xs tracking-widest">IKARA</span>
          <span className="text-[8px] font-normal lowercase opacity-60">— Every Promise Has a Story</span>
        </div>
      )}
    </div>
  );
}
