"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/stores/uiStore";
import { ROUTES } from "@/constants/routes";
import { LayoutGrid, Palette, Users, PlusCircle, Menu } from "lucide-react";

/**
 * MobileBottomNav — navigasi bawah ala aplikasi mobile untuk dashboard.
 * Tampil hanya di < lg (di desktop tetap pakai Sidebar). Berisi 4 item utama +
 * tombol tengah "Buat" yang menonjol + "Lainnya" yang membuka drawer Sidebar
 * penuh (Statistik, Langganan, Reseller, Admin, dll).
 */
const LEFT_ITEMS = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutGrid, exact: true },
  { label: "Tema", href: ROUTES.THEMES, icon: Palette },
];
const RIGHT_ITEMS = [{ label: "Tamu", href: ROUTES.GUESTS, icon: Users }];

function NavItem({ item, active }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
        active ? "text-gold-600 dark:text-gold-300" : "text-muted-foreground hover:text-gold-600"
      }`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span>{item.label}</span>
    </Link>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { sidebarOpen, openSidebar } = useUIStore();

  const isActive = (item) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href);

  return (
    <nav
      aria-label="Navigasi bawah"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto flex h-16 max-w-md items-stretch justify-around px-2">
        {LEFT_ITEMS.map((it) => (
          <NavItem key={it.href} item={it} active={isActive(it)} />
        ))}

        {/* Tombol tengah menonjol — Buat Undangan */}
        <div className="flex flex-1 items-start justify-center">
          <Link
            href={ROUTES.INVITATION_NEW}
            aria-label="Buat Undangan"
            className="-mt-5 flex flex-col items-center gap-0.5"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-white shadow-lg shadow-gold-500/30 ring-4 ring-card transition-transform active:scale-95">
              <PlusCircle className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="text-[10px] font-semibold text-gold-600 dark:text-gold-300">Buat</span>
          </Link>
        </div>

        {RIGHT_ITEMS.map((it) => (
          <NavItem key={it.href} item={it} active={isActive(it)} />
        ))}

        {/* Lainnya — buka drawer Sidebar penuh */}
        <button
          type="button"
          onClick={openSidebar}
          aria-label="Menu lainnya"
          aria-expanded={sidebarOpen}
          className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
            sidebarOpen ? "text-gold-600 dark:text-gold-300" : "text-muted-foreground hover:text-gold-600"
          }`}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
          <span>Lainnya</span>
        </button>
      </div>
    </nav>
  );
}
