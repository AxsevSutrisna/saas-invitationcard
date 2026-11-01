"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Calendar,
  Layers,
  History,
  Sparkles,
  Loader2,
  TrendingUp,
  Gift,
  Store,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Surface } from "@/components/ui/Surface";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FeatureList } from "@/components/ui/FeatureList";
import { formatRupiah, formatLongDate, formatDateTime } from "@/lib/format";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

/** Parse fitur paket (string JSON atau array) dengan aman. */
function parseFeatures(pkg) {
  if (Array.isArray(pkg.features)) return pkg.features;
  try {
    return JSON.parse(pkg.features || "[]");
  } catch {
    return [];
  }
}

/** Teks periode harga paket. */
function periodText(pkg) {
  if (pkg.price === 0) return "selamanya";
  if (pkg.saleType === "SUBSCRIPTION") return "/ bulan";
  return `/ ${pkg.durationDays} hari`;
}

const KIND_TAG = { ADDON: "Add-on", BUNDLE: "Paket Hemat", RESELLER: "Vendor" };

export function SubscriptionClient({ activeSubscription, packages, transactions }) {
  const router = useRouter();
  const [navigatingId, setNavigatingId] = useState(null);

  // Arahkan ke halaman checkout custom (Core API) — bukan popup Snap.
  const goToCheckout = (pkg) => {
    setNavigatingId(pkg.id);
    router.push(`${ROUTES.PAYMENT_CHECKOUT}?package=${pkg.id}`);
  };

  // --- Status langganan saat ini -------------------------------------------
  const activePackage = activeSubscription?.package;
  const isPremiumActive = Boolean(activeSubscription && activePackage && activePackage.price > 0);

  const quotaUsed = activeSubscription ? activeSubscription.quotaUsed : 0;
  const quotaMax = isPremiumActive ? activePackage.maxInvitations : 1;
  const quotaUnlimited = isPremiumActive && (!quotaMax || quotaMax <= 0);
  const quotaPct =
    !quotaUnlimited && quotaMax > 0
      ? Math.min(100, Math.round((quotaUsed / quotaMax) * 100))
      : 0;

  // --- Kelompokkan paket per jenis ------------------------------------------
  const resellers = packages.filter((p) => p.saleType === "RESELLER");
  const plans = packages.filter((p) => p.kind === "PLAN" && p.saleType !== "RESELLER");
  const extras = packages.filter(
    (p) => (p.kind === "ADDON" || p.kind === "BUNDLE") && p.saleType !== "RESELLER"
  );

  const isCurrent = (pkg) =>
    (isPremiumActive && activePackage.id === pkg.id) ||
    (!isPremiumActive && pkg.price === 0);

  // Satu paket rekomendasi saja (hindari badge "Populer" di semua kartu).
  const recommended = plans.find((p) => p.isHighlighted) || plans.find((p) => p.slug === "basic");
  const recommendedId = recommended?.id;

  // --- Tombol aksi per kartu ------------------------------------------------
  function Cta({ pkg }) {
    if (isCurrent(pkg)) {
      return (
        <Button variant="outline" size="sm" className="w-full" disabled>
          Paket Aktif Anda
        </Button>
      );
    }
    if (pkg.price === 0) {
      return (
        <Button variant="ghost" size="sm" className="w-full" disabled>
          Termasuk Gratis
        </Button>
      );
    }
    return (
      <Button
        size="sm"
        className="w-full"
        onClick={() => goToCheckout(pkg)}
        disabled={navigatingId !== null}
      >
        {navigatingId === pkg.id ? (
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
    );
  }

  // --- Kartu paket utama (PLAN) ---------------------------------------------
  function PlanCard({ pkg }) {
    const features = parseFeatures(pkg);
    const current = isCurrent(pkg);
    const isRecommended = pkg.id === recommendedId && !current;
    const titleId = `plan-${pkg.id}`;

    return (
      <Surface
        as="article"
        aria-labelledby={titleId}
        hover={!current}
        className={cn(
          "relative flex h-full flex-col overflow-hidden",
          current
            ? "border-gold-400 ring-1 ring-gold-400/30"
            : isRecommended
            ? "border-gold-400/70 ring-1 ring-gold-400/20"
            : "hover:border-gold-400/50"
        )}
      >
        {current ? (
          <Badge variant="success" className="absolute right-0 top-0 rounded-none rounded-bl-lg">
            Paket Anda
          </Badge>
        ) : (
          isRecommended && (
            <Badge variant="gold" className="absolute right-0 top-0 rounded-none rounded-bl-lg">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Rekomendasi
            </Badge>
          )
        )}

        <div className="space-y-2">
          <h3
            id={titleId}
            className="font-heading text-base font-bold uppercase tracking-wider text-foreground"
          >
            {pkg.name}
          </h3>
          <p className="flex items-baseline gap-1">
            <span className="font-heading text-2xl font-extrabold text-foreground">
              {pkg.price === 0 ? "Gratis" : formatRupiah(pkg.price)}
            </span>
            <span className="text-xs text-muted-foreground">{periodText(pkg)}</span>
          </p>
        </div>

        <FeatureList items={features} className="mt-5 flex-1 border-t border-border/50 pt-5" />

        <div className="mt-6">
          <Cta pkg={pkg} />
        </div>
      </Surface>
    );
  }

  // --- Kartu kompak (Add-on / Bundle / Vendor) ------------------------------
  function CompactCard({ pkg }) {
    const features = parseFeatures(pkg);
    const current = isCurrent(pkg);
    const titleId = `extra-${pkg.id}`;

    return (
      <Surface
        as="article"
        aria-labelledby={titleId}
        hover={!current}
        padding="sm"
        className={cn(
          "relative flex h-full flex-col gap-3 overflow-hidden p-5",
          current ? "border-gold-400 ring-1 ring-gold-400/30" : "hover:border-gold-400/50"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <Badge variant="goldSoft">{KIND_TAG[pkg.kind] || KIND_TAG[pkg.saleType] || "Tambahan"}</Badge>
            <h3 id={titleId} className="truncate font-heading text-base font-bold text-foreground">
              {pkg.name}
            </h3>
          </div>
          <p className="shrink-0 text-right">
            <span className="block font-heading text-lg font-extrabold text-foreground">
              {formatRupiah(pkg.price)}
            </span>
            <span className="text-[10px] text-muted-foreground">{periodText(pkg)}</span>
          </p>
        </div>

        {features.length > 0 && (
          <FeatureList items={features} max={3} className="flex-1" itemClassName="text-[11px]" />
        )}

        <div className="mt-1">
          <Cta pkg={pkg} />
        </div>
      </Surface>
    );
  }

  return (
    <div className="space-y-10 pb-12">
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

      {/* 1. Status langganan aktif — banner lebar penuh */}
      <Surface as="section" aria-labelledby="status-title" className="relative overflow-hidden">
        {isPremiumActive && (
          <Badge
            variant="gold"
            className="absolute right-0 top-0 rounded-none rounded-bl-xl px-3 py-1 tracking-widest"
          >
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            <span>PREMIUM</span>
          </Badge>
        )}

        <h2
          id="status-title"
          className="flex items-center gap-2 border-b border-border/60 pb-3 font-heading text-lg font-bold text-foreground"
        >
          <Layers className="h-5 w-5 text-gold-400" aria-hidden="true" />
          <span>Paket Saat Ini</span>
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Nama Paket */}
          <div>
            <span className="block text-xs text-muted-foreground">Nama Paket</span>
            <span className="mt-0.5 block font-heading text-xl font-bold text-foreground">
              {isPremiumActive ? activePackage.name : "Free Trial"}
            </span>
            <span
              className={cn(
                "mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold",
                isPremiumActive
                  ? "bg-gold-400/15 text-gold-600 dark:text-gold-300"
                  : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              )}
            >
              {isPremiumActive ? "Premium Aktif" : "Gratis / Watermark"}
            </span>
          </div>

          {/* Masa Aktif */}
          <div>
            <span className="block text-xs text-muted-foreground">Masa Aktif</span>
            {isPremiumActive ? (
              <div className="mt-1 flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>s.d. {formatLongDate(activeSubscription.validUntil)}</span>
              </div>
            ) : (
              <span className="mt-1 block text-sm font-medium text-muted-foreground">
                Selamanya (fitur terbatas)
              </span>
            )}
          </div>

          {/* Kuota + progress */}
          <div>
            <span className="block text-xs text-muted-foreground">Kuota Pembuatan Undangan</span>
            <div className="mt-1 flex items-end gap-1.5">
              <span className="text-2xl font-bold text-foreground">{quotaUsed}</span>
              <span className="mb-1 text-sm text-muted-foreground">
                / {quotaUnlimited ? "∞" : quotaMax} Undangan
              </span>
            </div>
            {quotaUnlimited ? (
              <p className="mt-2 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                Tak terbatas
              </p>
            ) : (
              <div
                className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border/60"
                role="progressbar"
                aria-valuenow={quotaUsed}
                aria-valuemin={0}
                aria-valuemax={quotaMax}
                aria-label="Kuota undangan terpakai"
              >
                <div
                  className="h-full rounded-full bg-gold-400 transition-all"
                  style={{ width: `${quotaPct}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </Surface>

      {/* 2. Paket Utama (PLAN) */}
      {plans.length > 0 && (
        <section aria-labelledby="plans-title">
          <div className="mb-5">
            <h2
              id="plans-title"
              className="flex items-center gap-2 font-heading text-lg font-bold text-foreground"
            >
              <Crown className="h-5 w-5 text-gold-400" aria-hidden="true" />
              <span>Paket Utama</span>
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Pilih paket inti sesuai kebutuhan undangan Anda.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {plans.map((pkg) => (
              <PlanCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Add-on & Paket Hemat (ADDON/BUNDLE) */}
      {extras.length > 0 && (
        <section aria-labelledby="extras-title">
          <div className="mb-5">
            <h2
              id="extras-title"
              className="flex items-center gap-2 font-heading text-lg font-bold text-foreground"
            >
              <Gift className="h-5 w-5 text-gold-400" aria-hidden="true" />
              <span>Add-on &amp; Paket Hemat</span>
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Lengkapi paket Anda dengan fitur tambahan atau bundel yang lebih hemat.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 items-stretch">
            {extras.map((pkg) => (
              <CompactCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Paket Vendor / Reseller (RESELLER) */}
      {resellers.length > 0 && (
        <section aria-labelledby="vendor-title">
          <div className="mb-5">
            <h2
              id="vendor-title"
              className="flex items-center gap-2 font-heading text-lg font-bold text-foreground"
            >
              <Store className="h-5 w-5 text-gold-400" aria-hidden="true" />
              <span>Untuk Vendor &amp; Wedding Organizer</span>
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Lisensi grosir untuk Anda yang mengelola banyak undangan klien.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 items-stretch">
            {resellers.map((pkg) => (
              <CompactCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Riwayat Pembayaran */}
      <Surface as="section" aria-labelledby="history-title">
        <h2
          id="history-title"
          className="mb-4 flex items-center gap-2 border-b border-border/60 pb-3 font-heading text-lg font-bold text-foreground"
        >
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
              <caption className="sr-only">
                Daftar riwayat pembayaran: Order ID, paket, nominal, tanggal, dan status transaksi.
              </caption>
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground">
                  <th scope="col" className="px-4 py-3 font-semibold">Order ID</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Paket</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Nominal</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Tanggal Transaksi</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((trx) => (
                  <tr key={trx.id} className="border-b border-border/40 hover:bg-gold-400/5">
                    <td className="px-4 py-3.5 font-mono font-medium text-foreground">
                      {trx.midtransOrderId}
                    </td>
                    <td className="px-4 py-3.5 text-foreground">{trx.package.name}</td>
                    <td className="px-4 py-3.5 font-medium text-foreground">
                      {formatRupiah(trx.amount)}
                    </td>
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
