"use client";

import { useState } from "react";
import {
  CreditCard,
  Calendar,
  Layers,
  History,
  Sparkles,
  Loader2,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Surface } from "@/components/ui/Surface";
import { Alert } from "@/components/ui/Alert";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FeatureList } from "@/components/ui/FeatureList";
import { formatRupiah, formatLongDate, formatDateTime } from "@/lib/format";
import { SnapScript } from "@/features/payment/components/SnapScript";
import { useMidtransSnap } from "@/features/payment/useMidtransSnap";

export function SubscriptionClient({
  activeSubscription,
  packages,
  transactions,
}) {
  const { pay, loadingId: loadingPackageId } = useMidtransSnap();
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpgrade = (packageId) => {
    setErrorMessage("");
    pay(packageId, { onError: setErrorMessage });
  };


  // Hitung detail langganan saat ini
  const activePackage = activeSubscription?.package;
  const isPremiumActive = activeSubscription && activePackage && activePackage.price > 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Script Snap Midtrans */}
      <SnapScript />

      {/* Header */}
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-gold-400" aria-hidden="true" />
            <span>Paket &amp; Langganan</span>
          </span>
        }
        description="Upgrade paket Anda untuk membuka seluruh fitur premium, menghilangkan watermark, dan mengaktifkan tema eksklusif."
      />

      {errorMessage && <Alert variant="error">{errorMessage}</Alert>}

      {/* Grid Utama: Status Aktif & Daftar Paket */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* Kolom Kiri: Status Paket Aktif Saat Ini */}
        <div className="space-y-6 lg:col-span-1">
          <Surface as="section" className="relative overflow-hidden">
            {isPremiumActive && (
              <Badge
                variant="gold"
                className="absolute right-0 top-0 rounded-none rounded-bl-xl px-3 py-1 tracking-widest"
              >
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                <span>PREMIUM</span>
              </Badge>
            )}

            <h2 className="flex items-center gap-2 border-b border-border/60 pb-3 font-heading text-lg font-bold text-foreground">
              <Layers className="h-5 w-5 text-gold-400" aria-hidden="true" />
              <span>Paket Saat Ini</span>
            </h2>

            <div className="mt-4 space-y-4">
              <div>
                <span className="block text-xs text-muted-foreground">Nama Paket</span>
                <span className="mt-0.5 block font-heading text-xl font-bold text-foreground">
                  {isPremiumActive ? activePackage.name : "Free Trial"}
                </span>
              </div>

              <div>
                <span className="block text-xs text-muted-foreground">Masa Aktif</span>
                {isPremiumActive ? (
                  <div className="mt-1 flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    <span>
                      s.d. {formatLongDate(activeSubscription.validUntil)}
                    </span>
                  </div>
                ) : (
                  <span className="mt-1 block text-sm font-medium text-muted-foreground">
                    Selamanya (Fitur Terbatas &amp; Watermark Aktif)
                  </span>
                )}
              </div>

              <div>
                <span className="block text-xs text-muted-foreground">Kuota Pembuatan Undangan</span>
                <div className="mt-1 flex items-end gap-1.5">
                  <span className="text-2xl font-bold text-foreground">
                    {activeSubscription ? activeSubscription.quotaUsed : 0}
                  </span>
                  <span className="mb-1 text-sm text-muted-foreground">
                    / {isPremiumActive ? activePackage.maxInvitations : 1} Undangan Terpakai
                  </span>
                </div>
              </div>
            </div>
          </Surface>
        </div>

        {/* Kolom Kanan: Pilihan Paket Upgrade */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {packages.map((pkg) => {
              const isCurrent =
                (isPremiumActive && activePackage.id === pkg.id) ||
                (!isPremiumActive && pkg.price === 0);

              const features = Array.isArray(pkg.features)
                ? pkg.features
                : JSON.parse(pkg.features || "[]");

              return (
                <Surface
                  as="article"
                  key={pkg.id}
                  hover={!isCurrent}
                  className={`relative flex flex-col justify-between overflow-hidden ${
                    isCurrent
                      ? "border-gold-400 ring-1 ring-gold-400/30"
                      : "hover:border-gold-400/50"
                  }`}
                >
                  <div>
                    {pkg.price > 0 && !isCurrent && (
                      <Badge
                        variant="goldSoft"
                        className="absolute right-0 top-0 rounded-none rounded-bl-lg"
                      >
                        Populer
                      </Badge>
                    )}

                    <h3 className="font-heading text-base font-bold uppercase tracking-wider text-foreground">
                      {pkg.name}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-heading text-2xl font-extrabold text-foreground">
                        {pkg.price === 0 ? "Gratis" : formatRupiah(pkg.price)}
                      </span>
                      {pkg.price > 0 && (
                        <span className="text-xs text-muted-foreground">
                          / {pkg.durationDays} Hari
                        </span>
                      )}
                    </div>

                    <FeatureList items={features} className="mt-6" />
                  </div>

                  <div className="mt-8">
                    {isCurrent ? (
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        Paket Aktif Anda
                      </Button>
                    ) : pkg.price === 0 ? (
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        Default Free Trial
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleUpgrade(pkg.id)}
                        disabled={loadingPackageId !== null}
                        className="w-full"
                      >
                        {loadingPackageId === pkg.id ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                            <span>Memproses...</span>
                          </>
                        ) : (
                          <>
                            <TrendingUp className="h-4 w-4" aria-hidden="true" />
                            <span>Upgrade Sekarang</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </Surface>
              );
            })}
          </div>
        </div>
      </div>

      {/* Riwayat Tagihan / Pembayaran */}
      <Surface as="section">
        <h2 className="mb-4 flex items-center gap-2 border-b border-border/60 pb-3 font-heading text-lg font-bold text-foreground">
          <History className="h-5 w-5 text-gold-400" aria-hidden="true" />
          <span>Riwayat Pembayaran</span>
        </h2>

        {transactions.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Belum ada riwayat transaksi pembayaran terdaftar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Order ID</th>
                  <th className="px-4 py-3 font-semibold">Paket</th>
                  <th className="px-4 py-3 font-semibold">Nominal</th>
                  <th className="px-4 py-3 font-semibold">Tanggal Transaksi</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((trx) => (
                  <tr key={trx.id} className="border-b border-border/40 hover:bg-gold-400/5">
                    <td className="px-4 py-3.5 font-mono font-medium text-foreground">{trx.midtransOrderId}</td>
                    <td className="px-4 py-3.5 text-foreground">{trx.package.name}</td>
                    <td className="px-4 py-3.5 font-medium text-foreground">{formatRupiah(trx.amount)}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {formatDateTime(trx.createdAt)}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={trx.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Surface>
    </div>
  );
}
