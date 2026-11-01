"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Error boundary per-rute (di dalam root layout). Menangani error render di
 * halaman/segment. `reset()` mencoba me-render ulang segment yang gagal.
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    // Catat ke konsol (bisa diarahkan ke layanan monitoring di kemudian hari).
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div className="space-y-2">
        <p className="font-heading text-6xl font-extrabold text-gold-400">Oops</p>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Terjadi kesalahan
        </h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          Maaf, ada yang tidak beres saat memuat halaman ini. Silakan coba lagi.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()}>
          <RotateCw aria-hidden="true" />
          <span>Coba Lagi</span>
        </Button>
        <Link href="/">
          <Button variant="outline">
            <Home aria-hidden="true" />
            <span>Beranda</span>
          </Button>
        </Link>
      </div>
    </main>
  );
}
