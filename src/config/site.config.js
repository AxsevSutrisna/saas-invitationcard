/**
 * Config - Site
 * Metadata dan konfigurasi global untuk seluruh aplikasi.
 * Digunakan untuk SEO, Open Graph, dan informasi aplikasi.
 */
export const siteConfig = {
  name: "SaaS Invitation Card",
  tagline: "Buat Undangan Digital Keren dalam Hitungan Menit",
  description:
    "Platform undangan digital modern yang mudah digunakan. Desain premium, sistem RSVP real-time, dan galeri foto untuk hari spesial Anda.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",

  // Informasi kontak
  contact: {
    email: "hello@saas-invitation.com",
    support: "support@saas-invitation.com",
  },

  // Social media
  social: {
    instagram: "https://instagram.com/saas.invitation",
    twitter: "https://twitter.com/saas_invitation",
  },

  // Metadata SEO default
  keywords: [
    "undangan digital",
    "undangan pernikahan online",
    "wedding invitation",
    "RSVP online",
    "undangan nikah digital",
  ],
};
