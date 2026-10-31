/**
 * Theme (dark/light) — konstanta bersama untuk server & client.
 *
 * Strategi: class `.dark` pada <html> (sesuai `@custom-variant dark` di
 * globals.css). Token warna light/dark sudah didefinisikan di :root & .dark.
 *
 * File ini MURNI (tanpa "use client") agar bisa diimpor baik dari Root Layout
 * (Server Component) untuk skrip anti-flash, maupun dari hook client.
 */

export const THEME_STORAGE_KEY = "ikara-theme";

/**
 * Skrip anti-flash (FOUC): menyetel class `.dark` + color-scheme SEBELUM paint,
 * berdasarkan pilihan tersimpan atau preferensi sistem. Disisipkan inline di
 * awal <body> pada Root Layout.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var k="${THEME_STORAGE_KEY}";var s=localStorage.getItem(k);var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;var e=document.documentElement;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
