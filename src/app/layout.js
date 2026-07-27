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
  title: "IKARA — Every Promise Has a Story",
  description:
    "IKARA adalah platform digital untuk mengabadikan dan membagikan kisah cinta serta janji pernikahan Anda melalui pengalaman yang indah, personal, dan bermakna.",
  icons: {
    icon: "/IKARA_LOGO_ICON.png",
    shortcut: "/IKARA_LOGO_ICON.png",
    apple: "/IKARA_LOGO_ICON.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${cormorant.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
