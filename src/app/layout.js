import {
  Poppins,
  Cormorant_Garamond,
  Great_Vibes,
  Playfair_Display,
  Libre_Baskerville,
  Fraunces,
} from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  // 300 dibuang: heading tidak pernah memakai font-light (hanya 400–700).
  weight: ["400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-greatvibes",
  subsets: ["latin"],
  weight: ["400"],
  // Font skrip dekoratif & jarang → jangan render-blocking di muat awal.
  preload: false,
  display: "swap",
});

// ── Font judul KHUSUS per tema undangan (hanya dipakai di halaman undangan) ──
// preload:false agar tak membebani muat awal situs; di-swap saat dibutuhkan.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: false,
  display: "swap",
});

const baskerville = Libre_Baskerville({
  variable: "--font-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: false,
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: false,
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "IKARA | Undangan Pernikahan Digital Mewah & Elegan",
    template: "%s | IKARA",
  },
  description:
    "IKARA adalah platform undangan pernikahan digital premium. Abadikan kisah cinta dan janji pernikahan Anda dengan desain website pernikahan yang elegan, personal, dan eksklusif.",
  keywords: ["undangan pernikahan digital", "undangan online mewah", "website pernikahan premium", "bikin undangan digital", "RSVP online", "IKARA"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "IKARA | Undangan Pernikahan Digital Mewah",
    description: "Abadikan kisah cinta Anda dengan undangan pernikahan digital premium yang elegan dan bermakna.",
    url: APP_URL,
    siteName: "IKARA",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/ikara-hero-section.webp",
        width: 1200,
        height: 630,
        alt: "IKARA — Undangan Pernikahan Digital Mewah & Elegan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IKARA | Undangan Pernikahan Digital Mewah",
    description: "Abadikan kisah cinta Anda dengan undangan pernikahan digital premium yang elegan dan bermakna.",
    images: ["/ikara-hero-section.webp"],
  },
  robots: { index: true, follow: true },
  // Favicon utama kini via konvensi file `app/icon.svg` (< 1 KB, menggantikan
  // PNG 362 KB yang sebelumnya dimuat tiap halaman). Di sini cukup apple-touch:
  // wajib PNG (SVG tak didukung iOS) & hanya diambil saat "Add to Home Screen".
  icons: {
    apple: "/IKARA_LOGO_ICON.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} ${cormorant.variable} ${greatVibes.variable} ${playfair.variable} ${baskerville.variable} ${fraunces.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
