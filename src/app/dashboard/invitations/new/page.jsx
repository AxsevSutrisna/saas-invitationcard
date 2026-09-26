import { Suspense } from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { serialize } from "@/lib/utils";
import { findActiveSubscriptionByUserId } from "@/features/subscription/repository";
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

  // 2. Ambil data paralel: langganan, tema, template kutipan & musik
  const [activeSubscription, themes, quoteTemplates, musicTemplates] = await Promise.all([
    findActiveSubscriptionByUserId(session.user.id),
    db.theme.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    db.quoteTemplate.findMany(),
    db.musicTemplate.findMany({ where: { isActive: true } }),
  ]);

  const serializedSubscription = activeSubscription ? serialize(activeSubscription) : null;
  const serializedQuotes = serialize(quoteTemplates);
  const serializedMusics = serialize(musicTemplates);

  return (
    <div className="max-w-6xl mx-auto">
      <Suspense fallback={<div className="text-xs text-muted-foreground p-6">Loading form editor...</div>}>
        <InvitationWizard
          themes={themes}
          activeSubscription={serializedSubscription}
          quoteTemplates={serializedQuotes}
          musicTemplates={serializedMusics}
        />
      </Suspense>
    </div>
  );
}
