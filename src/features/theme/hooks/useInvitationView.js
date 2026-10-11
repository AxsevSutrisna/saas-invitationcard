"use client";

import { useCarousel } from "@/features/theme/hooks/useCarousel";
import { useClipboard } from "@/features/theme/hooks/useClipboard";

// Kelas hover-lift kartu yang dipakai konsisten lintas tema.
export const INVITATION_CARD_HOVER =
  "transition-all duration-500 hover:-translate-y-1";

/**
 * Prelude data BERSAMA untuk komponen tampilan undangan (TraditionalLayout,
 * ModernMinimalistTheme, NatureHarmonyTheme). Menyatukan boilerplate yang dulu
 * identik di ketiganya: default nama mempelai/galeri, autoplay carousel galeri,
 * dan clipboard. Bayangan kartu (cardShadow) TIDAK di sini karena bergantung
 * warna aksen tiap tema.
 *
 * @param {object} invitation data undangan
 * @returns {{
 *   groom:string, bride:string, groomFull:string, brideFull:string,
 *   galleries:Array, galleryLayout:string,
 *   carousel:{index:number,setIndex:Function,next:Function,prev:Function},
 *   clipboard:{copiedId:string|null,copy:Function},
 *   cardHover:string,
 * }}
 */
export function useInvitationView(invitation) {
  const galleries = invitation?.galleries || [];
  const galleryLayout = invitation?.galleryLayout || "CAROUSEL";

  const carousel = useCarousel(
    galleries.length,
    galleryLayout === "CAROUSEL" ? 4500 : 0
  );
  const clipboard = useClipboard();

  return {
    groom: invitation?.groomNickname || "Pria",
    bride: invitation?.brideNickname || "Wanita",
    groomFull: invitation?.groomFullName || "Nama Pria Lengkap",
    brideFull: invitation?.brideFullName || "Nama Wanita Lengkap",
    galleries,
    galleryLayout,
    carousel,
    clipboard,
    cardHover: INVITATION_CARD_HOVER,
  };
}
