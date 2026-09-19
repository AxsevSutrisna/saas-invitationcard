"use client";

import { useRouter } from "next/navigation";
import {
  Calendar,
  Infinity,
  Users,
  Eye,
  MessageSquare,
  Mail,
  ChevronDown,
  Sparkles,
  UserCheck,
  UserX,
  HelpCircle,
  Clock
} from "lucide-react";

import { PageHeader } from "@/components/ui/PageHeader";
import { Surface } from "@/components/ui/Surface";
import { Badge } from "@/components/ui/Badge";

export function AnalyticsClient({
  invitations,
  selectedInvitation,
  activeSubscription,
  rsvps,
  nonRespondedCount,
  daysDiff,
  attendingCount,
}) {
  const router = useRouter();

  const handleInvitationChange = (e) => {
    const id = e.target.value;
    router.push(`/dashboard/analytics?invitationId=${id}`);
  };

  // Hitung persentase untuk grafik komposisi
  const totalReplies = rsvps.length;
  const totalGuests = selectedInvitation._count?.guests || 0;

  const yesCount = rsvps.filter((r) => r.attendance === "YES").length;
  const noCount = rsvps.filter((r) => r.attendance === "NO").length;
  const maybeCount = rsvps.filter((r) => r.attendance === "MAYBE").length;

  const getPercentage = (count) => {
    if (totalGuests === 0) return 0;
    return Math.round((count / totalGuests) * 100);
  };

  const yesPercent = getPercentage(yesCount);
  const noPercent = getPercentage(noCount);
  const maybePercent = getPercentage(maybeCount);
  const noResponsePercent = getPercentage(nonRespondedCount);

  // Filter ucapan yang terisi pesan saja
  const messages = rsvps.filter((r) => r.message && r.message.trim() !== "");

  const activePackage = activeSubscription?.package;
  const isPremiumActive = activeSubscription && activePackage && activePackage.price > 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Halaman & Selector Dropdown */}
      <PageHeader
        title="Analitik Undangan"
        description="Pantau statistik tingkat kehadiran, jumlah pengunjung, dan ucapan tamu secara real-time."
        action={
          invitations.length > 1 ? (
            <div className="relative inline-block w-full sm:w-64">
              <label htmlFor="analytics-invitation" className="sr-only">
                Pilih undangan
              </label>
              <select
                id="analytics-invitation"
                value={selectedInvitation.id}
                onChange={handleInvitationChange}
                className="w-full appearance-none rounded-xl border border-border/80 bg-card px-4 py-2.5 pr-10 text-xs font-semibold text-foreground shadow-sm transition-all outline-none cursor-pointer focus:border-gold-400 focus-visible:ring-2 focus-visible:ring-gold-400/60 focus-visible:outline-none"
              >
                {invitations.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.title}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>
          ) : null
        }
      />

      {/* 4 Metric Cards Grid */}
      <section
        aria-label="Ringkasan statistik undangan"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {/* Card 1: H-Day Countdown */}
        <Surface as="article" className="relative space-y-4 overflow-hidden">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400">
            <Calendar className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Menuju Hari H
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-2xl font-bold text-foreground">
                {daysDiff}
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                {daysDiff > 0 ? "Hari Lagi" : "Hari Ini / Sudah Lewat"}
              </span>
            </div>
          </div>
        </Surface>

        {/* Card 2: Status Akses */}
        <Surface as="article" className="relative space-y-4 overflow-hidden">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
            <Infinity className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Status Akses
            </span>
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 font-heading text-xl font-bold text-gold-400">
                {isPremiumActive ? (
                  <>
                    <Sparkles className="h-4 w-4 fill-current text-gold-400" aria-hidden="true" />
                    <span>{activePackage.name}</span>
                  </>
                ) : (
                  <span>Free Trial</span>
                )}
              </span>
            </div>
          </div>
        </Surface>

        {/* Card 3: Total Tamu Hadir */}
        <Surface as="article" className="relative space-y-4 overflow-hidden">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
            <Users className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Tamu Hadir
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-2xl font-bold text-foreground">
                {attendingCount}
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                Pax Porsi Konfirmasi
              </span>
            </div>
          </div>
        </Surface>

        {/* Card 4: Total Dilihat */}
        <Surface as="article" className="relative space-y-4 overflow-hidden">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
            <Eye className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Dilihat
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-2xl font-bold text-foreground">
                {selectedInvitation._count?.visitorLogs || 0}
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                Kali Kunjungan
              </span>
            </div>
          </div>
        </Surface>
      </section>

      {/* Bottom 2 Grid Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Bagan Komposisi Kehadiran */}
        <Surface
          as="article"
          padding="none"
          className="flex flex-col justify-between space-y-6 p-6 sm:p-8"
        >
          <div>
            <h2 className="font-heading text-base font-bold text-foreground">
              Komposisi Kehadiran Tamu
            </h2>
            <p className="mt-0.5 text-xs font-light text-muted-foreground">
              Persentase kehadiran dari total {totalGuests} nama undangan terdaftar ({totalReplies} balasan)
            </p>
          </div>

          {totalReplies === 0 && nonRespondedCount === 0 ? (
            <div className="flex h-56 flex-col items-center justify-center space-y-2 rounded-2xl border border-dashed border-border/60 bg-zinc-50/50 p-4 text-center dark:bg-zinc-900/40">
              <MessageSquare className="h-8 w-8 text-muted-foreground/30" aria-hidden="true" />
              <p className="text-xs text-muted-foreground">
                Belum ada data tamu undangan terdaftar.
              </p>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {/* Bar Grafik Custom HTML/CSS */}
              <div className="space-y-3.5">
                {/* 1. Hadir */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                    <span className="flex items-center gap-1.5">
                      <UserCheck className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                      Hadir
                    </span>
                    <span>{yesCount} Tamu ({yesPercent}%)</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${yesPercent}%` }}
                    />
                  </div>
                </div>

                {/* 2. Ragu */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="h-4 w-4 text-amber-500" aria-hidden="true" />
                      Ragu-Ragu
                    </span>
                    <span>{maybeCount} Tamu ({maybePercent}%)</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${maybePercent}%` }}
                    />
                  </div>
                </div>

                {/* 3. Tidak Hadir */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                    <span className="flex items-center gap-1.5">
                      <UserX className="h-4 w-4 text-rose-500" aria-hidden="true" />
                      Tidak Hadir
                    </span>
                    <span>{noCount} Tamu ({noPercent}%)</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-rose-500 transition-all duration-500"
                      style={{ width: `${noPercent}%` }}
                    />
                  </div>
                </div>

                {/* 4. Belum Merespon */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                      Belum Merespon
                    </span>
                    <span>{nonRespondedCount} Tamu ({noResponsePercent}%)</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-zinc-400 transition-all duration-500 dark:bg-zinc-600"
                      style={{ width: `${noResponsePercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Surface>

        {/* Daftar Ucapan & Doa Terbaru */}
        <Surface
          as="article"
          padding="none"
          className="flex flex-col justify-between space-y-6 p-6 sm:p-8"
        >
          <div>
            <h2 className="font-heading text-base font-bold text-foreground">
              Ucapan & Doa Terbaru
            </h2>
            <p className="mt-0.5 text-xs font-light text-muted-foreground">
              Doa tulus dan harapan baik dari tamu undangan Anda
            </p>
          </div>

          {messages.length === 0 ? (
            <div className="flex h-56 flex-col items-center justify-center space-y-2 rounded-2xl border border-dashed border-border/60 bg-zinc-50/50 p-4 text-center dark:bg-zinc-900/40">
              <Mail className="h-8 w-8 text-muted-foreground/30" aria-hidden="true" />
              <p className="text-xs text-muted-foreground">
                Belum ada ucapan doa dari tamu undangan Anda.
              </p>
            </div>
          ) : (
            <div className="scrollbar-thin h-56 space-y-3.5 overflow-y-auto pr-2">
              {messages.slice(0, 5).map((msg) => (
                <div
                  key={msg.id}
                  className="space-y-1.5 rounded-2xl border border-border/40 bg-zinc-50 p-3.5 text-xs transition-colors hover:border-gold-400/40 dark:bg-zinc-900/60"
                >
                  <div className="flex items-center justify-between border-b border-border/20 pb-1.5">
                    <span className="max-w-45 truncate font-bold text-foreground">
                      {msg.guest?.name || msg.name || "Tamu Anonim"}
                    </span>
                    {msg.attendance === "YES" ? (
                      <Badge variant="success">HADIR</Badge>
                    ) : msg.attendance === "NO" ? (
                      <Badge variant="danger">TIDAK</Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                        RAGU
                      </Badge>
                    )}
                  </div>
                  <p className="italic leading-relaxed text-muted-foreground">
                    &ldquo;{msg.message}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}
        </Surface>

      </div>
    </div>
  );
}
