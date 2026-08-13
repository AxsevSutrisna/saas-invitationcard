"use client";

import { ClassicEleganceTheme } from "@/themes/classic-elegance";
import { FloralBlossomTheme } from "@/themes/floral-blossom";
import { ModernMinimalistTheme } from "@/themes/modern-minimalist";
import { FloralBlueTheme } from "@/themes/floral-blue";
import { NatureHarmonyTheme } from "@/themes/nature-harmony";

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
    case "nature-harmony":
      return <NatureHarmonyTheme {...props} />;
    default:
      return <ClassicEleganceTheme {...props} />;
  }
}
