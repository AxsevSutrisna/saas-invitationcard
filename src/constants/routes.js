/**
 * Constants - Routes
 * Seluruh URL/path aplikasi didefinisikan di sini.
 * Gunakan konstanta ini di mana pun memerlukan URL, bukan hardcode string.
 */
export const ROUTES = {
  // Public
  HOME: "/",
  PRICING: "/pricing",

  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  // Dashboard (protected)
  DASHBOARD: "/dashboard",
  ANALYTICS: "/dashboard/analytics",
  THEMES: "/dashboard/themes",
  INVITATIONS: "/dashboard/invitations",
  INVITATION_NEW: "/dashboard/invitations/new",
  INVITATION_EDIT: (id) => `/dashboard/invitations/${id}/edit`,
  SUBSCRIPTION: "/dashboard/subscription",
  SETTINGS: "/dashboard/settings",
  GUESTS: "/dashboard/guests",

  // Admin (super admin only)
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_TRANSACTIONS: "/admin/transactions",
  ADMIN_THEMES: "/admin/themes",

  // API
  API: {
    AUTH: {
      REGISTER: "/api/v1/auth/register",
      NEXTAUTH: "/api/auth",
    },
    INVITATIONS: "/api/v1/invitations",
    PAYMENTS: {
      CHECKOUT: "/api/v1/payments/checkout",
      WEBHOOK: "/api/v1/payments/webhook",
    },
    UPLOAD: "/api/v1/upload/presigned-url",
    THEMES: "/api/v1/themes",
    PACKAGES: "/api/v1/packages",
  },
};
