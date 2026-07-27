import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getInvitationsByUserId } from "@/server/repositories/invitation.repository";
import { getGuestsByInvitationId } from "@/server/repositories/guest.repository";
import { GuestManagementClient } from "@/features/dashboard/components/GuestManagementClient";
import { Button } from "@/components/ui/button";
import { Mail, Plus } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export const metadata = {
  title: "Kelola Tamu & RSVP | IKARA Dashboard",
  description: "Manajemen daftar tamu, kirim link personal, lacak status dibuka, serta rekap data RSVP kehadiran pernikahan.",
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
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-bold text-[#1F1F1F] dark:text-zinc-50 tracking-tight">
            Manajemen Tamu & RSVP
          </h1>
          <p className="text-sm text-muted-foreground font-light">
            Kelola daftar tamu, salin link personal, dan pantau status kehadiran real-time.
          </p>
        </div>

        <div className="min-h-[400px] rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#C8A96A]/20 to-amber-100 dark:from-[#C8A96A]/20 dark:to-zinc-800 border border-[#C8A96A]/30 flex items-center justify-center text-[#C8A96A] shadow-inner">
            <Mail className="w-10 h-10 stroke-[1.5]" />
          </div>

          <div className="space-y-2 max-w-md">
            <h2 className="font-heading text-2xl font-bold text-[#1F1F1F] dark:text-zinc-100">
              Belum Ada Undangan
            </h2>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Anda harus membuat undangan pernikahan terlebih dahulu sebelum dapat mengelola daftar tamu dan memantau RSVP.
            </p>
          </div>

          <div className="pt-2">
            <Link href={ROUTES.INVITATION_NEW}>
              <Button
                size="lg"
                className="h-12 px-7 rounded-2xl bg-gradient-to-r from-[#C8A96A] to-[#b39150] hover:from-[#b39150] hover:to-[#9e7e40] text-white font-medium text-sm shadow-lg shadow-[#C8A96A]/25 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                Buat Undangan Pertama
              </Button>
            </Link>
          </div>
        </div>
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
