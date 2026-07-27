"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { EnvelopeCover } from "./EnvelopeCover";
import { ThemeRegistry } from "./ThemeRegistry";
import { trackGuestOpenAction, getGuestByCodeAction } from "@/server/actions/guest.actions";

export function PublicInvitationClient({ invitation, initialRsvps, guestName, guestCode }) {
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
    </div>
  );
}
