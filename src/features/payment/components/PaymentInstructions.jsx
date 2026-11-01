"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  QrCode,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/format";
import { ROUTES } from "@/constants/routes";
import { checkPaymentStatusAction } from "@/features/payment/core-actions";

const BANK_LABEL = { bca: "BCA", bni: "BNI", bri: "BRI", permata: "Permata", mandiri: "Mandiri" };

/** Hitung sisa waktu ke `expiryTime` (ISO). */
function useCountdown(expiryTime) {
  const [remaining, setRemaining] = useState(() =>
    expiryTime ? Math.max(0, new Date(expiryTime).getTime() - Date.now()) : null
  );

  useEffect(() => {
    if (!expiryTime) return;
    const id = setInterval(() => {
      setRemaining(Math.max(0, new Date(expiryTime).getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [expiryTime]);

  if (remaining == null) return null;
  const totalSec = Math.floor(remaining / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  return { expired: remaining <= 0, label: `${h}:${m}:${s}` };
}

/** Baris nilai yang bisa disalin (VA / biller / bill key). */
function CopyRow({ label, value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard tidak tersedia */
    }
  };
  return (
    <div className="rounded-xl border border-border/60 bg-muted/40 p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="font-mono text-base font-bold tracking-wider text-foreground">{value}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-lg border border-border/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-gold-400 hover:text-gold-600"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Disalin" : "Salin"}
        </button>
      </div>
    </div>
  );
}

function Shell({ children }) {
  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center">
          <span className="font-heading text-xl font-bold tracking-wide text-gold-500">IKARA</span>
        </div>
        {children}
      </div>
    </main>
  );
}

export function PaymentInstructions({ transaction }) {
  const router = useRouter();
  const meta = transaction.paymentMeta || {};
  const orderId = transaction.midtransOrderId;

  const [status, setStatus] = useState(transaction.status);
  const [checking, setChecking] = useState(false);
  const pollRef = useRef(null);

  const countdown = useCountdown(meta.expiryTime);

  const check = useCallback(
    async (manual = false) => {
      if (manual) setChecking(true);
      const res = await checkPaymentStatusAction(orderId);
      if (manual) setChecking(false);
      if (res.success && res.status && res.status !== status) {
        setStatus(res.status);
        if (res.status !== "PENDING") router.refresh();
      }
      return res.status;
    },
    [orderId, status, router]
  );

  // Polling otomatis selama masih PENDING (penting di dev: webhook tak terjangkau).
  useEffect(() => {
    if (status !== "PENDING") return;
    pollRef.current = setInterval(() => check(false), 5000);
    return () => clearInterval(pollRef.current);
  }, [status, check]);

  // ---- Status terminal -----------------------------------------------------
  if (status === "SUCCESS") {
    return (
      <Shell>
        <div className="rounded-3xl border border-border/60 bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </div>
          <h1 className="mt-4 font-heading text-xl font-bold text-foreground">Pembayaran Berhasil</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Terima kasih! Paket Anda telah aktif. Nikmati seluruh fitur premium IKARA.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link href={ROUTES.SUBSCRIPTION}>
              <Button className="h-11 w-full">Lihat Langganan</Button>
            </Link>
            <Link href={ROUTES.DASHBOARD}>
              <Button variant="outline" className="h-11 w-full">Ke Dashboard</Button>
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  if (status === "FAILED" || status === "REFUNDED") {
    const refunded = status === "REFUNDED";
    return (
      <Shell>
        <div className="rounded-3xl border border-border/60 bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            <XCircle className="h-8 w-8" aria-hidden="true" />
          </div>
          <h1 className="mt-4 font-heading text-xl font-bold text-foreground">
            {refunded ? "Pembayaran Dikembalikan" : "Pembayaran Gagal"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {refunded
              ? "Transaksi ini telah di-refund."
              : "Pembayaran dibatalkan atau kedaluwarsa. Silakan ulangi dari halaman langganan."}
          </p>
          <div className="mt-6">
            <Link href={ROUTES.SUBSCRIPTION}>
              <Button className="h-11 w-full">Kembali ke Langganan</Button>
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  // ---- PENDING: tampilkan instruksi ---------------------------------------
  const isQris = Boolean(meta.qrImageUrl);
  const isEchannel = Boolean(meta.billKey || meta.billerCode);
  const bankLabel = BANK_LABEL[meta.bank] || (meta.bank ? meta.bank.toUpperCase() : "Bank");

  return (
    <Shell>
      <div className="space-y-4 rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
        {/* Ringkasan */}
        <div className="flex items-start justify-between gap-3 border-b border-border/50 pb-4">
          <div className="min-w-0">
            <p className="font-heading text-base font-bold text-foreground">{transaction.package?.name}</p>
            <p className="truncate font-mono text-[10px] text-muted-foreground">#{orderId}</p>
          </div>
          <p className="shrink-0 font-heading text-lg font-extrabold text-foreground">
            {formatRupiah(transaction.amount)}
          </p>
        </div>

        {/* Countdown */}
        {countdown && (
          <div
            className={`flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold ${
              countdown.expired
                ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300"
                : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
            }`}
          >
            <Clock className="h-4 w-4" aria-hidden="true" />
            {countdown.expired ? "Waktu pembayaran habis" : `Bayar dalam ${countdown.label}`}
          </div>
        )}

        {/* Instruksi per metode */}
        {isQris ? (
          <div className="space-y-3 text-center">
            <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-foreground">
              <QrCode className="h-4 w-4 text-gold-500" aria-hidden="true" />
              Scan QRIS
            </p>
            <div className="mx-auto w-fit rounded-2xl border border-border/60 bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={meta.qrImageUrl} alt="QRIS untuk pembayaran" className="h-56 w-56 object-contain" />
            </div>
            <p className="text-xs text-muted-foreground">
              Buka GoPay / OVO / Dana / ShopeePay / m-banking → menu Scan/QRIS → arahkan ke kode di atas.
            </p>
          </div>
        ) : isEchannel ? (
          <div className="space-y-3">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Building2 className="h-4 w-4 text-gold-500" aria-hidden="true" />
              Mandiri Bill Payment
            </p>
            {meta.billerCode && <CopyRow label="Kode Perusahaan (Biller)" value={meta.billerCode} />}
            {meta.billKey && <CopyRow label="Kode Bayar (Bill Key)" value={meta.billKey} />}
            <p className="text-xs text-muted-foreground">
              Livin&apos; by Mandiri / ATM → Bayar → Multipayment → masukkan kode perusahaan lalu kode bayar.
            </p>
          </div>
        ) : meta.vaNumber ? (
          <div className="space-y-3">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Building2 className="h-4 w-4 text-gold-500" aria-hidden="true" />
              {bankLabel} Virtual Account
            </p>
            <CopyRow label="Nomor Virtual Account" value={meta.vaNumber} />
            <p className="text-xs text-muted-foreground">
              Buka m-banking/ATM → menu Transfer ke Virtual Account → masukkan nomor di atas → bayar
              sesuai total.
            </p>
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Instruksi pembayaran sedang disiapkan. Gunakan tombol di bawah untuk memeriksa status.
          </p>
        )}

        {/* Status polling */}
        <div className="space-y-2 border-t border-border/50 pt-4">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            Menunggu pembayaran… status diperbarui otomatis.
          </div>
          <Button
            variant="outline"
            className="h-10 w-full"
            onClick={() => check(true)}
            disabled={checking}
          >
            {checking ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            )}
            <span>Cek status sekarang</span>
          </Button>
        </div>
      </div>

      <div className="text-center">
        <Link
          href={ROUTES.SUBSCRIPTION}
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-gold-600"
        >
          Bayar nanti — kembali ke langganan
        </Link>
      </div>
    </Shell>
  );
}
