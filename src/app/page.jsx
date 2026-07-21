import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
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

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2] dark:bg-[#191919] text-foreground font-sans selection:bg-[#C8A96A]/20 selection:text-[#C8A96A]">
      <Navbar />
      <main className="flex-1 space-y-0">
        <HeroSection />
        <TrustBarSection />
        <InteractiveScrollSection />
        <RealtimeEditorSection />
        <ThemeGallerySection />
        <HowItWorksSection />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
