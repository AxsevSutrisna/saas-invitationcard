import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "@/config/auth.config";
import { validateUserCredentials } from "@/server/services/auth.service";
import { db } from "@/lib/db";

/**
 * Auth.js - Konfigurasi lengkap (dengan DB Adapter & Credentials Provider).
 * File ini TIDAK boleh diimpor dari middleware (Edge-incompatible).
 * Gunakan @/config/auth.config untuk middleware.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await validateUserCredentials(credentials);
        return user ?? null;
      },
    }),
  ],
});
