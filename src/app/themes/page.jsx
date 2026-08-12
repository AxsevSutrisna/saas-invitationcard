import { db } from "@/lib/db";
import { ThemesClient } from "./ThemesClient";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

export const metadata = {
  title: "Koleksi Tema Undangan — IKARA",
  description: "Lihat dan pilih tema undangan digital premium terbaik dari IKARA.",
};

export default async function PublicThemesPage() {
  const themes = await db.theme.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const whatsappSetting = await db.systemSetting.findUnique({
    where: { key: "CS_WHATSAPP_NUMBER" },
  });
  const whatsappNumber = whatsappSetting?.value || "6281234567890";

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2] dark:bg-[#191919] text-foreground font-sans selection:bg-[#C8A96A]/20 selection:text-[#C8A96A] relative overflow-hidden">
      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar />
        
        {/* Main Content Area (padding top to account for fixed navbar) */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-6 pt-32 pb-20">
          <ThemesClient initialThemes={themes} />
        </main>
        
        <Footer />
        <WhatsAppButton phoneNumber={whatsappNumber} />
      </div>
    </div>
  );
}
