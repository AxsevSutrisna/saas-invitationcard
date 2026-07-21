import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { Mail, Plus, Sparkles } from "lucide-react";

/**
 * Dashboard Page - Undangan Saya Overview (Screenshot 1)
 * Menampilkan daftar undangan pengguna atau Empty State yang rapi.
 */
export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="space-y-1">
        <h1 className="font-heading text-3xl font-bold text-[#1F1F1F] dark:text-zinc-50 tracking-tight">
          Undangan Saya
        </h1>
        <p className="text-sm text-muted-foreground font-light">
          Kelola detail undangan, daftar tamu, dan ucapan untuk hari bahagia Anda
        </p>
      </div>

      {/* Empty State Area (Screenshot 1 Reference) */}
      <div className="min-h-[420px] rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6">
        {/* Envelope Graphic Badge */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#C8A96A]/20 to-amber-100 dark:from-[#C8A96A]/20 dark:to-zinc-800 border border-[#C8A96A]/30 flex items-center justify-center text-[#C8A96A] shadow-inner">
          <Mail className="w-10 h-10 stroke-[1.5]" />
        </div>

        {/* Text Copywriting */}
        <div className="space-y-2 max-w-md">
          <h2 className="font-heading text-2xl font-bold text-[#1F1F1F] dark:text-zinc-100">
            Belum Ada Undangan
          </h2>
          <p className="text-sm text-muted-foreground font-light leading-relaxed">
            Mulai buat undangan pernikahan pertama Anda dengan klik tombol di bawah
          </p>
        </div>

        {/* Primary CTA Button */}
        <div className="pt-2">
          <Link href={ROUTES.INVITATION_NEW}>
            <Button
              size="lg"
              className="h-12 px-7 rounded-2xl bg-gradient-to-r from-[#C8A96A] to-[#b39150] hover:from-[#b39150] hover:to-[#9e7e40] text-white font-medium text-sm shadow-lg shadow-[#C8A96A]/25 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              Buat Undangan Pertama
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
