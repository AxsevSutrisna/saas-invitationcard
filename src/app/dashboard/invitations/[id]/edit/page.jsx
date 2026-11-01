import { Suspense } from "react";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { serialize } from "@/lib/utils";
import { findActiveSubscriptionByUserId } from "@/features/subscription/repository";
import { getInvitationForEdit } from "@/features/invitation/repository";
import { InvitationWizard } from "@/features/invitation";
import { ROUTES } from "@/constants/routes";

export const metadata = {
  title: "Edit Undangan — IKARA",
  description: "Perbarui informasi undangan pernikahan digital IKARA.",
  robots: { index: false, follow: false },
};

// DateTime → "YYYY-MM-DD" untuk <input type="date"> / field form.
function toDateInput(value) {
  if (!value) return "";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

export default async function EditInvitationPage({ params }) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(ROUTES.LOGIN || "/login");
  }

  // Dibatasi ke pemilik — user lain tidak bisa mengakses undangan ini.
  const invitation = await getInvitationForEdit(id, session.user.id);
  if (!invitation) {
    notFound();
  }

  const [activeSubscription, themes, quoteTemplates, musicTemplates] =
    await Promise.all([
      findActiveSubscriptionByUserId(session.user.id),
      db.theme.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      db.quoteTemplate.findMany(),
      db.musicTemplate.findMany({ where: { isActive: true } }),
    ]);

  // Map data DB → bentuk yang dipakai form wizard (semua serializable).
  const initialData = {
    title: invitation.title ?? "",
    slug: invitation.slug ?? "",
    themeId: invitation.themeId ?? "",

    groomNickname: invitation.groomNickname ?? "",
    groomFullName: invitation.groomFullName ?? "",
    groomFather: invitation.groomFather ?? "",
    groomMother: invitation.groomMother ?? "",
    groomPhotoUrl: invitation.groomPhotoUrl ?? "",

    brideNickname: invitation.brideNickname ?? "",
    brideFullName: invitation.brideFullName ?? "",
    brideFather: invitation.brideFather ?? "",
    brideMother: invitation.brideMother ?? "",
    bridePhotoUrl: invitation.bridePhotoUrl ?? "",

    coverUrl: invitation.coverUrl ?? "",
    quotes: invitation.quotes ?? "",
    openingText: invitation.openingText ?? "",
    musicUrl: invitation.musicUrl ?? "",
    musicTitle: invitation.musicTitle ?? "",
    isMusicEnabled: invitation.isMusicEnabled ?? true,

    galleryLayout: invitation.galleryLayout ?? "CAROUSEL",

    physicalGiftAddress: invitation.physicalGiftAddress ?? "",
    physicalGiftReceiver: invitation.physicalGiftReceiver ?? "",
    physicalGiftPhone: invitation.physicalGiftPhone ?? "",

    isPublished: invitation.isPublished ?? true,

    events: invitation.events.map((e) => ({
      name: e.name ?? "",
      date: toDateInput(e.date),
      startTime: e.startTime ?? "",
      endTime: e.endTime ?? "",
      locationName: e.locationName ?? "",
      address: e.address ?? "",
      mapUrl: e.mapUrl ?? "",
    })),
    loveStories: invitation.loveStories.map((s) => ({
      title: s.title ?? "",
      date: s.date ?? "",
      description: s.description ?? "",
      imageUrl: s.imageUrl ?? "",
    })),
    galleries: invitation.galleries.map((g) => ({
      mediaUrl: g.mediaUrl ?? "",
      thumbnailUrl: g.thumbnailUrl ?? "",
      type: g.type ?? "PHOTO",
      caption: g.caption ?? "",
    })),
    gifts: invitation.gifts.map((g) => ({
      type: g.type ?? "BANK",
      providerName: g.providerName ?? "",
      accountName: g.accountName ?? "",
      accountNumber: g.accountNumber ?? "",
      qrCodeUrl: g.qrCodeUrl ?? "",
      note: g.note ?? "",
    })),
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Suspense
        fallback={<div className="text-xs text-muted-foreground p-6">Loading form editor...</div>}
      >
        <InvitationWizard
          mode="edit"
          invitationId={invitation.id}
          initialData={initialData}
          themes={themes}
          activeSubscription={activeSubscription ? serialize(activeSubscription) : null}
          quoteTemplates={serialize(quoteTemplates)}
          musicTemplates={serialize(musicTemplates)}
        />
      </Suspense>
    </div>
  );
}
