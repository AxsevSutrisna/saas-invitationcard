import { ROUTES } from "@/constants/routes";

/**
 * Config - Navigation
 * Definisi struktur menu navigasi untuk Sidebar dan Navbar.
 * Perubahan menu cukup dilakukan di sini, semua UI akan ikut otomatis.
 */

/** Menu utama Sidebar Dashboard */
export const dashboardNav = [
  {
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: "LayoutDashboard",
  },
  {
    label: "Undangan Saya",
    href: ROUTES.INVITATIONS,
    icon: "Mail",
  },
  {
    label: "Subscription",
    href: ROUTES.SUBSCRIPTION,
    icon: "CreditCard",
  },
  {
    label: "Pengaturan",
    href: ROUTES.SETTINGS,
    icon: "Settings",
  },
];

/** Menu Admin CMS */
export const adminNav = [
  {
    label: "Kelola Pengguna",
    href: ROUTES.ADMIN_USERS,
    icon: "Users",
  },
  {
    label: "Transaksi",
    href: ROUTES.ADMIN_TRANSACTIONS,
    icon: "Receipt",
  },
  {
    label: "Tema Desain",
    href: ROUTES.ADMIN_THEMES,
    icon: "Palette",
  },
];

/** Menu Navbar Landing Page */
export const marketingNav = [
  { label: "Fitur", href: "/#features" },
  { label: "Tema", href: "/#themes" },
  { label: "Harga", href: ROUTES.PRICING },
];
