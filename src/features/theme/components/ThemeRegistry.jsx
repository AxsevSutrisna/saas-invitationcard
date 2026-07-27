"use client";

import { ClassicEleganceTheme } from "@/themes/classic-elegance";
import { FloralBlossomTheme } from "@/themes/floral-blossom";
import { ModernMinimalistTheme } from "@/themes/modern-minimalist";
import { FloralBlueTheme } from "@/themes/floral-blue";

/**
 * Registry - Menentukan tema visual mana yang akan digunakan untuk
 * me-render halaman publik undangan berdasarkan data di database.
 */
export function ThemeRegistry({ invitation, rsvps, guestName, onRsvpSuccess, isPreview, guest, isMuted, setIsMuted }) {
  const themeSlug = invitation?.theme?.slug || "classic-elegance";

  const props = {
    invitation,
    rsvps,
    guestName,
    onRsvpSuccess,
    isPreview,
    guest,
    isMuted,
    setIsMuted,
  };

  switch (themeSlug) {
    case "classic-elegance":
      return <ClassicEleganceTheme {...props} />;
    case "floral-blossom":
      return <FloralBlossomTheme {...props} />;
    case "modern-minimalist":
      return <ModernMinimalistTheme {...props} />;
    case "floral-blue":
      return <FloralBlueTheme {...props} />;
    default:
      return <ClassicEleganceTheme {...props} />;
  }
}
