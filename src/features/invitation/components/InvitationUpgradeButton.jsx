"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Sparkles, TrendingUp, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import { createCheckoutAction } from "@/features/payment/actions";

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
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");

  const handlePay = async (packageId) => {
    try {
      setError("");
      setLoadingId(packageId);

      const result = await createCheckoutAction(packageId, { invitationId });
      if (!result.success) throw new Error(result.error || "Gagal membuat transaksi.");

      if (!window.snap) {
        throw new Error("Midtrans Snap belum siap. Muat ulang halaman lalu coba lagi.");
      }

      window.snap.pay(result.data.token, {
        onSuccess: () => {
          setOpen(false);
          router.refresh();
        },
        onPending: () => {
          setOpen(false);
          router.refresh();
        },
        onError: () => setError("Pembayaran gagal diproses oleh Midtrans."),
        onClose: () => {},
      });
    } catch (e) {
      setError(e.message || "Terjadi kesalahan pembayaran.");
    } finally {
      setLoadingId(null);
    }
  };

  if (packages.length === 0) return null;

  return (
    <>
      <Button
        size="sm"
        variant="secondary"
        className="w-full"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
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

        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-xs text-destructive"
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

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
              <div
                key={pkg.id}
                className="rounded-2xl border border-border/60 p-4 transition-colors hover:border-gold-400/60"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
                        {pkg.name}
                      </h4>
                      {KIND_BADGE[pkg.kind] && <Badge variant="neutral">{KIND_BADGE[pkg.kind]}</Badge>}
                      {pkg.isHighlighted && <Badge variant="goldSoft">Populer</Badge>}
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-heading text-xl font-extrabold text-foreground">
                        {formatRupiah(pkg.price)}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        / {pkg.durationDays} hari
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handlePay(pkg.id)}
                    disabled={loadingId !== null}
                  >
                    {loadingId === pkg.id ? (
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
                </div>

                {features.length > 0 && (
                  <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {features.slice(0, 6).map((feat, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                        <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" aria-hidden="true" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
