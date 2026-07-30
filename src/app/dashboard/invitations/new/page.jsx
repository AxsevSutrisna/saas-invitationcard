import { Suspense } from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { findActiveSubscriptionByUserId } from "@/server/repositories/subscription.repository";
import { InvitationWizard } from "@/features/invitation";
import { ROUTES } from "@/constants/routes";

export const metadata = {
  title: "Buat Undangan Baru — IKARA",
  description: "Formulir pembuatan undangan pernikahan digital IKARA.",
};

export default async function NewInvitationPage() {
  const session = await auth();

  // 1. Redirect if not authenticated
  if (!session || !session.user || !session.user.id) {
    redirect(ROUTES.LOGIN || "/login");
  }

  // 2. Fetch active subscription
  const activeSubscription = await findActiveSubscriptionByUserId(session.user.id);
  const serializedSubscription = activeSubscription
    ? JSON.parse(JSON.stringify(activeSubscription))
    : null;

  // 3. Fetch active themes
  let themes = await db.theme.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  // Fallback if themes database is empty
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
        <InvitationWizard themes={themes} activeSubscription={serializedSubscription} />
      </Suspense>
    </div>
  );
}
