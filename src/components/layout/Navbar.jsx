"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { marketingNav } from "@/config/navigation.config";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

/**
 * Navbar marketing.
 * @param {{ overlay?: boolean }} props
 *  - overlay: true HANYA untuk halaman dengan hero gelap penuh di belakang
 *    navbar (mis. landing page). Saat true & posisi di paling atas, navbar
 *    tampil transparan dengan teks terang agar menyatu dengan hero.
 *    Untuk halaman berlatar terang (Syarat, Privasi, Tema), biarkan false
 *    agar navbar selalu solid & teksnya terbaca sejak scroll paling atas.
 */
export function Navbar({ overlay = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Solid (pill terang, teks gelap) dipakai saat sudah scroll ATAU saat bukan
  // mode overlay. Transparan hanya terjadi di puncak halaman hero gelap.
  const solid = scrolled || !overlay;

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 w-full max-w-6xl mx-auto transition-all duration-300">
      <div
        className={`flex items-center justify-between px-6 py-3 rounded-full border transition-all duration-500 ${
          solid
            ? "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-lg shadow-gold-400/10 border-gold-400/20"
            : "bg-black/20 backdrop-blur-md border-white/25 shadow-sm"
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center group py-0.5">
          <div className="relative group-hover:scale-105 transition-transform flex items-center">
            <Image
              src="/IKARA_Logo_V3.png"
              alt="IKARA Logo"
              width={140}
              height={40}
              style={{ width: "auto", height: "30px" }}
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {marketingNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-[0.9rem] font-medium tracking-wide px-4 py-2 rounded-full transition-all duration-300 active:scale-95 ${
                solid
                  ? "text-zinc-700 dark:text-zinc-200 hover:bg-gold-400/12 hover:text-[#9e7e40] dark:hover:text-[#E2C785]"
                  : "text-white hover:bg-white/20 hover:text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href={ROUTES.LOGIN}>
            <Button
              variant="ghost"
              size="sm"
              className={`font-medium tracking-wide text-[0.9rem] rounded-full px-4 active:scale-95 transition-all duration-300 ${
                solid
                  ? "text-zinc-700 dark:text-zinc-200 hover:bg-gold-400/12 hover:text-[#9e7e40]"
                  : "text-white hover:bg-white/20 hover:text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]"
              }`}
            >
              Masuk
            </Button>
          </Link>
          <Link href={ROUTES.LOGIN}>
            <Button
              size="sm"
              className="rounded-full bg-gold-400 hover:bg-[#b39150] text-white text-[0.9rem] font-semibold tracking-wide px-5 cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              Buat Undangan
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 focus:outline-none transition-colors ${
            solid
              ? "text-zinc-700 dark:text-zinc-200 hover:text-gold-400"
              : "text-white hover:text-white/80 [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]"
          }`}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-5 rounded-2xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border border-gold-400/35 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col gap-2">
            {marketingNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold tracking-wide text-zinc-800 dark:text-zinc-200 px-4 py-3 rounded-xl hover:bg-gold-400/15 hover:text-[#9e7e40] dark:hover:text-[#E2C785] active:scale-95 transition-all duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 pt-2">
            <Link href={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center">
                Masuk
              </Button>
            </Link>
            <Link href={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center bg-gold-400 hover:bg-[#b39150] text-white transition-all active:scale-95 shadow-md">
                Buat Undangan
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
