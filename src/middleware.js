import NextAuth from "next-auth";
import { authConfig } from "@/config/auth.config";

/**
 * Middleware - Auth Guard
 * Menggunakan authConfig yang Edge-compatible (tanpa DB adapter/Prisma).
 * Proteksi rute /dashboard dan redirect jika sudah login mencoba ke /login atau /register.
 */
export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboard = pathname.startsWith("/dashboard");

  if (isAuthPage && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (isDashboard && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
