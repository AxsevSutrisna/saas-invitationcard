import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getInvitationsByUserId } from "@/server/repositories/invitation.repository";
import { findActiveSubscriptionByUserId } from "@/server/repositories/subscription.repository";
import { AnalyticsClient } from "@/features/dashboard/components/AnalyticsClient";
import { db } from "@/lib/db";
import { ROUTES } from "@/constants/routes";
import { Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Analitik Undangan — IKARA",
  description: "Pantau performa statistik kunjungan, kehadiran tamu, dan ucapan doa.",
};

export default async function AnalyticsPage({ searchParams }) {
  const session = await auth();

  // 1. Redirect Ke Halaman Login Jika Sesi Kosong
  if (!session || !session.user || !session.user.id) {
    redirect(ROUTES.LOGIN || "/login");
  }

  // 2. Ambil Seluruh Daftar Undangan Milik Pengguna Aktif
  const invitations = await getInvitationsByUserId(session.user.id);

  // Jika belum memiliki undangan -> Tampilkan Empty State
  if (invitations.length === 0) {
    return (
      <div className="min-h-[420px] rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#C8A96A]/20 to-amber-100 dark:from-[#C8A96A]/20 dark:to-zinc-800 border border-[#C8A96A]/30 flex items-center justify-center text-[#C8A96A] shadow-inner">
          <Mail className="w-10 h-10 stroke-[1.5]" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="font-heading text-2xl font-bold text-[#1F1F1F] dark:text-zinc-100">
            Belum Ada Undangan
          </h2>
          <p className="text-sm text-muted-foreground font-light leading-relaxed">
            Anda belum memiliki undangan pernikahan digital yang aktif. Buat undangan terlebih dahulu untuk mengaktifkan grafik pemantauan analitik.
          </p>
        </div>
        <div className="pt-2">
          <Link href={ROUTES.INVITATION_NEW}>
            <Button
              size="lg"
              className="h-12 px-7 rounded-2xl bg-gradient-to-r from-[#C8A96A] to-[#b39150] hover:from-[#b39150] hover:to-[#9e7e40] text-white font-medium text-sm shadow-lg shadow-[#C8A96A]/25 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              Buat Undangan Pertama
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 3. Tentukan Undangan Terpilih Berdasarkan Query Parameter URL
  const resolvedSearchParams = await searchParams;
  const selectedId = resolvedSearchParams.invitationId;
  const selectedInvitation = selectedId
    ? invitations.find((i) => i.id === selectedId) || invitations[0]
    : invitations[0];

  // 4. Ambil Daftar Konfirmasi Kehadiran (RSVP) dari Database Neon
  const rsvps = await db.rSVP.findMany({
    where: { invitationId: selectedInvitation.id },
    include: {
      guest: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // 5. Ambil Jumlah Tamu Undangan yang Belum Mengisi RSVP
  const nonRespondedCount = await db.guest.count({
    where: {
      invitationId: selectedInvitation.id,
      rsvp: null,
    },
  });

  // 6. Ambil Status Langganan Pengguna Aktif
  const activeSubscription = await findActiveSubscriptionByUserId(session.user.id);

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
  const serializedInvitations = JSON.parse(JSON.stringify(invitations));
  const serializedSelectedInvitation = JSON.parse(JSON.stringify(selectedInvitation));
  const serializedActiveSubscription = activeSubscription
    ? JSON.parse(JSON.stringify(activeSubscription))
    : null;
  const serializedRsvps = JSON.parse(JSON.stringify(rsvps));

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
