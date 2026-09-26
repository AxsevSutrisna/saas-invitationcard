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

  // API (register, analytics/visit & payments/checkout kini via Server Actions)
  API: {
    AUTH: {
      NEXTAUTH: "/api/auth",
    },
    PAYMENTS: {
      WEBHOOK: "/api/v1/payments/webhook",
    },
    UPLOAD: "/api/v1/upload/presigned-url",
  },
};
