/**
 * Public API - Feature: Auth
 * Barrel export untuk semua komponen dan hooks dalam fitur auth.
 * Import dari luar fitur WAJIB menggunakan file ini, bukan path internal.
 *
 * ✅ import { LoginForm } from "@/features/auth"
 * ❌ import LoginForm from "@/features/auth/components/LoginForm"
 */
export { LoginForm } from "./components/LoginForm";
export { RegisterForm } from "./components/RegisterForm";
export { GoogleButton } from "./components/GoogleButton";
