"use client";

import { MessageSquare, Calendar } from "lucide-react";

export function GuestWishes({ rsvps = [] }) {
  // Hanya ambil rsvps yang menyertakan ucapan/pesan
  const wishes = rsvps.filter((r) => r.message && r.message.trim() !== "");

  if (wishes.length === 0) {
    return (
      <div className="py-8 text-center space-y-2 border border-dashed border-[#C8A96A]/20 rounded-2xl bg-white/40 dark:bg-zinc-800/40">
        <MessageSquare className="w-8 h-8 text-[#C8A96A]/40 mx-auto stroke-[1.5]" />
        <p className="text-xs text-muted-foreground font-light px-4">
          Belum ada ucapan tertulis. Jadilah yang pertama memberikan doa restu di atas!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#C8A96A]/20">
      {wishes.map((wish) => {
        // Format status kehadiran badge
        let statusText = "Insya Allah Hadir";
        let statusColor = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50";
        if (wish.attendance === "NO") {
          statusText = "Berhalangan Hadir";
          statusColor = "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/50";
        } else if (wish.attendance === "MAYBE") {
          statusText = "Mungkin Hadir";
          statusColor = "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/50";
        }

        const dateStr = wish.createdAt
          ? new Date(wish.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "Baru saja";

        return (
          <div
            key={wish.id}
            className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-border/40 shadow-sm text-left space-y-2 animate-in fade-in duration-300"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-bold text-xs text-foreground truncate">{wish.name}</span>
                <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border truncate ${statusColor}`}>
                  {statusText}
                </span>
              </div>
              <span className="text-[9px] text-muted-foreground font-light shrink-0">
                {dateStr}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-light leading-relaxed italic">
              &ldquo;{wish.message}&rdquo;
            </p>
          </div>
        );
      })}
    </div>
  );
}
