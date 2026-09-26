"use client";

import { TraditionalLayout } from "@/features/theme/layouts/TraditionalLayout";
import { ModernMinimalistTheme } from "@/features/theme/designs/modern-minimalist";
import { NatureHarmonyTheme } from "@/features/theme/designs/nature-harmony";
import { getThemeConfig } from "@/features/theme/theme-config";

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
    case "floral-blossom":
    case "floral-blue":
      return <TraditionalLayout config={getThemeConfig(themeSlug)} {...props} />;
    case "modern-minimalist":
      return <ModernMinimalistTheme {...props} />;
    case "nature-harmony":
      return <NatureHarmonyTheme {...props} />;
    default:
      return <TraditionalLayout config={getThemeConfig("classic-elegance")} {...props} />;
  }
}
