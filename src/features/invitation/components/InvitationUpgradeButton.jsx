"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { PackageCard } from "@/components/ui/PackageCard";
import { Sparkles, TrendingUp, Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";

const KIND_BADGE = { BUNDLE: "Bundle", ADDON: "Add-on" };

/**
 * Tombol "Upgrade undangan ini" (pembelian ECERAN per-undangan).
 * Membuka pemilih paket → checkout Midtrans Snap dengan invitationId →
 * webhook menerbitkan Entitlement(PURCHASE) untuk undangan ini.
 *
 * SDK Snap (window.snap) dimuat sekali di level halaman dashboard.
 *
 * @param {{ invitationId: string, invitationTitle?: string, packages: Array }} props
 */
export function InvitationUpgradeButton({ invitationId, invitationTitle, packages = [] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [navigatingId, setNavigatingId] = useState(null);

  // Checkout eceran per-undangan → halaman pembayaran custom (Core API).
  const handlePay = (packageId) => {
    setNavigatingId(packageId);
    router.push(`${ROUTES.PAYMENT_CHECKOUT}?package=${packageId}&invitation=${invitationId}`);
  };

  if (packages.length === 0) return null;

  return (
    <>
      <Button
        size="sm"
        variant="secondary"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Upgrade undangan ini</span>
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        labelledBy="upgrade-modal-title"
        panelClassName="relative w-full max-w-lg space-y-5 rounded-3xl border border-border/60 bg-card p-6 shadow-2xl sm:p-8 max-h-[90vh] overflow-y-auto"
        showClose
      >
        <div>
          <h3 id="upgrade-modal-title" className="font-heading text-lg font-bold text-foreground">
            Upgrade Undangan
          </h3>
          {invitationTitle && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{invitationTitle}</p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            Pilih paket untuk membuka fitur premium &amp; menghilangkan watermark pada undangan ini.
          </p>
        </div>

        <div className="space-y-3">
          {packages.map((pkg) => {
            const features = Array.isArray(pkg.features)
              ? pkg.features
              : (() => {
                  try {
                    return JSON.parse(pkg.features || "[]");
                  } catch {
                    return [];
                  }
                })();

            return (
              <PackageCard
                key={pkg.id}
                name={pkg.name}
                price={pkg.price}
                period={`/ ${pkg.durationDays} hari`}
                highlighted={pkg.isHighlighted}
                badges={
                  <>
                    {KIND_BADGE[pkg.kind] && <Badge variant="neutral">{KIND_BADGE[pkg.kind]}</Badge>}
                    {pkg.isHighlighted && <Badge variant="goldSoft">Populer</Badge>}
                  </>
                }
                features={features}
                featuresMax={6}
                featuresClassName="grid grid-cols-1 gap-1.5 sm:grid-cols-2"
                headerRight={
                  <Button size="sm" onClick={() => handlePay(pkg.id)} disabled={navigatingId !== null}>
                    {navigatingId === pkg.id ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                        <span>Memproses</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4" aria-hidden="true" />
                        <span>Bayar</span>
                      </>
                    )}
                  </Button>
                }
              />
            );
          })}
        </div>
      </Modal>
    </>
  );
}
