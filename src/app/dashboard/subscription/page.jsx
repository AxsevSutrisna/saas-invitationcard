import { CreditCard, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubscriptionPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Langganan & Paket
        </h1>
        <p className="text-sm text-muted-foreground font-light">
          Kelola paket aktif dan tingkatkan akses fitur premium Anda
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#1F1F1F] via-[#2D281E] to-[#1F1F1F] text-white space-y-6 shadow-xl border border-[#C8A96A]/40 relative overflow-hidden">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-[#C8A96A]/20 text-[#E2C785] text-xs font-semibold uppercase tracking-widest inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 fill-current" /> Status Aktif
          </span>
          <h2 className="font-heading text-2xl font-bold">Paket PRO (Unlimited Access)</h2>
          <p className="text-sm text-zinc-300 font-light">
            Akses tak terbatas ke semua fitur premium, tanpa watermark, dan custom domain.
          </p>
        </div>
      </div>
    </div>
  );
}
