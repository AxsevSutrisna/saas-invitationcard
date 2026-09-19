"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  CheckCircle,
  Calendar,
  Layers,
  History,
  Sparkles,
  Loader2,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";

const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

// Endpoint Snap JS SDK
const SNAP_SCRIPT_URL = isProduction
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

export function SubscriptionClient({
  activeSubscription,
  packages,
  transactions,
}) {
  const router = useRouter();
  const [loadingPackageId, setLoadingPackageId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpgrade = async (packageId) => {
    try {
      setErrorMessage("");
      setLoadingPackageId(packageId);

      // 1. Request presigned snap token dari API kita
      const response = await fetch("/api/v1/payments/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packageId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal membuat transaksi.");
      }

      const { token } = result.data;

      // 2. Trigger Midtrans Snap popup
      if (window.snap) {
        window.snap.pay(token, {
          onSuccess: (result) => {
            console.log("Payment success:", result);
            router.refresh();
          },
          onPending: (result) => {
            console.log("Payment pending:", result);
            router.refresh();
          },
          onError: (result) => {
            console.error("Payment error:", result);
            setErrorMessage("Pembayaran gagal diproses oleh Midtrans.");
          },
          onClose: () => {
            console.log("Payment popup closed by customer.");
          },
        });
      } else {
        throw new Error("Midtrans Snap SDK gagal dimuat. Muat ulang halaman.");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      setErrorMessage(error.message || "Terjadi kesalahan pembayaran.");
    } finally {
      setLoadingPackageId(null);
    }
  };

  // Format ke Rupiah
  const formatIDR = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Hitung detail langganan saat ini
  const activePackage = activeSubscription?.package;
  const isPremiumActive = activeSubscription && activePackage && activePackage.price > 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Script Snap Midtrans */}
      <Script
        src={SNAP_SCRIPT_URL}
        data-client-key={clientKey}
        strategy="lazyOnload"
      />

      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-heading text-3xl font-bold text-[#1F1F1F] dark:text-zinc-50 tracking-tight flex items-center gap-2">
          <CreditCard className="w-8 h-8 text-[#C8A96A]" />
          <span>Paket & Langganan</span>
        </h1>
        <p className="text-sm text-muted-foreground font-light">
          Upgrade paket Anda untuk membuka seluruh fitur premium, menghilangkan watermark, dan mengaktifkan tema eksklusif.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid Utama: Status Aktif & Daftar Paket */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Status Paket Aktif Saat Ini */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#1A1A1A] border border-border/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            {isPremiumActive && (
              <div className="absolute top-0 right-0 bg-[#C8A96A] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-bl-xl flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>PREMIUM</span>
              </div>
            )}
            
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
              <Layers className="w-5 h-5 text-[#C8A96A]" />
              <span>Paket Saat Ini</span>
            </h2>

            <div className="mt-4 space-y-4">
              <div>
                <span className="text-xs text-muted-foreground block">Nama Paket</span>
                <span className="text-xl font-bold font-heading text-foreground mt-0.5 block">
                  {isPremiumActive ? activePackage.name : "Free Trial"}
                </span>
              </div>

              <div>
                <span className="text-xs text-muted-foreground block">Masa Aktif</span>
                {isPremiumActive ? (
                  <div className="flex items-center gap-2 mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    <Calendar className="w-4 h-4" />
                    <span>
                      s.d. {new Date(activeSubscription.validUntil).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-zinc-500 mt-1 block">
                    Selamanya (Fitur Terbatas & Watermark Aktif)
                  </span>
                )}
              </div>

              <div>
                <span className="text-xs text-muted-foreground block">Kuota Pembuatan Undangan</span>
                <div className="flex items-end gap-1.5 mt-1">
                  <span className="text-2xl font-bold text-foreground">
                    {activeSubscription ? activeSubscription.quotaUsed : 0}
                  </span>
                  <span className="text-muted-foreground text-sm mb-1">
                    / {isPremiumActive ? activePackage.maxInvitations : 1} Undangan Terpakai
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Pilihan Paket Upgrade */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg) => {
              const isCurrent =
                (isPremiumActive && activePackage.id === pkg.id) ||
                (!isPremiumActive && pkg.price === 0);

              const features = Array.isArray(pkg.features)
                ? pkg.features
                : JSON.parse(pkg.features || "[]");

              return (
                <div
                  key={pkg.id}
                  className={`bg-white dark:bg-[#1A1A1A] border rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                    isCurrent
                      ? "border-[#C8A96A] ring-1 ring-[#C8A96A]/30"
                      : "border-border/80 hover:border-[#C8A96A]/50"
                  }`}
                >
                  <div>
                    {pkg.price > 0 && !isCurrent && (
                      <div className="absolute top-0 right-0 bg-[#C8A96A]/10 text-[#C8A96A] text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-bl-lg">
                        Populer
                      </div>
                    )}

                    <h3 className="text-md font-bold text-foreground uppercase tracking-wider">
                      {pkg.name}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-foreground font-heading">
                        {pkg.price === 0 ? "Gratis" : formatIDR(pkg.price)}
                      </span>
                      {pkg.price > 0 && (
                        <span className="text-xs text-muted-foreground">
                          / {pkg.durationDays} Hari
                        </span>
                      )}
                    </div>

                    <ul className="mt-6 space-y-3">
                      {features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    {isCurrent ? (
                      <Button
                        variant="outline"
                        className="w-full border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5 cursor-default font-medium text-xs rounded-xl"
                        disabled
                      >
                        Paket Aktif Anda
                      </Button>
                    ) : pkg.price === 0 ? (
                      <Button
                        variant="outline"
                        className="w-full font-medium text-xs rounded-xl"
                        disabled
                      >
                        Default Free Trial
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleUpgrade(pkg.id)}
                        disabled={loadingPackageId !== null}
                        className="w-full bg-[#1F1F1F] dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors font-medium text-xs rounded-xl"
                      >
                        {loadingPackageId === pkg.id ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Memproses...</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 justify-center">
                            <TrendingUp className="w-4 h-4" />
                            <span>Upgrade Sekarang</span>
                          </span>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Riwayat Tagihan / Pembayaran */}
      <div className="bg-white dark:bg-[#1A1A1A] border border-border/80 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3 mb-4">
          <History className="w-5 h-5 text-[#C8A96A]" />
          <span>Riwayat Pembayaran</span>
        </h2>

        {transactions.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Belum ada riwayat transaksi pembayaran terdaftar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground">
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Paket</th>
                  <th className="py-3 px-4 font-semibold">Nominal</th>
                  <th className="py-3 px-4 font-semibold">Tanggal Transaksi</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((trx) => (
                  <tr key={trx.id} className="border-b border-border/40 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10">
                    <td className="py-3.5 px-4 font-mono font-medium text-foreground">{trx.midtransOrderId}</td>
                    <td className="py-3.5 px-4 text-foreground">{trx.package.name}</td>
                    <td className="py-3.5 px-4 font-medium text-foreground">{formatIDR(trx.amount)}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {new Date(trx.createdAt).toLocaleString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      {trx.status === "SUCCESS" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400">
                          Sukses
                        </span>
                      ) : trx.status === "PENDING" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400 animate-pulse">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400">
                          Gagal
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
