import { ROUTES } from "@/constants/routes";

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
  {
    label: "Langganan",
    href: ROUTES.SUBSCRIPTION,
    icon: "CreditCard",
  },
];

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

export const marketingNav = [
  { label: "Fitur", href: "/#fitur" },
  { label: "Tema", href: "/#tema" },
  { label: "Harga", href: "/#harga" },
  { label: "FAQ", href: "/#faq" },
];
