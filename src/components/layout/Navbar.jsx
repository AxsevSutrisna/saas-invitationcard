"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { marketingNav } from "@/config/navigation.config";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 w-full max-w-6xl mx-auto transition-all duration-300">
      <div
        className={`flex items-center justify-between px-6 py-3 rounded-full border transition-all duration-500 ${
          scrolled
            ? "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-lg shadow-[#C8A96A]/10 border-[#C8A96A]/20"
            : "bg-white/10 dark:bg-black/20 backdrop-blur-md border-white/20 shadow-sm"
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
              className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 active:scale-95 ${
                scrolled
                  ? "text-zinc-800 dark:text-zinc-200 hover:bg-[#C8A96A]/15 hover:text-[#9e7e40] dark:hover:text-[#E2C785]"
                  : "text-white/90 hover:bg-white/20 hover:text-white drop-shadow-md"
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
              className={`font-medium text-sm rounded-full px-4 active:scale-95 transition-all duration-300 ${
                scrolled
                  ? "text-zinc-800 dark:text-zinc-200 hover:bg-[#C8A96A]/15 hover:text-[#9e7e40]"
                  : "text-white/90 hover:bg-white/20 hover:text-white drop-shadow-md"
              }`}
            >
              Masuk
            </Button>
          </Link>
          <Link href={ROUTES.LOGIN}>
            <Button
              size="sm"
              className="rounded-full bg-[#C8A96A] hover:bg-[#b39150] text-white text-sm font-medium px-5 cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              Buat Undangan
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 focus:outline-none transition-colors ${
            scrolled ? "text-zinc-800 dark:text-zinc-200 hover:text-[#C8A96A]" : "text-white hover:text-white/80 drop-shadow-md"
          }`}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-5 rounded-2xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border border-[#C8A96A]/35 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col gap-2">
            {marketingNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-zinc-800 dark:text-zinc-200 px-4 py-3 rounded-xl hover:bg-[#C8A96A]/15 hover:text-[#9e7e40] dark:hover:text-[#E2C785] active:scale-95 transition-all duration-300"
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
              <Button className="w-full justify-center bg-[#C8A96A] hover:bg-[#b39150] text-white transition-all active:scale-95 shadow-md">
                Buat Undangan
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
