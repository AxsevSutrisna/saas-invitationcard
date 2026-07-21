"use client";

import Link from "next/link";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { signOut } from "next-auth/react";
import {
  Menu,
  Plus,
  User,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

export function Header({ user }) {
  const { toggleSidebar } = useUIStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md border-b border-border/50 px-4 sm:px-8 flex items-center justify-between">
      {/* Left Area: Mobile Menu Toggle Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl border border-border/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right Area: Action CTA & User Dropdown */}
      <div className="flex items-center gap-4 ml-auto">
        {/* "+ Buat Undangan Baru" Primary CTA Button */}
        <Link href={ROUTES.INVITATION_NEW}>
          <Button
            size="sm"
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#C8A96A] to-[#b39150] hover:from-[#b39150] hover:to-[#9e7e40] text-white font-medium text-xs sm:text-sm shadow-md flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Undangan Baru</span>
          </Button>
        </Link>

        {/* User Profile Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-9 h-9 rounded-full bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/30 flex items-center justify-center font-bold text-xs hover:ring-2 hover:ring-[#C8A96A]/40 transition-all cursor-pointer overflow-hidden"
          >
            {user?.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={user.image}
                alt={user.name || "User"}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User className="w-4 h-4 text-[#C8A96A]" />
            )}
          </button>

          {dropdownOpen && (
            <>
              {/* Backdrop dismiss */}
              <div
                onClick={() => setDropdownOpen(false)}
                className="fixed inset-0 z-40"
              />

              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#202020] rounded-2xl shadow-2xl border border-border/60 py-2 z-50 text-sm space-y-1">
                <div className="px-4 py-2 border-b border-border/40">
                  <p className="font-semibold text-foreground truncate">
                    {user?.name || "Pengguna IKARA"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || "user@ikara.id"}
                  </p>
                </div>

                <Link
                  href={ROUTES.SETTINGS}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span>Pengaturan Akun</span>
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar (Sign Out)</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
