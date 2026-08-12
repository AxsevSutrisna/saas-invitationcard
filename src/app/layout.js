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
  weight: ["300", "400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-greatvibes",
  subsets: ["latin"],
  weight: ["400"],
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
  icons: {
    icon: "/IKARA_LOGO_ICON.png",
    shortcut: "/IKARA_LOGO_ICON.png",
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
