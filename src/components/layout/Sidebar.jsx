"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

/** Map Icon string ke komponen Lucide */
const ICON_MAP = {
  LayoutGrid: LayoutGrid,
  BarChart3: BarChart3,
  Palette: Palette,
  PlusCircle: PlusCircle,
  Users: Users,
};

export function Sidebar({ user }) {
  const pathname = usePathname();
  const { sidebarOpen, closeSidebar } = useUIStore();

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
          </nav>
        </div>
      </aside>
    </>
  );
}
