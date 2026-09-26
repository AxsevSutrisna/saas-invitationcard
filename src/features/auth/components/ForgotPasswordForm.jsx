"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordResetAction } from "@/features/auth/actions";
import { ROUTES } from "@/constants/routes";

/**
 * Form permintaan reset password. Menampilkan pesan generik setelah submit
 * (tidak membocorkan apakah email terdaftar).
 */
export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const email = new FormData(e.currentTarget).get("email");
    const res = await requestPasswordResetAction({ email });
    setLoading(false);

    if (res.success) setMessage(res.message);
    else setError(res.error || "Terjadi kesalahan. Silakan coba lagi.");
  };

  return (
    <div className="space-y-4">
      {message ? (
        <p className="rounded-xl border border-gold-400/25 bg-gold-400/10 p-4 text-center text-sm text-gold-700 dark:text-gold-300">
          {message}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">
              Email terdaftar <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Masukkan email akun Anda"
              required
              className="h-12"
            />
          </div>

          {error && (
            <p className="text-center text-sm font-medium text-destructive">{error}</p>
          )}

          <Button type="submit" className="mt-2 h-12 w-full text-md" disabled={loading}>
            {loading ? "Mengirim..." : "Kirim Tautan Reset"}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground">
        <Link href={ROUTES.LOGIN} className="font-semibold text-gold-600 hover:underline">
          Kembali ke halaman Masuk
        </Link>
      </p>
    </div>
  );
}
