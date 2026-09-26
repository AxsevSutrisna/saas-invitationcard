import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getInvitationsByUserId } from "@/features/invitation/repository";
import { getGuestsByInvitationId } from "@/features/guest/repository";
import { GuestManagementClient } from "@/features/guest/components/GuestManagementClient";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Mail, Plus } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export const metadata = {
  title: "Kelola Tamu & RSVP — IKARA Dashboard",
  description:
    "Manajemen daftar tamu, kirim link personal, lacak status dibuka, serta rekap data RSVP kehadiran pernikahan.",
  robots: { index: false, follow: false },
};

export default async function GuestsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const session = await auth();
  if (!session?.user?.id) {
    redirect(ROUTES.LOGIN);
  }

  // Get user invitations
  const invitations = await getInvitationsByUserId(session.user.id);

  if (invitations.length === 0) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Manajemen Tamu & RSVP"
          description="Kelola daftar tamu, salin link personal, dan pantau status kehadiran real-time."
        />
        <EmptyState
          icon={Mail}
          title="Belum Ada Undangan"
          description="Anda harus membuat undangan pernikahan terlebih dahulu sebelum dapat mengelola daftar tamu dan memantau RSVP."
          action={
            <Link href={ROUTES.INVITATION_NEW}>
              <Button size="lg">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Buat Undangan Pertama
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const selectedInvitationId = resolvedSearchParams.invitationId || invitations[0].id;
  const selectedInvitation = invitations.find(i => i.id === selectedInvitationId) || invitations[0];
  const initialGuests = await getGuestsByInvitationId(selectedInvitation.id);

  return (
    <GuestManagementClient
      invitations={invitations}
      selectedInvitation={selectedInvitation}
      initialGuests={initialGuests}
    />
  );
}
