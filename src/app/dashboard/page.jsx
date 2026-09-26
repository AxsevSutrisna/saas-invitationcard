import Link from "next/link";
import { auth } from "@/lib/auth";
import { getInvitationsByUserId } from "@/features/invitation/repository";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Surface } from "@/components/ui/Surface";
import { ROUTES } from "@/constants/routes";
import { Mail, Plus, ExternalLink, Edit3, Eye, Trash2, Heart } from "lucide-react";
import { deleteInvitationAction } from "@/features/invitation/actions";

export const metadata = {
  title: "Undangan Saya — IKARA Dashboard",
  description:
    "Kelola undangan pernikahan digital Anda: detail acara, daftar tamu, dan ucapan.",
  robots: { index: false, follow: false },
};

/**
 * Dashboard Page — Undangan Saya.
 * Menampilkan daftar undangan pengguna dari PostgreSQL, atau EmptyState.
 */
export default async function DashboardPage() {
  const session = await auth();
  const invitations = session?.user?.id
    ? await getInvitationsByUserId(session.user.id)
    : [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Undangan Saya"
        description="Kelola detail undangan, daftar tamu, dan ucapan untuk hari bahagia Anda."
        action={
          invitations.length > 0 ? (
            <Link href={ROUTES.INVITATION_NEW}>
              <Button size="sm">
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Buat Undangan Baru</span>
              </Button>
            </Link>
          ) : null
        }
      />

      {invitations.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="Belum Ada Undangan"
          description="Mulai buat undangan pernikahan pertama Anda dengan klik tombol di bawah."
          action={
            <Link href={ROUTES.INVITATION_NEW}>
              <Button size="lg">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Buat Undangan Pertama
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {invitations.map((invitation) => (
            <Surface
              key={invitation.id}
              as="article"
              padding="none"
              hover
              className="flex flex-col justify-between overflow-hidden"
            >
              {/* Header Badge */}
              <div className="space-y-3 border-b border-border/40 bg-linear-to-r from-gold-400/15 to-gold-100/50 p-6 dark:from-zinc-800 dark:to-zinc-900">
                <div className="flex items-center justify-between">
                  <Badge variant="gold">
                    {invitation.theme?.name || "Standard Theme"}
                  </Badge>
                  <Badge variant={invitation.isPublished ? "success" : "neutral"}>
                    {invitation.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h3 className="truncate font-heading text-xl font-bold text-foreground">
                    {invitation.title}
                  </h3>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Heart
                      className="h-3 w-3 fill-current text-rose-500"
                      aria-hidden="true"
                    />
                    <span>
                      {invitation.groomNickname} &amp; {invitation.brideNickname}
                    </span>
                  </p>
                </div>
              </div>

              {/* Body Meta & Links */}
              <div className="space-y-4 p-6">
                <div className="space-y-1 rounded-2xl border border-border/50 bg-muted/40 p-3 dark:bg-zinc-900/60">
                  <span className="block text-[10px] font-semibold uppercase text-muted-foreground">
                    URL Publik
                  </span>
                  <a
                    href={`/${invitation.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 truncate text-xs font-bold text-gold-600 hover:underline dark:text-gold-300"
                  >
                    <span>ikara.id/{invitation.slug}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs text-muted-foreground">
                  <Link
                    href={`${ROUTES.GUESTS}?invitationId=${invitation.id}`}
                    className="block rounded-xl bg-muted/60 p-2 transition-all hover:bg-gold-400/10 hover:text-gold-600 dark:bg-zinc-800/50"
                  >
                    <span className="block text-sm font-bold text-foreground">
                      {invitation._count?.rsvps || 0}
                    </span>
                    <span className="text-[10px]">Tamu RSVP</span>
                  </Link>
                  <div className="rounded-xl bg-muted/60 p-2 dark:bg-zinc-800/50">
                    <span className="block text-sm font-bold text-foreground">
                      {invitation._count?.visitorLogs || 0}
                    </span>
                    <span className="text-[10px]">Total Views</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-2 border-t border-border/40 pt-3">
                  <a
                    href={`/${invitation.slug}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Lihat</span>
                    </Button>
                  </a>

                  <Link href={`/dashboard/invitations/${invitation.id}/edit`}>
                    <Button size="sm" className="w-full">
                      <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
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
                      className="w-full"
                      aria-label={`Hapus undangan ${invitation.title}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  </form>
                </div>
              </div>
            </Surface>
          ))}
        </div>
      )}
    </div>
  );
}
