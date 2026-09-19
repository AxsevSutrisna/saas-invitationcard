import { cache } from "react";
import { notFound } from "next/navigation";
import { getInvitationBySlug } from "@/features/invitation/repository";
import { getRsvpsByInvitationId } from "@/features/rsvp/repository";
import { findActiveSubscriptionByUserId } from "@/features/subscription/repository";
import { PublicInvitationClient } from "@/features/theme/components/PublicInvitationClient";

// Dedupe fetch undangan: dipakai generateMetadata & page dalam 1 request
const loadInvitation = cache((slug) => getInvitationBySlug(slug));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const invitation = await loadInvitation(slug);

  if (!invitation) {
    return {
      title: "Undangan Tidak Ditemukan - IKARA",
    };
  }

  const groom = invitation.groomNickname || "Pria";
  const bride = invitation.brideNickname || "Wanita";

  return {
    title: `${invitation.title || `Pernikahan ${groom} & ${bride}`} - IKARA`,
    description: `Undangan Pernikahan Digital untuk ${invitation.groomFullName} dan ${invitation.brideFullName}. Abadikan janji suci Anda dengan IKARA.`,
    openGraph: {
      title: `${invitation.title} - IKARA`,
      description: `Undangan Pernikahan Digital ${groom} & ${bride}.`,
      images: invitation.coverUrl ? [{ url: invitation.coverUrl }] : [],
    },
  };
}

export default async function PublicInvitationPage({ params, searchParams }) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const invitation = await loadInvitation(slug);

  if (!invitation || !invitation.isPublished) {
    notFound();
  }

  // Kedua query di bawah independen -> jalankan paralel
  const [activeSub, rsvps] = await Promise.all([
    findActiveSubscriptionByUserId(invitation.userId),
    getRsvpsByInvitationId(invitation.id),
  ]);
  const isPremium = !!activeSub;

  const guestName = resolvedSearchParams.to || "";
  const guestCode = resolvedSearchParams.code || "";

  return (
     <PublicInvitationClient
       invitation={invitation}
       initialRsvps={rsvps}
       guestName={guestName}
       guestCode={guestCode}
       isPremium={isPremium}
     />
  );
}
