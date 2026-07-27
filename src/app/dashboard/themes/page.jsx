import { db } from "@/lib/db";
import { ThemesListClient } from "./ThemesListClient";

export const metadata = {
  title: "Koleksi Tema Undangan — IKARA",
  description: "Lihat dan pilih tema undangan digital premium terbaik dari IKARA.",
};

/**
 * Server Component - Fetch data tema aktual dari database Neon PostgreSQL
 * dan salurkan ke client component list.
 */
export default async function ThemesPage() {
  // Ambil daftar tema aktif dari database
  const themes = await db.theme.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return <ThemesListClient initialThemes={themes} />;
}
