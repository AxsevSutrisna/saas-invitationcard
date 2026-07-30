import { notFound } from "next/navigation";
import { getInvitationBySlug } from "@/server/repositories/invitation.repository";
import { getRsvpsByInvitationId } from "@/server/repositories/rsvp.repository";
import { findActiveSubscriptionByUserId } from "@/server/repositories/subscription.repository";
import { PublicInvitationClient } from "@/features/theme/components/PublicInvitationClient";

/**
 * Dynamic Metadata Generator untuk Optimalisasi SEO
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);

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

/**
 * Halaman Rute Dinamis Publik Undangan: /[slug]
 */
export default async function PublicInvitationPage({ params, searchParams }) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  // 1. Fetch data undangan
  const invitation = await getInvitationBySlug(slug);

  // Jika undangan tidak ditemukan atau belum dipublikasikan, redirect ke 404
  if (!invitation || !invitation.isPublished) {
    notFound();
  }

  // 2. Fetch status langganan pemilik undangan (untuk watermark check)
  const activeSub = await findActiveSubscriptionByUserId(invitation.userId);
  const isPremium = !!activeSub;

  // 3. Fetch list ucapan doa (RSVP)
  const rsvps = await getRsvpsByInvitationId(invitation.id);

  // 4. Ambil parameter nama tamu "?to=Nama+Tamu" & code "?code=uniqueCode"
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
