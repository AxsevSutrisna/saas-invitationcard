import { db } from "@/lib/db";
import { siteConfig } from "@/config/site.config";

/**
 * Sitemap dinamis (Next.js App Router → otomatis di-serve di /sitemap.xml).
 * Berisi halaman publik statis + halaman preview tiap tema yang aktif.
 * Undangan personal (`/[slug]`) SENGAJA tidak dimasukkan — bersifat privat
 * & sudah `robots: noindex` di metadata-nya.
 */
export default async function sitemap() {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/themes", changeFrequency: "weekly", priority: 0.8 },
    { path: "/register", changeFrequency: "monthly", priority: 0.4 },
    { path: "/login", changeFrequency: "monthly", priority: 0.2 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  ].map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  let themeRoutes = [];
  try {
    const themes = await db.theme.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    themeRoutes = themes.map((t) => ({
      url: `${base}/theme/preview/${t.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    // DB tak tersedia (mis. saat build offline) → cukup kembalikan route statis.
  }

  return [...staticRoutes, ...themeRoutes];
}
