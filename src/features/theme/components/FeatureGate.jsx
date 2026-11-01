"use client";

import { createContext, useContext } from "react";
import { Lock } from "lucide-react";
import { hasFeature } from "@/features/entitlement/featureMap";

/**
 * Konteks hak akses untuk render tema.
 *   - `featureMap`: peta fitur efektif undangan (boolean/quota). `null` = tidak
 *     digating (fail-open) — mis. pratinjau tema dgn data contoh menampilkan
 *     semua section.
 *   - `preview`: true saat pemilik melihat pratinjau di editor. Section yang
 *     tak berhak tampil TERKUNCI + ajakan upgrade (bukan disembunyikan),
 *     sedangkan untuk tamu (preview=false) section itu disembunyikan total.
 */
const FeatureCtx = createContext({ featureMap: null, preview: false });

export function FeatureProvider({ featureMap = null, preview = false, children }) {
  return (
    <FeatureCtx.Provider value={{ featureMap, preview }}>{children}</FeatureCtx.Provider>
  );
}

/** Resolusi akses satu fitur BOOLEAN pada konteks aktif. */
export function useFeatureAccess(feature) {
  const { featureMap, preview } = useContext(FeatureCtx);
  // Tanpa provider / tanpa peta → jangan gating (fail-open).
  const entitled = featureMap == null ? true : hasFeature(featureMap, feature);
  return { entitled, preview, gated: featureMap != null };
}

/**
 * Pembungkus gating per-section.
 *   - berhak                      → tampilkan apa adanya.
 *   - tak berhak & bukan preview  → null (disembunyikan dari tamu).
 *   - tak berhak & preview        → tampil terkunci (blur) + ajakan upgrade,
 *                                    kecuali `soft` (mis. tombol kecil) yang
 *                                    tetap tampil polos di preview.
 *
 * @param {{ feature: string, label?: string, soft?: boolean, children: React.ReactNode }} props
 */
export function FeatureGate({ feature, label, soft = false, children }) {
  const { entitled, preview } = useFeatureAccess(feature);

  if (entitled) return children;
  if (!preview) return null;
  if (soft) return children;
  if (!children) return null; // tak ada konten → tak perlu overlay kunci

  return (
    <div className="relative" aria-label={`${label || "Fitur premium"} terkunci`}>
      <div className="pointer-events-none select-none blur-[3px] opacity-50" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
        <div className="flex max-w-xs flex-col items-center gap-2 rounded-2xl border border-gold-400/40 bg-white/90 px-5 py-4 text-center shadow-lg backdrop-blur-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400/15 text-gold-600">
            <Lock className="h-4 w-4" aria-hidden="true" />
          </span>
          <p className="text-xs font-bold text-zinc-800">{label || "Fitur Premium"}</p>
          <p className="text-[11px] leading-snug text-zinc-500">
            Belum termasuk paket undangan ini — tidak tampil ke tamu. Upgrade untuk mengaktifkan.
          </p>
        </div>
      </div>
    </div>
  );
}
