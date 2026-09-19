import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { serialize } from "@/lib/utils";
import { AdminClient } from "@/features/admin/components/AdminClient";

export const metadata = {
  title: "Super Admin Command Center — IKARA",
  description: "Manajemen data platform IKARA secara terpadu.",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth();

  // 1. Proteksi Sisi Server: Hanya izinkan role SUPER_ADMIN
  if (
    !session ||
    !session.user ||
    session.user.role !== "SUPER_ADMIN"
  ) {
    redirect("/dashboard");
  }

  // 2. Ambil Semua Data Riil dari Database secara paralel (8 query independen)
  const [users, transactions, themes, quotes, musics, faqs, settings, packages] =
    await Promise.all([
      db.user.findMany({
        include: {
          subscriptions: { where: { status: "ACTIVE" }, include: { package: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.transaction.findMany({
        include: { user: true, package: true },
        orderBy: { createdAt: "desc" },
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
