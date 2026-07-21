import Google from "next-auth/providers/google";

/**
 * Auth.js configuration (Edge-compatible).
 * Hanya berisi konfigurasi provider, callbacks, dan halaman kustom.
 * TIDAK mengandung Prisma/DB adapter (tidak kompatibel dengan Edge Runtime).
 */
export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 hari (1 minggu)
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
