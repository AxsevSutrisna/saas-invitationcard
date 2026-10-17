import Link from "next/link";
import { Home, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Halaman Tidak Ditemukan",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div className="space-y-2">
        <p className="font-heading text-7xl font-extrabold text-gold-400">404</p>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Halaman tidak ditemukan
        </h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button>
            <Home aria-hidden="true" />
            <span>Kembali ke Beranda</span>
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline">
            <LayoutGrid aria-hidden="true" />
            <span>Ke Dashboard</span>
          </Button>
        </Link>
      </div>
    </main>
  );
}
