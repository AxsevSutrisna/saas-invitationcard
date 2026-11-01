"use client";

import { TraditionalLayout } from "@/features/theme/layouts/TraditionalLayout";
import { ModernMinimalistTheme } from "@/features/theme/designs/modern-minimalist";
import { NatureHarmonyTheme } from "@/features/theme/designs/nature-harmony";
import { FeatureProvider } from "@/features/theme/components/FeatureGate";
import { getThemeConfig } from "@/features/theme/theme-config";

/**
 * Peta renderer → komponen. Nilai `renderer` diambil dari THEME_CONFIG.
 *
 * Menambah tema dengan LAYOUT yang sudah ada (mis. "traditional") cukup
 * menambah entri di THEME_CONFIG — file ini TIDAK perlu disentuh.
 * File ini hanya berubah bila memperkenalkan LAYOUT/renderer baru.
 */
const RENDERERS = {
  traditional: TraditionalLayout,
  modern: ModernMinimalistTheme,
  nature: NatureHarmonyTheme,
};

export function ThemeRegistry({
  invitation,
  rsvps,
  guestName,
  onRsvpSuccess,
  guest,
  isMuted,
  setIsMuted,
  featureMap = null,
  preview = false,
}) {
  const themeSlug = invitation?.theme?.slug || "classic-elegance";
  const config = getThemeConfig(themeSlug); // fallback ke classic-elegance
  const Renderer = RENDERERS[config.renderer] || TraditionalLayout;

  // Gating hak akses per-section disediakan lewat konteks (FeatureProvider),
  // supaya tiap tema cukup membungkus section dengan <FeatureGate> tanpa
  // prop-drilling. `featureMap` null = tak digating (mis. pratinjau tema).
  return (
    <FeatureProvider featureMap={featureMap} preview={preview}>
      <Renderer
        config={config}
        invitation={invitation}
        rsvps={rsvps}
        guestName={guestName}
        onRsvpSuccess={onRsvpSuccess}
        guest={guest}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />
    </FeatureProvider>
  );
}
