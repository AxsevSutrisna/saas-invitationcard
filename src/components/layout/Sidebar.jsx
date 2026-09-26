"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { dashboardNav } from "@/config/navigation.config";
import { useUIStore } from "@/stores/uiStore";
import { can } from "@/lib/ability";
import {
  LayoutGrid,
  BarChart3,
  Palette,
  PlusCircle,
  X,
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
  LayoutGrid,
  BarChart3,
  Palette,
  PlusCircle,
  Users,
  CreditCard,
  ShieldCheck,
};

const ADMIN_SUBNAV = [
  { id: "users", label: "Pengguna", icon: Users },
  { id: "transactions", label: "Transaksi", icon: CreditCard },
  { id: "themes", label: "Tema Desain", icon: Palette },
  { id: "quotes", label: "Templat Ayat", icon: Quote },
  { id: "musics", label: "Lagu Latar", icon: Music },
  { id: "faqs", label: "Kelola FAQ", icon: HelpCircle },
  { id: "settings", label: "Setelan WA", icon: Settings },
];

export function Sidebar({ user }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab") || "users";
  const { sidebarOpen, closeSidebar } = useUIStore();

  const [adminOpen, setAdminOpen] = useState(
    pathname.startsWith("/dashboard/admin")
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-zinc-950/60 backdrop-blur-sm transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        aria-label="Navigasi utama dashboard"
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-border/60 bg-white transition-transform duration-300 ease-in-out dark:bg-[#1A1A1A] lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header & Navigation Links */}
        <div className="space-y-8 p-6">
          {/* Logo Section */}
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-2">
              <Image
                src="/IKARA_Logo_V3.png"
                alt="IKARA"
                width={130}
                height={36}
                style={{ width: "auto", height: "32px" }}
                className="object-contain"
                priority
              />
            </Link>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={closeSidebar}
              aria-label="Tutup menu"
              className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-gold-400/10 hover:text-gold-600 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav Items List */}
          <nav className="space-y-1.5" aria-label="Menu dashboard">
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
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ease-out hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 ${
                    isActive
                      ? "border-l-4 border-gold-400 bg-linear-to-r from-gold-400/20 to-gold-400/5 font-semibold text-gold-600 shadow-sm dark:text-gold-300"
                      : "border-l-4 border-transparent text-muted-foreground hover:border-gold-400/50 hover:bg-gold-400/10 hover:text-gold-600 dark:hover:text-gold-300"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive
                        ? "text-gold-500 dark:text-gold-300"
                        : "text-zinc-400 group-hover:text-gold-500"
                    }`}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {can(user, "admin:access") && (
              <div className="space-y-1 pt-1">
                <button
                  type="button"
                  onClick={() => setAdminOpen(!adminOpen)}
                  aria-expanded={adminOpen}
                  className={`group relative flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 ${
                    pathname.startsWith("/dashboard/admin")
                      ? "border-l-4 border-gold-400 bg-gold-400/10 text-gold-600 dark:text-gold-300"
                      : "border-l-4 border-transparent text-muted-foreground hover:bg-gold-400/10 hover:text-gold-600 dark:hover:text-gold-300"
                  }`}
                >
                  <span className="flex items-center gap-3.5">
                    <ShieldCheck
                      className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                        pathname.startsWith("/dashboard/admin")
                          ? "text-gold-500 dark:text-gold-300"
                          : "text-zinc-400 group-hover:text-gold-500"
                      }`}
                      aria-hidden="true"
                    />
                    <span>Admin Panel</span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gold-500 transition-transform duration-300 ${
                      adminOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {adminOpen && (
                  <div className="animate-in slide-in-from-top-2 ml-6 space-y-1 border-l border-border/70 pl-5 duration-200">
                    {ADMIN_SUBNAV.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive =
                        pathname.startsWith("/dashboard/admin") &&
                        activeTabParam === subItem.id;
                      return (
                        <Link
                          key={subItem.id}
                          href={`/dashboard/admin?tab=${subItem.id}`}
                          onClick={closeSidebar}
                          aria-current={isSubActive ? "page" : undefined}
                          className={`group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-150 ${
                            isSubActive
                              ? "bg-gold-400/15 font-bold text-gold-600 shadow-sm dark:text-gold-300"
                              : "text-muted-foreground hover:bg-gold-400/5 hover:text-gold-600 dark:hover:text-gold-300"
                          }`}
                        >
                          <SubIcon
                            className={`h-3.5 w-3.5 transition-transform duration-150 group-hover:scale-110 ${
                              isSubActive
                                ? "text-gold-500 dark:text-gold-300"
                                : "text-zinc-400 group-hover:text-gold-500"
                            }`}
                            aria-hidden="true"
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
