import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminClient } from "@/features/dashboard/components/AdminClient";

export const metadata = {
  title: "Super Admin Command Center — IKARA",
  description: "Manajemen data platform IKARA secara terpadu.",
};

export default async function AdminPage() {
  const session = await auth();

  // 1. Proteksi Sisi Server: Hanya izinkan email super admin
  if (
    !session ||
    !session.user ||
    session.user.email !== "asepsutrisnasp@gmail.com"
  ) {
    redirect("/dashboard");
  }

  // 2. Ambil Semua Data Riil dari Neon Database (Prisma)
  
  // A. Pengguna (Users)
  const users = await db.user.findMany({
    include: {
      subscriptions: {
        where: { status: "ACTIVE" },
        include: { package: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // B. Transaksi (Transactions)
  const transactions = await db.transaction.findMany({
    include: {
      user: true,
      package: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // C. Tema Desain (Themes)
  const themes = await db.theme.findMany({
    orderBy: { sortOrder: "asc" },
  });

  // D. Templat Ayat & Kutipan (Quotes)
  const quotes = await db.quoteTemplate.findMany({
    orderBy: { category: "asc" },
  });

  // E. Pustaka Lagu (Music)
  const musics = await db.musicTemplate.findMany({
    orderBy: { createdAt: "desc" },
  });

  // F. FAQ
  const faqs = await db.fAQ.findMany({
    orderBy: { sortOrder: "asc" },
  });

  // G. Pengaturan Sistem (Settings)
  const settings = await db.systemSetting.findMany();

  // H. Master Paket Langganan Aktif (untuk form dropdown upgrade user)
  const packages = await db.package.findMany({
    where: { isActive: true },
  });

  // 3. Serialisasi Tanggal untuk Mencegah Next.js SSR Serialization Warnings
  const serializedUsers = JSON.parse(JSON.stringify(users));
  const serializedTransactions = JSON.parse(JSON.stringify(transactions));
  const serializedThemes = JSON.parse(JSON.stringify(themes));
  const serializedQuotes = JSON.parse(JSON.stringify(quotes));
  const serializedMusics = JSON.parse(JSON.stringify(musics));
  const serializedFaqs = JSON.parse(JSON.stringify(faqs));
  const serializedSettings = JSON.parse(JSON.stringify(settings));
  const serializedPackages = JSON.parse(JSON.stringify(packages));

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
