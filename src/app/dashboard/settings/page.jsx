import { Settings, User, Key, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div className="space-y-1">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Pengaturan Akun
        </h1>
        <p className="text-sm text-muted-foreground font-light">
          Kelola profil pengguna, kata sandi, dan preferensi notifikasi Anda
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/40">
          <div className="w-10 h-10 rounded-xl bg-[#C8A96A]/15 text-[#C8A96A] flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Profil Akun</h3>
            <p className="text-xs text-muted-foreground">Informasi identitas pribadi Anda</p>
          </div>
        </div>
      </div>
    </div>
  );
}
