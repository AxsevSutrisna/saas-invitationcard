import { Poppins, Cormorant_Garamond, Great_Vibes } from "next/font/google";
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

export const metadata = {
  title: "IKARA | Undangan Pernikahan Digital Mewah & Elegan",
  description:
    "IKARA adalah platform undangan pernikahan digital premium. Abadikan kisah cinta dan janji pernikahan Anda dengan desain website pernikahan yang elegan, personal, dan eksklusif.",
  keywords: ["undangan pernikahan digital", "undangan online mewah", "website pernikahan premium", "bikin undangan digital", "IKARA"],
  openGraph: {
    title: "IKARA | Undangan Pernikahan Digital Mewah",
    description: "Abadikan kisah cinta Anda dengan undangan pernikahan digital premium yang elegan dan bermakna.",
    type: "website",
    locale: "id_ID",
  },
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
      className={`${poppins.variable} ${cormorant.variable} ${greatVibes.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
