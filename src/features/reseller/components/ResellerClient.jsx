"use client";

import { useMemo, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import {
  Store,
  Coins,
  ShoppingCart,
  Share2,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Surface } from "@/components/ui/Surface";
import { formatRupiah } from "@/lib/format";
import { createCheckoutAction } from "@/features/payment/actions";
import { allocateResellerCreditAction } from "@/features/reseller/actions";

const SNAP_SCRIPT_URL =
  process.env.MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";
const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

export function ResellerClient({ credits = [], summary = {}, resellerPackages = [], invitations = [] }) {
  const router = useRouter();
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [buyingId, setBuyingId] = useState(null);
  const [qtyMap, setQtyMap] = useState({});
  const [allocating, setAllocating] = useState(false);
  const [allocPackageId, setAllocPackageId] = useState("");
  const [allocInvitationId, setAllocInvitationId] = useState("");

  const notify = (type, message) => {
    setFeedback({ type, message });
    if (type === "success") setTimeout(() => setFeedback({ type: "", message: "" }), 4000);
  };

  // Nama paket per id (dari paket reseller + yang tercatat di kredit).
  const nameById = useMemo(() => {
    const m = {};
    for (const p of resellerPackages) m[p.id] = p.name;
    for (const c of credits) if (c.package) m[c.packageId] = c.package.name;
    return m;
  }, [resellerPackages, credits]);

  // Daftar paket dengan sisa kredit > 0 (untuk alokasi).
  const packagesWithCredit = useMemo(
    () =>
      Object.entries(summary)
        .filter(([, available]) => available > 0)
        .map(([packageId, available]) => ({ packageId, available, name: nameById[packageId] || packageId })),
    [summary, nameById]
  );

  const allocatableInvitations = invitations.filter((inv) => !inv.hasEntitlement);

  const handleBuy = async (pkg) => {
    try {
      setFeedback({ type: "", message: "" });
      setBuyingId(pkg.id);
      const quantity = Math.max(1, parseInt(qtyMap[pkg.id]) || 1);

      const result = await createCheckoutAction(pkg.id, { quantity });
      if (!result.success) throw new Error(result.error || "Gagal membuat transaksi.");

      if (!window.snap) throw new Error("Midtrans Snap belum siap. Muat ulang halaman.");
      window.snap.pay(result.data.token, {
        onSuccess: () => router.refresh(),
        onPending: () => router.refresh(),
        onError: () => notify("error", "Pembayaran gagal diproses oleh Midtrans."),
        onClose: () => {},
      });
    } catch (e) {
      notify("error", e.message || "Terjadi kesalahan pembayaran.");
    } finally {
      setBuyingId(null);
    }
  };

  const handleAllocate = async () => {
    if (!allocInvitationId || !allocPackageId) {
      notify("error", "Pilih undangan dan paket terlebih dahulu.");
      return;
    }
    setAllocating(true);
    setFeedback({ type: "", message: "" });
    const res = await allocateResellerCreditAction({
      invitationId: allocInvitationId,
      packageId: allocPackageId,
    });
    setAllocating(false);
    if (res.success) {
      setAllocInvitationId("");
      setAllocPackageId("");
      notify("success", res.message || "Kredit dialokasikan.");
      router.refresh();
    } else {
      notify("error", res.error || "Gagal mengalokasikan kredit.");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <Script src={SNAP_SCRIPT_URL} data-client-key={clientKey} strategy="lazyOnload" />

      <PageHeader
        title={
          <span className="flex items-center gap-2">
            <Store className="h-7 w-7 text-gold-400" aria-hidden="true" />
            <span>Reseller &amp; Kredit</span>
          </span>
        }
        description="Beli lisensi grosir sebagai kredit, lalu alokasikan ke undangan klien Anda."
      />

      {feedback.message && (
        <div
          role="alert"
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-emerald-300/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "border-destructive/20 bg-destructive/10 text-destructive"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Saldo kredit */}
      <Surface as="section">
        <h2 className="mb-4 flex items-center gap-2 border-b border-border/60 pb-3 font-heading text-lg font-bold text-foreground">
          <Coins className="h-5 w-5 text-gold-400" aria-hidden="true" />
          <span>Saldo Kredit Saya</span>
        </h2>
        {packagesWithCredit.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">
            Belum ada kredit tersisa. Beli kredit di bawah untuk mulai mengalokasikan.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {packagesWithCredit.map((p) => (
              <div key={p.packageId} className="rounded-2xl border border-gold-400/30 bg-gold-400/5 p-4">
                <div className="text-2xl font-extrabold text-foreground">{p.available}</div>
                <div className="truncate text-xs text-muted-foreground">{p.name}</div>
              </div>
            ))}
          </div>
        )}
      </Surface>

      {/* Alokasi kredit */}
      <Surface as="section">
        <h2 className="mb-4 flex items-center gap-2 border-b border-border/60 pb-3 font-heading text-lg font-bold text-foreground">
          <Share2 className="h-5 w-5 text-gold-400" aria-hidden="true" />
          <span>Alokasikan ke Undangan</span>
        </h2>
        {packagesWithCredit.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">
            Belum ada kredit untuk dialokasikan.
          </p>
        ) : allocatableInvitations.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">
            Semua undangan Anda sudah premium, atau belum ada undangan. Buat undangan baru untuk dialokasikan.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Undangan</label>
              <select
                value={allocInvitationId}
                onChange={(e) => setAllocInvitationId(e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-border bg-transparent px-3 py-2 text-xs text-foreground outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30"
              >
                <option value="">— Pilih undangan —</option>
                {allocatableInvitations.map((inv) => (
                  <option key={inv.id} value={inv.id}>{inv.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Paket (dari kredit)</label>
              <select
                value={allocPackageId}
                onChange={(e) => setAllocPackageId(e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-border bg-transparent px-3 py-2 text-xs text-foreground outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30"
              >
                <option value="">— Pilih paket —</option>
                {packagesWithCredit.map((p) => (
                  <option key={p.packageId} value={p.packageId}>
                    {p.name} (sisa {p.available})
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={handleAllocate} disabled={allocating} className="h-10">
              {allocating ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Share2 className="h-4 w-4" aria-hidden="true" />
              )}
              <span>Alokasikan</span>
            </Button>
          </div>
        )}
      </Surface>

      {/* Beli kredit */}
      <Surface as="section">
        <h2 className="mb-4 flex items-center gap-2 border-b border-border/60 pb-3 font-heading text-lg font-bold text-foreground">
          <ShoppingCart className="h-5 w-5 text-gold-400" aria-hidden="true" />
          <span>Beli Kredit</span>
        </h2>
        {resellerPackages.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">
            Belum ada paket reseller tersedia. Hubungi admin.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {resellerPackages.map((pkg) => {
              const unit = pkg.wholesalePrice ?? pkg.price;
              const qty = Math.max(1, parseInt(qtyMap[pkg.id]) || 1);
              return (
                <div key={pkg.id} className="flex flex-col justify-between rounded-2xl border border-border/60 p-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-base font-bold uppercase tracking-wide text-foreground">
                        {pkg.name}
                      </h3>
                      <Badge variant="goldSoft">Reseller</Badge>
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-heading text-xl font-extrabold text-foreground">
                        {formatRupiah(unit)}
                      </span>
                      <span className="text-[11px] text-muted-foreground">/ lisensi · {pkg.durationDays} hari</span>
                    </div>
                    {pkg.wholesalePrice != null && pkg.price > pkg.wholesalePrice && (
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Harga eceran {formatRupiah(pkg.price)} — hemat per lisensi
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-end gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">Jumlah</label>
                      <input
                        type="number"
                        min="1"
                        value={qtyMap[pkg.id] ?? 1}
                        onChange={(e) => setQtyMap((prev) => ({ ...prev, [pkg.id]: e.target.value }))}
                        className="w-20 rounded-xl border border-border bg-transparent px-3 py-2 text-xs text-foreground outline-none focus:border-gold-400"
                      />
                    </div>
                    <Button onClick={() => handleBuy(pkg)} disabled={buyingId !== null} className="flex-1">
                      {buyingId === pkg.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span>Beli · {formatRupiah(unit * qty)}</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Surface>
    </div>
  );
}
