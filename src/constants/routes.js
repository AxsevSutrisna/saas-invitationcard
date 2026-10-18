/**
 * Constants - Routes
 * Seluruh URL/path aplikasi didefinisikan di sini.
 * Gunakan konstanta ini di mana pun memerlukan URL, bukan hardcode string.
 */
export const ROUTES = {
  // Public
  HOME: "/",

  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  // Dashboard (protected)
  DASHBOARD: "/dashboard",
  ANALYTICS: "/dashboard/analytics",
  THEMES: "/dashboard/themes",
  INVITATION_NEW: "/dashboard/invitations/new",
  INVITATION_EDIT: (id) => `/dashboard/invitations/${id}/edit`,
  SUBSCRIPTION: "/dashboard/subscription",
  RESELLER: "/dashboard/reseller",
  SETTINGS: "/dashboard/settings",
  GUESTS: "/dashboard/guests",

  // Pembayaran (Core API custom checkout)
  PAYMENT_CHECKOUT: "/payment/checkout",
  PAYMENT_ORDER: (orderId) => `/payment/${orderId}`,
};
