/**
 * Public API - Feature: Auth
 * Barrel export untuk semua komponen dan hooks dalam fitur auth.
 * Import dari luar fitur WAJIB menggunakan file ini, bukan path internal.
 *
 * ✅ import { LoginForm } from "@/features/auth"
 * ❌ import LoginForm from "@/features/auth/components/LoginForm"
 */
// GoogleButton adalah komponen internal (dipakai oleh Login/RegisterForm), jadi
// tidak di-ekspor sebagai public API di sini.
export { LoginForm } from "./components/LoginForm";
export { RegisterForm } from "./components/RegisterForm";
export { ForgotPasswordForm } from "./components/ForgotPasswordForm";
export { ResetPasswordForm } from "./components/ResetPasswordForm";
