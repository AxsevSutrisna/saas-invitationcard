import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { getTransactionStatus } from "@/features/payment/services/midtrans";
import { ROUTES } from "@/constants/routes";

export const metadata = {
  title: "Status Pembayaran — IKARA",
  description: "Halaman konfirmasi hasil pembayaran langganan IKARA.",
};

/**
 * Redirect Callback Page (Midtrans "Finish/Unfinish/Error Redirect URL").
 * Midtrans mengarahkan browser ke sini setelah user menyelesaikan/menutup pembayaran,
 * dengan query: order_id, status_code, transaction_status.
 *
 * Halaman ini HANYA untuk menampilkan hasil ke user. Sumber kebenaran untuk
 * mengaktifkan langganan tetap webhook (server-to-server) + Get Status API.
 */
export default async function PaymentFinishPage({ searchParams }) {
  const sp = await searchParams;
  const orderId = sp?.order_id || "";

  // Re-cek status otoritatif ke Midtrans (best-effort; fallback ke query param)
  let transactionStatus = sp?.transaction_status || "";
  if (orderId) {
    try {
      const verified = await getTransactionStatus(orderId);
      if (verified?.transaction_status) transactionStatus = verified.transaction_status;
    } catch {
      // abaikan; pakai nilai dari query param
    }
  }

  const view = resolveView(transactionStatus);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-card border border-border/60 shadow-sm p-8 text-center space-y-5">
        <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center ${view.iconWrap}`}>
          <view.Icon className="w-10 h-10 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {view.title}
          </h1>
          <p className="text-sm text-muted-foreground font-light leading-relaxed">
            {view.description}
          </p>
          {orderId && (
            <p className="text-[11px] text-muted-foreground/70 font-mono pt-1">
              Order ID: {orderId}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Link
            href={ROUTES.SUBSCRIPTION}
            className="h-11 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-white font-medium text-sm flex items-center justify-center transition-all"
          >
            Lihat Status Langganan
          </Link>
          <Link
            href={ROUTES.DASHBOARD}
            className="h-11 rounded-2xl border border-border/60 text-sm font-medium flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function resolveView(transactionStatus) {
  if (transactionStatus === "settlement" || transactionStatus === "capture") {
    return {
      Icon: CheckCircle2,
      iconWrap: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
      title: "Pembayaran Berhasil",
      description:
        "Terima kasih! Pembayaran Anda telah kami terima. Paket langganan akan aktif secara otomatis dalam beberapa saat.",
    };
  }
  if (
    transactionStatus === "deny" ||
    transactionStatus === "cancel" ||
    transactionStatus === "expire" ||
    transactionStatus === "failure"
  ) {
    return {
      Icon: XCircle,
      iconWrap: "bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400",
      title: "Pembayaran Gagal",
      description:
        "Pembayaran tidak dapat diselesaikan atau dibatalkan. Silakan coba lagi dari halaman langganan.",
    };
  }
  return {
    Icon: Clock,
    iconWrap: "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
    title: "Menunggu Pembayaran",
    description:
      "Pembayaran Anda sedang menunggu penyelesaian. Status akan diperbarui otomatis setelah pembayaran dikonfirmasi.",
  };
}
