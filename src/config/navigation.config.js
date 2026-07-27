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
    icon: "LayoutGrid",
  },
  {
    label: "Statistik",
    href: ROUTES.ANALYTICS,
    icon: "BarChart3",
  },
  {
    label: "Tema",
    href: ROUTES.THEMES,
    icon: "Palette",
  },
  {
    label: "Tamu",
    href: ROUTES.GUESTS,
    icon: "Users",
  },
  {
    label: "Buat Undangan",
    href: ROUTES.INVITATION_NEW,
    icon: "PlusCircle",
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
