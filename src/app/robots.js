import { siteConfig } from "@/config/site.config";

/**
 * robots.txt dinamis (Next.js App Router → otomatis di-serve di /robots.txt).
 * Mengizinkan crawl halaman publik, memblokir area privat/aplikasi, serta
 * menunjuk ke sitemap.
 */
export default function robots() {
  const base = siteConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/payment/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
