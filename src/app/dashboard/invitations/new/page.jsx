import { Suspense } from "react";
import { db } from "@/lib/db";
import { InvitationWizard } from "@/features/invitation";

export const metadata = {
  title: "Buat Undangan Baru — IKARA",
  description: "Formulir pembuatan undangan pernikahan digital IKARA.",
};

export default async function NewInvitationPage() {
  // Fetch daftar tema aktif dari database
  let themes = await db.theme.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  // Fallback jika database belum di-seed
  if (!themes || themes.length === 0) {
    themes = [
      { id: "cm6theme01", name: "Classic Elegance", slug: "classic-elegance", isPremium: false },
      { id: "cm6theme02", name: "Floral Blossom", slug: "floral-blossom", isPremium: true },
      { id: "cm6theme03", name: "Modern Minimalist", slug: "modern-minimalist", isPremium: true },
      { id: "cm6theme04", name: "Floral Blue", slug: "floral-blue", isPremium: true },
    ];
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Suspense fallback={<div className="text-xs text-muted-foreground p-6">Loading form editor...</div>}>
        <InvitationWizard themes={themes} />
      </Suspense>
    </div>
  );
}
