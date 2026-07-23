import Link from "next/link";
import { auth } from "@/lib/auth";
import { getInvitationsByUserId } from "@/server/repositories/invitation.repository";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { Mail, Plus, Sparkles, ExternalLink, Edit3, Eye, Trash2, Heart } from "lucide-react";
import { deleteInvitationAction } from "@/server/actions/invitation.actions";

/**
 * Dashboard Page - Undangan Saya Overview
 * Menampilkan daftar undangan pengguna berbasis data asli dari PostgreSQL
 * atau Empty State Card jika pengguna belum memiliki undangan.
 */
export default async function DashboardPage() {
  const session = await auth();
  const invitations = session?.user?.id
    ? await getInvitationsByUserId(session.user.id)
    : [];

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-bold text-[#1F1F1F] dark:text-zinc-50 tracking-tight">
            Undangan Saya
          </h1>
          <p className="text-sm text-muted-foreground font-light">
            Kelola detail undangan, daftar tamu, dan ucapan untuk hari bahagia Anda
          </p>
        </div>

        {invitations.length > 0 && (
          <Link href={ROUTES.INVITATION_NEW}>
            <Button
              size="sm"
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#C8A96A] to-[#b39150] hover:from-[#b39150] hover:to-[#9e7e40] text-white font-medium text-xs shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Undangan Baru</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Jika Belum Ada Undangan -> Empty State Box (Screenshot 1) */}
      {invitations.length === 0 ? (
        <div className="min-h-[420px] rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#C8A96A]/20 to-amber-100 dark:from-[#C8A96A]/20 dark:to-zinc-800 border border-[#C8A96A]/30 flex items-center justify-center text-[#C8A96A] shadow-inner">
            <Mail className="w-10 h-10 stroke-[1.5]" />
          </div>

          <div className="space-y-2 max-w-md">
            <h2 className="font-heading text-2xl font-bold text-[#1F1F1F] dark:text-zinc-100">
              Belum Ada Undangan
            </h2>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Mulai buat undangan pernikahan pertama Anda dengan klik tombol di bawah
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
      ) : (
        /* Jika Ada Undangan -> Grid Active Invitation Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-all"
            >
              {/* Header Badge */}
              <div className="p-6 bg-gradient-to-r from-[#C8A96A]/15 to-amber-100/50 dark:from-zinc-800 dark:to-zinc-900 border-b border-border/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#C8A96A] text-white">
                    {invitation.theme?.name || "Standard Theme"}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      invitation.isPublished
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-zinc-200 text-zinc-700"
                    }`}
                  >
                    {invitation.isPublished ? "PUBLISHED" : "DRAFT"}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-heading text-xl font-bold text-foreground truncate">
                    {invitation.title}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-500 fill-current" />
                    <span>
                      {invitation.groomName} & {invitation.brideName}
                    </span>
                  </p>
                </div>
              </div>

              {/* Body Meta & Links */}
              <div className="p-6 space-y-4">
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/50 space-y-1">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase block">
                    URL Publik
                  </span>
                  <a
                    href={`/${invitation.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#C8A96A] hover:underline flex items-center gap-1 truncate"
                  >
                    <span>ikara.id/{invitation.slug}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs text-muted-foreground">
                  <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/50">
                    <span className="font-bold text-foreground block text-sm">
                      {invitation._count?.rsvps || 0}
                    </span>
                    <span className="text-[10px]">Tamu RSVP</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/50">
                    <span className="font-bold text-foreground block text-sm">
                      {invitation._count?.visitorLogs || 0}
                    </span>
                    <span className="text-[10px]">Total Views</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40">
                  <a
                    href={`/${invitation.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="col-span-1"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs rounded-xl flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat</span>
                    </Button>
                  </a>

                  <Link href={`/dashboard/invitations/${invitation.id}/edit`}>
                    <Button
                      size="sm"
                      className="w-full text-xs rounded-xl bg-[#C8A96A] hover:bg-[#b39150] text-white flex items-center justify-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Button>
                  </Link>

                  <form
                    action={async () => {
                      "use server";
                      await deleteInvitationAction(invitation.id);
                    }}
                  >
                    <Button
                      type="submit"
                      variant="destructive"
                      size="sm"
                      className="w-full text-xs rounded-xl flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
