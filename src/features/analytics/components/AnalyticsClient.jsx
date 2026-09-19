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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-bold text-[#1F1F1F] dark:text-zinc-50 tracking-tight">
            Analitik Undangan
          </h1>
          <p className="text-sm text-muted-foreground font-light">
            Pantau statistik tingkat kehadiran, jumlah pengunjung, dan ucapan tamu secara real-time.
          </p>
        </div>

        {/* Dropdown Selector Undangan */}
        {invitations.length > 1 && (
          <div className="relative inline-block w-full sm:w-64">
            <select
              value={selectedInvitation.id}
              onChange={handleInvitationChange}
              className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border border-border/80 bg-white dark:bg-[#1A1A1A] text-xs font-semibold cursor-pointer outline-none focus:border-[#C8A96A] text-foreground transition-all shadow-sm"
            >
              {invitations.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.title}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: H-Day Countdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Menuju Hari H
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-2xl font-bold text-foreground">
                {daysDiff}
              </span>
              <span className="text-xs text-muted-foreground font-normal">
                {daysDiff > 0 ? "Hari Lagi" : "Hari Ini / Sudah Lewat"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Status Akses */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Infinity className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Status Akses
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-xl font-bold text-[#C8A96A] flex items-center gap-1">
                {isPremiumActive ? (
                  <>
                    <Sparkles className="w-4 h-4 fill-current text-[#C8A96A]" />
                    <span>{activePackage.name}</span>
                  </>
                ) : (
                  <span>Free Trial</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Tamu Hadir */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Total Tamu Hadir
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-2xl font-bold text-foreground">
                {attendingCount}
              </span>
              <span className="text-xs text-muted-foreground font-normal">
                Pax Porsi Konfirmasi
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Total Dilihat */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Total Dilihat
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-2xl font-bold text-foreground">
                {selectedInvitation._count?.visitorLogs || 0}
              </span>
              <span className="text-xs text-muted-foreground font-normal">
                Kali Kunjungan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 2 Grid Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bagan Komposisi Kehadiran */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-foreground text-md">
              Komposisi Kehadiran Tamu
            </h3>
            <p className="text-xs text-muted-foreground font-light mt-0.5">
              Persentase kehadiran dari total {totalGuests} nama undangan terdaftar ({totalReplies} balasan)
            </p>
          </div>

          {totalReplies === 0 && nonRespondedCount === 0 ? (
            <div className="h-56 rounded-2xl border border-dashed border-border/60 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col items-center justify-center text-center p-4 space-y-2">
              <MessageSquare className="w-8 h-8 text-muted-foreground/30" />
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
                  <div className="flex justify-between items-center text-xs font-semibold text-foreground">
                    <span className="flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-500" />
                      Hadir
                    </span>
                    <span>{yesCount} Tamu ({yesPercent}%)</span>
                  </div>
                  <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${yesPercent}%` }}
                    />
                  </div>
                </div>

                {/* 2. Ragu */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold text-foreground">
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-amber-500" />
                      Ragu-Ragu
                    </span>
                    <span>{maybeCount} Tamu ({maybePercent}%)</span>
                  </div>
                  <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${maybePercent}%` }}
                    />
                  </div>
                </div>

                {/* 3. Tidak Hadir */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold text-foreground">
                    <span className="flex items-center gap-1.5">
                      <UserX className="w-4 h-4 text-red-500" />
                      Tidak Hadir
                    </span>
                    <span>{noCount} Tamu ({noPercent}%)</span>
                  </div>
                  <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all duration-500"
                      style={{ width: `${noPercent}%` }}
                    />
                  </div>
                </div>

                {/* 4. Belum Merespon */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold text-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-zinc-400" />
                      Belum Merespon
                    </span>
                    <span>{nonRespondedCount} Tamu ({noResponsePercent}%)</span>
                  </div>
                  <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-400 dark:bg-zinc-600 rounded-full transition-all duration-500"
                      style={{ width: `${noResponsePercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Daftar Ucapan & Doa Terbaru */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-foreground text-md">
              Ucapan & Doa Terbaru
            </h3>
            <p className="text-xs text-muted-foreground font-light mt-0.5">
              Doa tulus dan harapan baik dari tamu undangan Anda
            </p>
          </div>

          {messages.length === 0 ? (
            <div className="h-56 rounded-2xl border border-dashed border-border/60 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col items-center justify-center text-center p-4 space-y-2">
              <Mail className="w-8 h-8 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">
                Belum ada ucapan doa dari tamu undangan Anda.
              </p>
            </div>
          ) : (
            <div className="h-56 overflow-y-auto space-y-3.5 pr-2 scrollbar-thin">
              {messages.slice(0, 5).map((msg) => (
                <div
                  key={msg.id}
                  className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/40 space-y-1.5 text-xs transition-colors hover:border-[#C8A96A]/40"
                >
                  <div className="flex justify-between items-center border-b border-border/20 pb-1.5">
                    <span className="font-bold text-foreground truncate max-w-[180px]">
                      {msg.guest?.name || msg.name || "Tamu Anonim"}
                    </span>
                    <span
                      className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
                        msg.attendance === "YES"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400"
                          : msg.attendance === "NO"
                          ? "bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400"
                      }`}
                    >
                      {msg.attendance === "YES"
                        ? "HADIR"
                        : msg.attendance === "NO"
                        ? "TIDAK"
                        : "RAGU"}
                    </span>
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{msg.message}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
