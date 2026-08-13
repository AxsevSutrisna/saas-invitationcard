"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { dashboardNav } from "@/config/navigation.config";
import { useUIStore } from "@/store/uiStore";
import {
  LayoutGrid,
  BarChart3,
  Palette,
  PlusCircle,
  X,
  User,
  Users,
  CreditCard,
  ShieldCheck,
  ChevronDown,
  Quote,
  Music,
  HelpCircle,
  Settings,
} from "lucide-react";

/** Map Icon string ke komponen Lucide */
const ICON_MAP = {
  LayoutGrid: LayoutGrid,
  BarChart3: BarChart3,
  Palette: Palette,
  PlusCircle: PlusCircle,
  Users: Users,
  CreditCard: CreditCard,
  ShieldCheck: ShieldCheck,
};

export function Sidebar({ user }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab") || "users";
  const { sidebarOpen, closeSidebar } = useUIStore();

  const [adminOpen, setAdminOpen] = useState(pathname.startsWith("/dashboard/admin"));

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-zinc-950/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-[#1A1A1A] border-r border-border/60 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header & Navigation Links */}
        <div className="p-6 space-y-8">
          {/* Logo Section */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/IKARA_Logo_V3.png"
                alt="IKARA Logo"
                width={130}
                height={36}
                style={{ width: "auto", height: "32px" }}
                className="object-contain"
                priority
              />
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={closeSidebar}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items List */}
          <nav className="space-y-1.5">
            {dashboardNav.map((item) => {
              const Icon = ICON_MAP[item.icon] || LayoutGrid;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`group relative flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ease-out hover:translate-x-1.5 active:scale-98 ${
                    isActive
                      ? "bg-gradient-to-r from-[#C8A96A]/20 to-[#C8A96A]/5 text-[#C8A96A] font-semibold border-l-4 border-[#C8A96A] shadow-sm"
                      : "text-muted-foreground hover:text-[#C8A96A] hover:bg-[#C8A96A]/10 dark:hover:bg-[#C8A96A]/15 border-l-4 border-transparent hover:border-[#C8A96A]/50"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? "text-[#C8A96A]" : "text-zinc-400 group-hover:text-[#C8A96A]"
                    }`}
                  />
                  <span className="transition-colors duration-200">{item.label}</span>
                </Link>
              );
            })}

            {user?.role === "SUPER_ADMIN" && (
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setAdminOpen(!adminOpen)}
                  className={`w-full group relative flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ease-out active:scale-98 ${
                    pathname.startsWith("/dashboard/admin")
                      ? "bg-[#C8A96A]/10 text-[#C8A96A] border-l-4 border-[#C8A96A]"
                      : "text-muted-foreground hover:text-[#C8A96A] hover:bg-[#C8A96A]/10 dark:hover:bg-[#C8A96A]/15 border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <ShieldCheck
                      className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                        pathname.startsWith("/dashboard/admin")
                          ? "text-[#C8A96A]"
                          : "text-zinc-400 group-hover:text-[#C8A96A]"
                      }`}
                    />
                    <span>Admin Panel</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#C8A96A] transition-transform duration-300 ${
                      adminOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {adminOpen && (
                  <div className="pl-5 space-y-1 mt-1 border-l border-zinc-200 dark:border-zinc-800 ml-6 animate-in slide-in-from-top-2 duration-200">
                    {[
                      { id: "users", label: "Pengguna", icon: Users },
                      { id: "transactions", label: "Transaksi", icon: CreditCard },
                      { id: "themes", label: "Tema Desain", icon: Palette },
                      { id: "quotes", label: "Templat Ayat", icon: Quote },
                      { id: "musics", label: "Lagu Latar", icon: Music },
                      { id: "faqs", label: "Kelola FAQ", icon: HelpCircle },
                      { id: "settings", label: "Setelan WA", icon: Settings },
                    ].map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive =
                        pathname.startsWith("/dashboard/admin") &&
                        activeTabParam === subItem.id;
                      return (
                        <Link
                          key={subItem.id}
                          href={`/dashboard/admin?tab=${subItem.id}`}
                          onClick={closeSidebar}
                          className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                            isSubActive
                              ? "bg-[#C8A96A]/15 text-[#C8A96A] font-bold shadow-sm"
                              : "text-muted-foreground hover:text-[#C8A96A] hover:bg-[#C8A96A]/5"
                          }`}
                        >
                          <SubIcon
                            className={`w-3.5 h-3.5 transition-transform duration-150 group-hover:scale-110 ${
                              isSubActive ? "text-[#C8A96A]" : "text-zinc-400 group-hover:text-[#C8A96A]"
                            }`}
                          />
                          <span>{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </aside>
    </>
  );
}
