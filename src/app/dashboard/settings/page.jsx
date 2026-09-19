import { User } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Surface } from "@/components/ui/Surface";

export const metadata = {
  title: "Pengaturan Akun — IKARA Dashboard",
  description: "Kelola profil pengguna, kata sandi, dan preferensi notifikasi Anda.",
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader
        title="Pengaturan Akun"
        description="Kelola profil pengguna, kata sandi, dan preferensi notifikasi Anda."
      />

      <Surface as="section" padding="lg" className="space-y-6">
        <div className="flex items-center gap-3 border-b border-border/40 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/15 text-gold-500">
            <User className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Profil Akun</h2>
            <p className="text-xs text-muted-foreground">
              Informasi identitas pribadi Anda
            </p>
          </div>
        </div>
      </Surface>
    </div>
  );
}
