import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { db } from "@/lib/db";
import { serialize } from "@/lib/utils";
import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
// Section atas lipatan → eager (kritis LCP).
import { HeroSection, TrustBarSection } from "@/features/landing";
// Section yang butuh data DB → dirender di dalam wrapper async + <Suspense>.
import { ThemeGallerySection, PricingSection, FAQSection } from "@/features/landing";
// Section bawah lipatan tanpa data → chunk terpisah lewat boundary client.
import { BelowFoldSections } from "@/features/landing/components/BelowFoldSections";

export const metadata = {
  title: "IKARA — Every Promise Has a Story",
  description:
    "IKARA adalah platform digital untuk mengabadikan dan membagikan kisah cinta serta janji pernikahan Anda melalui pengalaman yang indah, personal, dan bermakna.",
};

/*
 * Streaming SSR: page tidak lagi menunggu SEMUA query DB sebelum render.
 * Shell (Navbar, Hero, TrustBar, Footer) langsung ter-flush; tiap section
 * yang butuh data (tema, harga, FAQ, nomor WA) mengambil datanya sendiri di
 * dalam Server Component async dan di-stream begitu query-nya selesai — tanpa
 * saling memblokir. Konten tetap dirender server → aman untuk SEO.
 */

async function ThemeGalleryData() {
  const themes = await db.theme.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: 3,
  });
  return <ThemeGallerySection initialThemes={serialize(themes)} />;
}

async function PricingData() {
  const packages = await db.package.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });
  return <PricingSection packages={serialize(packages)} />;
}

async function FaqData() {
  const faqs = await db.fAQ.findMany({ orderBy: { sortOrder: "asc" } });
  return <FAQSection faqs={serialize(faqs)} />;
}

async function FloatingWhatsApp() {
  const setting = await db.systemSetting.findUnique({
    where: { key: "CS_WHATSAPP_NUMBER" },
  });
  return <WhatsAppButton phoneNumber={setting?.value || "6281234567890"} />;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2] dark:bg-[#191919] text-foreground font-sans selection:bg-[#C8A96A]/20 selection:text-[#C8A96A] relative overflow-hidden">
      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar overlay />
        <main className="flex-1 space-y-0">
          {/* 1. Hero & TrustBar (atas lipatan, tanpa data) */}
          <HeroSection />
          <TrustBarSection />

          {/* 2. Theme Gallery (butuh data tema → stream) */}
          <Suspense fallback={<SectionSkeleton tone="dark" />}>
            <ThemeGalleryData />
          </Suspense>

          {/* 3–5. Showcase bawah lipatan tanpa data (chunk terpisah) */}
          <BelowFoldSections />

          {/* 6. Pricing (butuh data paket → stream) */}
          <Suspense fallback={<SectionSkeleton tone="dark" />}>
            <PricingData />
          </Suspense>

          {/* 7. FAQ (butuh data FAQ → stream) */}
          <Suspense fallback={<SectionSkeleton tone="light" rows={4} />}>
            <FaqData />
          </Suspense>
        </main>
        <Footer />

        {/* Tombol WA melayang (butuh setelan nomor → stream, non-blocking) */}
        <Suspense fallback={null}>
          <FloatingWhatsApp />
        </Suspense>
      </div>
    </div>
  );
}
