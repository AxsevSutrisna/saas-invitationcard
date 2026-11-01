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

export const marketingNav = [
  { label: "Fitur", href: "/#fitur" },
  { label: "Tema", href: "/#tema" },
  { label: "Harga", href: "/#harga" },
  { label: "FAQ", href: "/#faq" },
];
