"use client";

import { useEffect } from "react";

/**
 * Global error boundary — menggantikan ROOT layout saat root itu sendiri gagal.
 * WAJIB me-render <html> & <body> sendiri. globals.css (Tailwind) kemungkinan
 * tidak termuat di sini, jadi gaya ditulis inline agar selalu tampil benar.
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#0b0b0c",
          color: "#fafafa",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div>
          <p style={{ fontSize: "44px", fontWeight: 800, color: "#c8a96a", margin: "0 0 8px", letterSpacing: "0.1em" }}>
            IKARA
          </p>
          <h1 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 8px" }}>
            Terjadi kesalahan sistem
          </h1>
          <p style={{ fontSize: "14px", opacity: 0.7, maxWidth: "420px", margin: "0 auto 20px", lineHeight: 1.6 }}>
            Maaf, aplikasi sedang mengalami gangguan. Silakan muat ulang halaman.
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: "#c8a96a",
              color: "#fff",
              border: 0,
              borderRadius: "12px",
              padding: "10px 22px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Muat Ulang
          </button>
        </div>
      </body>
    </html>
  );
}
