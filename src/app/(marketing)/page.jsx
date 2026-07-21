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
    <div className="space-y-0">
      <HeroSection />
      <TrustBarSection />
      <InteractiveScrollSection />
      <RealtimeEditorSection />
      <ThemeGallerySection />
      <HowItWorksSection />
      <PricingSection />
      <FAQSection />
    </div>
  );
}
