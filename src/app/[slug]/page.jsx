import { cache } from "react";
import { notFound } from "next/navigation";
import { getInvitationBySlug } from "@/features/invitation/repository";
import { getRsvpsByInvitationId } from "@/features/rsvp/repository";
import { findActiveSubscriptionByUserId } from "@/features/subscription/repository";
import { PublicInvitationClient } from "@/features/theme/components/PublicInvitationClient";
import { siteConfig } from "@/config/site.config";

// Dedupe fetch undangan: dipakai generateMetadata & page dalam 1 request
const loadInvitation = cache((slug) => getInvitationBySlug(slug));

// Gabungkan tanggal acara + jam "HH:MM" menjadi ISO string untuk JSON-LD
function toEventISO(date, time) {
  const d = new Date(date);
  if (typeof time === "string" && /^\d{1,2}:\d{2}$/.test(time)) {
    const [h, m] = time.split(":");
    d.setHours(Number(h), Number(m), 0, 0);
  }
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

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
  const title = `${invitation.title || `Pernikahan ${groom} & ${bride}`} - IKARA`;
  const description = `Undangan Pernikahan Digital untuk ${invitation.groomFullName} dan ${invitation.brideFullName}. Abadikan janji suci Anda dengan IKARA.`;
  const url = `${siteConfig.url}/${invitation.slug}`;
  const images = invitation.coverUrl
    ? [{ url: invitation.coverUrl, width: 1200, height: 630, alt: `${groom} & ${bride}` }]
    : [{ url: siteConfig.ogImage }];

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    alternates: { canonical: url },
    // Undangan bersifat personal → jangan diindeks mesin pencari (privasi),
    // namun tetap kaya untuk preview share (WhatsApp/sosmed).
    robots: { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: siteConfig.name,
      url,
      title,
      description: `Undangan Pernikahan Digital ${groom} & ${bride}.`,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: `Undangan Pernikahan Digital ${groom} & ${bride}.`,
      images: invitation.coverUrl ? [invitation.coverUrl] : [siteConfig.ogImage],
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

  // JSON-LD (schema.org Event) — struktur data untuk crawler & rich preview
  const groom = invitation.groomNickname || "Pria";
  const bride = invitation.brideNickname || "Wanita";
  const primaryEvent = invitation.events?.[0];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: invitation.title || `Pernikahan ${groom} & ${bride}`,
    description: `Undangan pernikahan ${groom} & ${bride}.`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: `${siteConfig.url}/${invitation.slug}`,
    ...(invitation.coverUrl ? { image: [invitation.coverUrl] } : {}),
    ...(primaryEvent
      ? {
          startDate: toEventISO(primaryEvent.date, primaryEvent.startTime),
          location: {
            "@type": "Place",
            name: primaryEvent.locationName,
            address: primaryEvent.address,
          },
        }
      : {}),
  };

  return (
    <>
     <script
       type="application/ld+json"
       dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
     />
     <PublicInvitationClient
       invitation={invitation}
       initialRsvps={rsvps}
       guestName={guestName}
       guestCode={guestCode}
       isPremium={isPremium}
     />
    </>
  );
}
