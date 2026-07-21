/**
 * Config - Site
 * Metadata dan konfigurasi global untuk aplikasi IKARA.
 * Digunakan untuk SEO, Open Graph, dan copywriting aplikasi.
 */
export const siteConfig = {
  name: "IKARA",
  tagline: "Every Promise Has a Story",
  philosophy: "Love is felt. A promise is made. A story is remembered.",
  description:
    "IKARA adalah platform digital modern untuk mengabadikan dan membagikan kisah cinta serta janji pernikahan Anda melalui pengalaman yang indah, personal, dan bermakna.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",

  // Informasi kontak
  contact: {
    email: "hello@ikara.id",
    support: "support@ikara.id",
  },

  // Social media
  social: {
    instagram: "https://instagram.com/ikara.id",
    twitter: "https://twitter.com/ikara_id",
  },

  // Metadata SEO default
  keywords: [
    "IKARA",
    "digital wedding invitation",
    "digital storytelling platform",
    "undangan pernikahan digital",
    "undangan nikah elegan",
    "ikrar dan aksara",
    "RSVP online",
  ],
};
