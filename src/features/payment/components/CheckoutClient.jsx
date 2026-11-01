"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QrCode, Building2, Loader2, ArrowLeft, ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/Alert";
import { formatRupiah } from "@/lib/format";
import { ROUTES } from "@/constants/routes";
import { createCustomCheckoutAction } from "@/features/payment/core-actions";
import { cn } from "@/lib/utils";

const QRIS_METHOD = {
  key: "qris",
  name: "QRIS",
  desc: "GoPay, OVO, Dana, ShopeePay, LinkAja & m-banking",
  color: "bg-gold-400",
  icon: QrCode,
};

const BANK_METHODS = [
  { key: "bca", name: "BCA Virtual Account", color: "bg-blue-600", icon: Building2 },
  { key: "mandiri", name: "Mandiri Bill Payment", color: "bg-amber-500", icon: Building2 },
  { key: "bni", name: "BNI Virtual Account", color: "bg-orange-500", icon: Building2 },
  { key: "bri", name: "BRI Virtual Account", color: "bg-sky-700", icon: Building2 },
  { key: "permata", name: "Permata Virtual Account", color: "bg-emerald-600", icon: Building2 },
];

/** Satu baris metode pembayaran (radio). Didefinisikan di luar agar stabil (tidak remount). */
function MethodRow({ m, active, onSelect }) {
  const Icon = m.icon;
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors",
        active
          ? "border-gold-400 bg-gold-400/5 ring-1 ring-gold-400/30"
          : "border-border/60 hover:border-gold-400/50"
      )}
    >
      <input
        type="radio"
        name="payment-method"
        value={m.key}
        checked={active}
        onChange={() => onSelect(m.key)}
        className="sr-only"
      />
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white", m.color)}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">{m.name}</span>
        {m.desc && <span className="block truncate text-[11px] text-muted-foreground">{m.desc}</span>}
      </span>
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
          active ? "border-gold-400 bg-gold-400" : "border-border"
        )}
        aria-hidden="true"
      >
        {active && <span className="h-2 w-2 rounded-full bg-white" />}
      </span>
    </label>
  );
}

function PayButton({ loading, amount, onPay, className }) {
  return (
    <Button onClick={onPay} disabled={loading} className={cn("h-12 w-full text-sm font-semibold", className)}>
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span>Memproses...</span>
        </>
      ) : (
        <>
          <span>Bayar {formatRupiah(amount)}</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </>
      )}
    </Button>
  );
}

function TrustLine({ className }) {
  return (
    <p className={cn("flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground", className)}>
      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
      Pembayaran diproses aman oleh Midtrans
    </p>
  );
}

export function CheckoutClient({ pkg, invitationId = null, quantity = 1, amount }) {
  const router = useRouter();
  const [method, setMethod] = useState("qris");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isReseller = pkg.saleType === "RESELLER";
  const period = isReseller ? `${pkg.durationDays} hari / lisensi` : `${pkg.durationDays} hari`;

  async function handlePay() {
    if (loading) return;
    setError("");
    setLoading(true);
    const res = await createCustomCheckoutAction(pkg.id, { method, invitationId, quantity });
    if (res.success) {
      router.replace(ROUTES.PAYMENT_ORDER(res.data.orderId));
    } else {
      setError(res.error || "Gagal memproses pembayaran.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href={ROUTES.SUBSCRIPTION}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-gold-600"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Kembali
          </Link>
          <span className="font-heading text-xl font-bold tracking-wide text-gold-500">IKARA</span>
        </div>

        <div className="mt-6 space-y-1">
          <h1 className="font-heading text-2xl font-bold text-foreground">Selesaikan Pembayaran</h1>
          <p className="text-sm text-muted-foreground">Pilih metode pembayaran yang Anda inginkan.</p>
        </div>

        {error && <Alert variant="error" className="mt-5">{error}</Alert>}

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
          {/* Kolom kiri: ringkasan + metode */}
          <div className="min-w-0 space-y-6">
            {/* Ringkasan pesanan */}
            <section
              aria-labelledby="order-summary"
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-(--shadow-gold-sm)"
            >
              <h2 id="order-summary" className="sr-only">Ringkasan pesanan</h2>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-heading text-base font-bold text-foreground">
                    {pkg.name}
                    {isReseller && quantity > 1 ? ` × ${quantity}` : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Masa aktif {period}</p>
                </div>
                <p className="shrink-0 font-heading text-xl font-extrabold text-foreground">
                  {formatRupiah(amount)}
                </p>
              </div>
            </section>

            {/* Pilih metode (radiogroup) */}
            <fieldset className="min-w-0 space-y-5">
              <legend className="font-heading text-sm font-bold text-foreground">
                Metode Pembayaran
              </legend>

              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Instan
                </p>
                <MethodRow m={QRIS_METHOD} active={method === QRIS_METHOD.key} onSelect={setMethod} />
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Transfer Bank / Virtual Account
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {BANK_METHODS.map((m) => (
                    <MethodRow key={m.key} m={m} active={method === m.key} onSelect={setMethod} />
                  ))}
                </div>
              </div>
            </fieldset>

            <TrustLine className="lg:hidden" />
          </div>

          {/* Kolom kanan: panel bayar (sticky, desktop) */}
          <aside className="hidden lg:block lg:sticky lg:top-6">
            <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-5 shadow-(--shadow-gold-sm)">
              <div className="flex items-baseline justify-between border-b border-border/50 pb-3">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-heading text-xl font-extrabold text-foreground">
                  {formatRupiah(amount)}
                </span>
              </div>
              <PayButton loading={loading} amount={amount} onPay={handlePay} />
              <TrustLine />
            </div>
          </aside>
        </div>

        {/* Bar bayar sticky (mobile) */}
        <div className="sticky bottom-0 -mx-4 mt-8 border-t border-border/60 bg-card/95 px-4 py-3 backdrop-blur lg:hidden">
          <PayButton loading={loading} amount={amount} onPay={handlePay} />
        </div>
      </div>
    </main>
  );
}
