import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { serialize } from "@/lib/utils";
import { cannot } from "@/lib/ability";
import { AdminClient } from "@/features/admin/components/AdminClient";

// Batas aman daftar yang tumbuh tak terbatas (users & transactions). Keduanya
// diurutkan terbaru lebih dulu, jadi ini mengambil N baris terkini. Mencegah
// seluruh tabel ikut ter-fetch & ter-serialize saat platform membesar.
const ADMIN_RECENT_LIMIT = 100;

export const metadata = {
  title: "Super Admin Command Center — IKARA",
  description: "Manajemen data platform IKARA secara terpadu.",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth();

  // 1. Proteksi Sisi Server: hanya role dengan akses panel admin (SUPER_ADMIN)
  if (cannot(session?.user, "admin:access")) {
    redirect("/dashboard");
  }

  // 2. Ambil Semua Data Riil dari Database secara paralel (8 query independen)
  const [users, transactions, themes, quotes, musics, faqs, settings, packages] =
    await Promise.all([
      // Hanya field yang ditampilkan — JANGAN sertakan kolom `password` (hash)
      // yang akan ikut ter-serialize ke client bila memakai include/row penuh.
      db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          subscriptions: {
            where: { status: "ACTIVE" },
            select: { validUntil: true, package: { select: { name: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
        take: ADMIN_RECENT_LIMIT,
      }),
      db.transaction.findMany({
        select: {
          id: true,
          midtransOrderId: true,
          amount: true,
          status: true,
          createdAt: true,
          user: { select: { name: true, email: true } },
          package: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: ADMIN_RECENT_LIMIT,
      }),
      db.theme.findMany({ orderBy: { sortOrder: "asc" } }),
      db.quoteTemplate.findMany({ orderBy: { category: "asc" } }),
      db.musicTemplate.findMany({ orderBy: { createdAt: "desc" } }),
      db.fAQ.findMany({ orderBy: { sortOrder: "asc" } }),
      db.systemSetting.findMany(),
      db.package.findMany({ where: { isActive: true } }),
    ]);

  // 3. Serialisasi Tanggal untuk Mencegah Next.js SSR Serialization Warnings
  const serializedUsers = serialize(users);
  const serializedTransactions = serialize(transactions);
  const serializedThemes = serialize(themes);
  const serializedQuotes = serialize(quotes);
  const serializedMusics = serialize(musics);
  const serializedFaqs = serialize(faqs);
  const serializedSettings = serialize(settings);
  const serializedPackages = serialize(packages);

  return (
    <AdminClient
      initialUsers={serializedUsers}
      initialTransactions={serializedTransactions}
      initialThemes={serializedThemes}
      initialQuotes={serializedQuotes}
      initialMusics={serializedMusics}
      initialFaqs={serializedFaqs}
      initialSettings={serializedSettings}
      packages={serializedPackages}
    />
  );
}
