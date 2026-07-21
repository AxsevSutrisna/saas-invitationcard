"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { marketingNav } from "@/config/navigation.config";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

/**
 * Navbar - Floating Glassmorphism Navbar Component
 * Navigasi melayang berbentuk pill dengan backdrop blur, logo IKARA, link halus, & tombol CTA.
 */
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
    <header className="sticky top-4 z-40 px-4 sm:px-6 w-full max-w-6xl mx-auto transition-all duration-300">
      <div
        className={`flex items-center justify-between px-6 py-3 rounded-full border transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-[#1F1F1F]/80 backdrop-blur-md shadow-lg border-[#C8A96A]/30"
            : "bg-white/60 dark:bg-[#1F1F1F]/60 backdrop-blur-sm border-border/50 shadow-sm"
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
              loading="eager"
              priority={true}
            />
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          {marketingNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="#faq"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href={ROUTES.LOGIN}>
            <Button variant="ghost" size="sm" className="font-medium text-sm">
              Masuk
            </Button>
          </Link>
          <Link href={ROUTES.REGISTER}>
            <Button
              size="sm"
              className="rounded-full bg-gradient-to-r from-[#C8A96A] to-[#b39150] hover:from-[#b39150] hover:to-[#9e7e40] text-white shadow-md hover:shadow-lg transition-all text-sm font-medium px-5"
            >
              Buat Undangan
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground focus:outline-none"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-5 rounded-2xl bg-white/95 dark:bg-[#1F1F1F]/95 backdrop-blur-md border border-[#C8A96A]/30 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col gap-3">
            {marketingNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-foreground py-1 border-b border-border/30"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-foreground py-1 border-b border-border/30"
            >
              FAQ
            </Link>
          </nav>
          <div className="flex flex-col gap-2 pt-2">
            <Link href={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center">
                Masuk
              </Button>
            </Link>
            <Link href={ROUTES.REGISTER} onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center bg-[#C8A96A] hover:bg-[#b39150] text-white">
                Buat Undangan
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
