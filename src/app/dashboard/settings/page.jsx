import { redirect } from "next/navigation";
import { User, Mail, ShieldCheck, CalendarDays, KeyRound, LogIn } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Surface } from "@/components/ui/Surface";
import { Alert } from "@/components/ui/Alert";
import { formatLongDate } from "@/lib/format";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { ChangePasswordForm } from "@/features/profile/components/ChangePasswordForm";

export const metadata = {
  title: "Pengaturan Akun — IKARA Dashboard",
  description: "Kelola profil pengguna, kata sandi, dan preferensi notifikasi Anda.",
  robots: { index: false, follow: false },
};

const ROLE_LABELS = {
  USER: "Pengguna",
  AGENCY: "Agency / Vendor",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
};

/** Inisial dari nama (fallback avatar). */
function initialsOf(name, email) {
  const src = (name || email || "").trim();
  if (!src) return "?";
  const parts = src.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-400/10 text-gold-500">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      password: true,
    },
  });
  if (!user) redirect("/login");

  const hasPassword = Boolean(user.password);
  const roleLabel = ROLE_LABELS[user.role] || user.role;
  const loginMethod = hasPassword ? "Email & Kata Sandi" : "Google";

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader
        title="Pengaturan Akun"
        description="Kelola profil pengguna, kata sandi, dan preferensi notifikasi Anda."
      />

      {/* Ringkasan identitas */}
      <Surface as="section" padding="lg" className="space-y-6">
        <div className="flex items-center gap-3 border-b border-border/40 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/15 text-gold-500">
            <User className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Profil Akun</h2>
            <p className="text-xs text-muted-foreground">Informasi identitas pribadi Anda</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gold-400/30 bg-gold-400/15 text-xl font-bold text-gold-600 dark:text-gold-300">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name || "Foto profil"}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{initialsOf(user.name, user.email)}</span>
            )}
          </div>
          <div className="min-w-0 space-y-1">
            <p className="truncate text-lg font-bold text-foreground">
              {user.name || "Tanpa Nama"}
            </p>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/15 px-2.5 py-0.5 text-[11px] font-semibold text-gold-600 dark:text-gold-300">
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              {roleLabel}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-border/40 pt-5 sm:grid-cols-2">
          <InfoRow icon={Mail} label="Email" value={user.email || "—"} />
          <InfoRow icon={ShieldCheck} label="Peran" value={roleLabel} />
          <InfoRow icon={LogIn} label="Metode Masuk" value={loginMethod} />
          <InfoRow
            icon={CalendarDays}
            label="Bergabung Sejak"
            value={user.createdAt ? formatLongDate(user.createdAt) : "—"}
          />
        </div>
      </Surface>

      {/* Ubah profil */}
      <Surface as="section" padding="lg" className="space-y-6">
        <div className="flex items-center gap-3 border-b border-border/40 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/15 text-gold-500">
            <User className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Ubah Profil</h2>
            <p className="text-xs text-muted-foreground">Perbarui nama tampilan akun Anda</p>
          </div>
        </div>

        <ProfileForm name={user.name || ""} email={user.email || ""} />
      </Surface>

      {/* Keamanan / kata sandi */}
      <Surface as="section" padding="lg" className="space-y-6">
        <div className="flex items-center gap-3 border-b border-border/40 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/15 text-gold-500">
            <KeyRound className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Keamanan</h2>
            <p className="text-xs text-muted-foreground">Ganti kata sandi akun Anda</p>
          </div>
        </div>

        {hasPassword ? (
          <ChangePasswordForm />
        ) : (
          <Alert variant="info" title="Akun Google">
            Anda masuk menggunakan Google, sehingga tidak ada kata sandi untuk diubah di sini.
            Jika ingin menyetel kata sandi, gunakan tautan <strong>“Lupa kata sandi”</strong> pada
            halaman masuk.
          </Alert>
        )}
      </Surface>
    </div>
  );
}
