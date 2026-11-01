"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { resetPasswordAction } from "@/features/auth/actions";
import { ROUTES } from "@/constants/routes";

/**
 * Form penyetelan kata sandi baru. Menerima `token` dari query string halaman.
 */
export function ResetPasswordForm({ token }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-destructive">
          Token reset tidak ditemukan atau tidak valid. Silakan minta tautan baru.
        </p>
        <Link href={ROUTES.FORGOT_PASSWORD} className="text-sm font-semibold text-gold-600 hover:underline">
          Minta tautan reset
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const fd = new FormData(e.currentTarget);
    const password = fd.get("password");
    const confirm = fd.get("confirm");

    if (password !== confirm) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);
    const res = await resetPasswordAction({ token, password });
    setLoading(false);

    if (res.success) {
      setMessage(res.message);
      setTimeout(() => router.push(ROUTES.LOGIN), 1600);
    } else {
      setError(res.error || "Gagal memperbarui kata sandi.");
    }
  };

  if (message) {
    return (
      <div className="space-y-4 text-center">
        <p className="rounded-xl border border-gold-400/25 bg-gold-400/10 p-4 text-sm text-gold-700 dark:text-gold-300">
          {message}
        </p>
        <Link href={ROUTES.LOGIN} className="text-sm font-semibold text-gold-600 hover:underline">
          Masuk sekarang
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">
          Kata Sandi Baru <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            placeholder="Minimal 8 karakter"
            required
            minLength={8}
            className="h-12 pr-10"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm">
          Ulangi Kata Sandi <span className="text-destructive">*</span>
        </Label>
        <Input
          id="confirm"
          name="confirm"
          type={show ? "text" : "password"}
          placeholder="Ulangi kata sandi baru"
          required
          minLength={8}
          className="h-12"
        />
      </div>

      {error && (
        <p className="text-center text-sm font-medium text-destructive">{error}</p>
      )}

      <Button type="submit" className="mt-2 h-12 w-full text-md" disabled={loading}>
        {loading ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
      </Button>
    </form>
  );
}
