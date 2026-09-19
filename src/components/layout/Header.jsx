"use client";

import Link from "next/link";
import { useUIStore } from "@/stores/uiStore";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { signOut } from "next-auth/react";
import { Menu, Plus, User, LogOut, Settings } from "lucide-react";
import { useState } from "react";

export function Header({ user }) {
  const { toggleSidebar } = useUIStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-white/80 px-4 backdrop-blur-md dark:bg-[#1A1A1A]/80 sm:px-8">
      {/* Left: Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Buka menu navigasi"
          className="rounded-xl border border-border/60 p-2 text-foreground transition-colors hover:bg-gold-400/10 hover:text-gold-600 lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Right: CTA & User Dropdown */}
      <div className="ml-auto flex items-center gap-4">
        {/* Primary CTA */}
        <Link href={ROUTES.INVITATION_NEW}>
          <Button size="sm">
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Buat Undangan Baru</span>
            <span className="sm:hidden">Buat</span>
          </Button>
        </Link>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="Menu akun"
            aria-expanded={dropdownOpen}
            className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-gold-400/30 bg-gold-400/15 text-xs font-bold text-gold-600 transition-all hover:ring-2 hover:ring-gold-400/40 dark:text-gold-300"
          >
            {user?.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={user.image}
                alt={user.name || "Foto profil"}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          {dropdownOpen && (
            <>
              {/* Backdrop dismiss */}
              <div
                onClick={() => setDropdownOpen(false)}
                aria-hidden="true"
                className="fixed inset-0 z-40"
              />

              <div className="absolute right-0 z-50 mt-2 w-56 space-y-1 rounded-2xl border border-border/60 bg-white py-2 text-sm shadow-2xl dark:bg-[#202020]">
                <div className="border-b border-border/40 px-4 py-2">
                  <p className="truncate font-semibold text-foreground">
                    {user?.name || "Pengguna IKARA"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.email || "user@ikara.id"}
                  </p>
                </div>

                <Link
                  href={ROUTES.SETTINGS}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-foreground transition-colors hover:bg-gold-400/10 hover:text-gold-600 dark:hover:text-gold-300"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span>Pengaturan Akun</span>
                </Link>

                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span>Keluar</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
