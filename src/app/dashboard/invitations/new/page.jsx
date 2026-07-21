import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NewInvitationPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="outline" size="icon" className="rounded-xl">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Buat Undangan Baru
          </h1>
          <p className="text-sm text-muted-foreground font-light">
            Formulir pembuatan cerita & detail ikrar pernikahan Anda
          </p>
        </div>
      </div>

      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#C8A96A]/20 text-[#C8A96A] mx-auto flex items-center justify-center">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="font-heading text-xl font-bold text-foreground">
          Editor Form Multi-Step (Phase 6)
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto font-light">
          Modul pengisian data pasangan, lokasi acara, galeri foto, dan amplop digital akan diaktifkan penuh pada Phase 6!
        </p>
      </div>
    </div>
  );
}
