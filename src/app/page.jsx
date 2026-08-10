import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { db } from "@/lib/db";
import {
  HeroSection,
  TrustBarSection,
  InteractiveScrollSection,
  RealtimeEditorSection,
  ThemeGallerySection,
  HowItWorksSection,
  PricingSection,
  FAQSection,
} from "@/features/landing";

export const metadata = {
  title: "IKARA — Every Promise Has a Story",
  description:
    "IKARA adalah platform digital untuk mengabadikan dan membagikan kisah cinta serta janji pernikahan Anda melalui pengalaman yang indah, personal, dan bermakna.",
};

export default async function LandingPage() {
  // 1. Ambil data dinamis paket, FAQ, dan setelan WA dari database
  const packages = await db.package.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });

  const faqs = await db.fAQ.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const whatsappSetting = await db.systemSetting.findUnique({
    where: { key: "CS_WHATSAPP_NUMBER" },
  });
  const whatsappNumber = whatsappSetting?.value || "6281234567890";

  // Serialisasi data untuk mencegah warning Next.js SSR Date
  const serializedPackages = JSON.parse(JSON.stringify(packages));
  const serializedFaqs = JSON.parse(JSON.stringify(faqs));

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2] dark:bg-[#191919] text-foreground font-sans selection:bg-[#C8A96A]/20 selection:text-[#C8A96A] relative overflow-hidden">
      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 space-y-0">
          {/* 1. Hero & TrustBar (LIGHT: bg-[#F8F6F2] — top header zone) */}
          <HeroSection />
          <TrustBarSection />

          {/* 2. Theme Gallery Section (DARK: bg-[#1F1F1F] — has GlassCard) */}
          <ThemeGallerySection />

          {/* 3. Interactive Scroll Showcase (LIGHT: bg-[#F8F6F2]) */}
          <InteractiveScrollSection />

          {/* 4. How It Works Section (DARK: bg-[#1F1F1F] — has GlassCard) */}
          <HowItWorksSection />

          {/* 5. Realtime Editor Showcase (LIGHT: bg-[#F8F6F2]) */}
          <RealtimeEditorSection />

          {/* 6. Pricing Section (DARK: bg-[#1F1F1F] — has GlassCard) */}
          <PricingSection packages={serializedPackages} />

          {/* 7. FAQ Section (LIGHT: bg-[#F8F6F2]) */}
          <FAQSection faqs={serializedFaqs} />
        </main>
        <Footer />
        <WhatsAppButton phoneNumber={whatsappNumber} />
      </div>
    </div>
  );
}
