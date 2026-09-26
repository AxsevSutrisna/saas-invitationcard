import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  getInvitationSummariesByUserId,
  getInvitationAnalytics,
} from "@/features/invitation/repository";
import { findActiveSubscriptionByUserId } from "@/features/subscription/repository";
import {
  getRsvpsWithGuestByInvitationId,
  countGuestsWithoutRsvp,
} from "@/features/analytics/repository";
import { AnalyticsClient } from "@/features/analytics/components/AnalyticsClient";
import { serialize } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { Mail, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata = {
  title: "Analitik Undangan — IKARA Dashboard",
  description:
    "Pantau performa statistik kunjungan, kehadiran tamu, dan ucapan doa.",
  robots: { index: false, follow: false },
};

export default async function AnalyticsPage({ searchParams }) {
  const session = await auth();

  // 1. Redirect Ke Halaman Login Jika Sesi Kosong
  if (!session || !session.user || !session.user.id) {
    redirect(ROUTES.LOGIN || "/login");
  }

  // 2. Ambil ringkasan undangan (id + judul saja) untuk dropdown pemilih.
  const invitations = await getInvitationSummariesByUserId(session.user.id);

  // Jika belum memiliki undangan -> Tampilkan Empty State
  if (invitations.length === 0) {
    return (
      <EmptyState
        icon={Mail}
        title="Belum Ada Undangan"
        description="Anda belum memiliki undangan pernikahan digital yang aktif. Buat undangan terlebih dahulu untuk mengaktifkan grafik pemantauan analitik."
        action={
          <Link href={ROUTES.INVITATION_NEW}>
            <Button size="lg">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Buat Undangan Pertama
            </Button>
          </Link>
        }
      />
    );
  }

  // 3. Tentukan Undangan Terpilih (dari daftar milik user → aman dari IDOR).
  const resolvedSearchParams = await searchParams;
  const selectedId = resolvedSearchParams.invitationId;
  const selected =
    invitations.find((i) => i.id === selectedId) || invitations[0];

  // 4. Ambil detail undangan terpilih + data pendukung secara paralel.
  //    Hanya undangan terpilih yang dimuat relasinya (bukan seluruh daftar).
  const [selectedInvitation, rsvps, nonRespondedCount, activeSubscription] =
    await Promise.all([
      getInvitationAnalytics(selected.id, session.user.id),
      getRsvpsWithGuestByInvitationId(selected.id),
      countGuestsWithoutRsvp(selected.id),
      findActiveSubscriptionByUserId(session.user.id),
    ]);

  // 7. Hitung Selisih Hari Menuju Acara Pertama
  let daysDiff = 0;
  if (selectedInvitation.events && selectedInvitation.events.length > 0) {
    const sortedEvents = [...selectedInvitation.events].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const eventDate = new Date(sortedEvents[0].date);
    const today = new Date();
    eventDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = eventDate - today;
    daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (daysDiff < 0) daysDiff = 0;
  }

  // 8. Hitung Total Porsi / Pax Tamu yang Mengonfirmasi Hadir
  const attendingCount = rsvps
    .filter((r) => r.attendance === "YES")
    .reduce((sum, r) => sum + r.pax, 0);

  // 9. Serialisasi Data Objek Prisma (mencegah Next.js SSR Date serialization errors)
  const serializedInvitations = serialize(invitations);
  const serializedSelectedInvitation = serialize(selectedInvitation);
  const serializedActiveSubscription = activeSubscription ? serialize(activeSubscription) : null;
  const serializedRsvps = serialize(rsvps);

  return (
    <AnalyticsClient
      invitations={serializedInvitations}
      selectedInvitation={serializedSelectedInvitation}
      activeSubscription={serializedActiveSubscription}
      rsvps={serializedRsvps}
      nonRespondedCount={nonRespondedCount}
      daysDiff={daysDiff}
      attendingCount={attendingCount}
    />
  );
}
