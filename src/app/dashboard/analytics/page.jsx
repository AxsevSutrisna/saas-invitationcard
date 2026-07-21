import {
  Calendar,
  Infinity,
  Users,
  Eye,
  MessageSquare,
  Mail,
} from "lucide-react";

/**
 * Dashboard Analytics Page - Statistik (Screenshot 2 Reference)
 * Menampilkan 4 kartu statistik performa dan 2 grid rekap RSVP & Ucapan.
 */
export default async function AnalyticsPage() {
  const stats = [
    {
      title: "MENUJU HARI H",
      value: "0",
      unit: "Hari Lagi",
      icon: Calendar,
      bgColor: "bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
    },
    {
      title: "STATUS AKSES (PREMIUM)",
      value: "Tak Terbatas",
      unit: "",
      icon: Infinity,
      bgColor: "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
      isHighlight: true,
    },
    {
      title: "TOTAL TAMU HADIR",
      value: "0",
      unit: "Orang",
      icon: Users,
      bgColor: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "TOTAL DILIHAT",
      value: "0",
      unit: "Kali",
      icon: Eye,
      bgColor: "bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="space-y-1">
        <h1 className="font-heading text-3xl font-bold text-[#1F1F1F] dark:text-zinc-50 tracking-tight">
          Analitik Undangan
        </h1>
        <p className="text-sm text-muted-foreground font-light">
          Pantau tingkat kehadiran, sisa kuota, dan performa undangan Anda
        </p>
      </div>

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="p-6 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm space-y-4 relative overflow-hidden"
            >
              <div className={`w-12 h-12 rounded-2xl ${item.bgColor} flex items-center justify-center`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                  {item.title}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={`font-heading text-2xl font-bold ${
                      item.isHighlight ? "text-[#C8A96A]" : "text-foreground"
                    }`}
                  >
                    {item.value}
                  </span>
                  {item.unit && (
                    <span className="text-xs text-muted-foreground font-normal">
                      {item.unit}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom 2 Grid Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Komposisi Kehadiran Tamu */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm space-y-6">
          <div>
            <h3 className="font-semibold text-foreground text-base">
              Komposisi Kehadiran Tamu
            </h3>
            <p className="text-xs text-muted-foreground font-light">
              Persentase dari total 0 balasan RSVP
            </p>
          </div>
          <div className="h-44 rounded-2xl border-2 border-dashed border-border/60 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col items-center justify-center text-center p-4 space-y-2">
            <MessageSquare className="w-8 h-8 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">
              Belum ada balasan RSVP yang masuk.
            </p>
          </div>
        </div>

        {/* Ucapan & Doa Terbaru */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm space-y-6">
          <div>
            <h3 className="font-semibold text-foreground text-base">
              Ucapan & Doa Terbaru
            </h3>
            <p className="text-xs text-muted-foreground font-light">
              Doa dari tamu undangan Anda
            </p>
          </div>
          <div className="h-44 rounded-2xl border-2 border-dashed border-border/60 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col items-center justify-center text-center p-4 space-y-2">
            <Mail className="w-8 h-8 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">
              Belum ada ucapan yang masuk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
