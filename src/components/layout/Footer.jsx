import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { ROUTES } from "@/constants/routes";

/**
 * Footer - Luxury Dark Charcoal Footer Component
 */
export function Footer() {
  return (
    <footer className="bg-[#1F1F1F] text-zinc-300 pt-16 pb-12 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Info */}
        <div className="md:col-span-1 space-y-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/IKARA_Logo_V3_footer.png"
              alt="IKARA Logo"
              width={160}
              height={44}
              style={{ width: "auto", height: "40px" }}
              className="object-contain"
              loading="lazy"
            />
          </Link>
          <p className="text-sm text-zinc-400 leading-relaxed font-light">
            <span className="italic font-serif text-[#C8A96A] font-medium">{siteConfig.tagline}.</span>{" "}
            {siteConfig.philosophy}
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
            Navigasi
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#fitur" className="hover:text-[#C8A96A] transition-colors">
                Fitur
              </Link>
            </li>
            <li>
              <Link href="#tema" className="hover:text-[#C8A96A] transition-colors">
                Tema
              </Link>
            </li>
            <li>
              <Link href="#cara-kerja" className="hover:text-[#C8A96A] transition-colors">
                Panduan
              </Link>
            </li>
            <li>
              <Link href="#harga" className="hover:text-[#C8A96A] transition-colors">
                Harga
              </Link>
            </li>
          </ul>
        </div>

        {/* Account & Service */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
            Layanan
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href={ROUTES.LOGIN} className="hover:text-[#C8A96A] transition-colors">
                Buat Undangan
              </Link>
            </li>
            <li>
              <Link href={ROUTES.LOGIN} className="hover:text-[#C8A96A] transition-colors">
                Login
              </Link>
            </li>
            <li>
              <Link href="#faq" className="hover:text-[#C8A96A] transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[#C8A96A] transition-colors">
                Ketentuan
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-[#C8A96A] transition-colors">
                Privasi
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Support */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
            Hubungi Kami
          </h4>
          <p className="text-sm text-zinc-400">
            Punya pertanyaan atau butuh bantuan khusus? Tim support kami siap melayani Anda.
          </p>
          <div className="text-sm text-[#C8A96A] font-medium pt-1">
            <a
              href={`mailto:${siteConfig.contact.support}`}
              className="hover:underline"
            >
              {siteConfig.contact.support}
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-zinc-800/60 flex flex-col items-center justify-center text-center text-xs text-zinc-500 gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center">
          <p>© {new Date().getFullYear()} IKARA. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
              Syarat & Ketentuan
            </Link>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
              Kebijakan Privasi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
