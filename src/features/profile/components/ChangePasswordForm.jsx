"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Field, DASHBOARD_INPUT } from "@/components/ui/Field";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/Alert";
import { useFeedback } from "@/hooks/useFeedback";
import { changePasswordAction } from "@/features/profile/actions";
import { cn } from "@/lib/utils";

/** Input kata sandi (visibilitas dikendalikan tombol bersama di bawah form). */
function PasswordInput({ id, show, autoComplete, placeholder, minLength }) {
  return (
    <input
      id={id}
      name={id}
      type={show ? "text" : "password"}
      required
      minLength={minLength}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className={cn(DASHBOARD_INPUT)}
    />
  );
}

/**
 * Form ganti kata sandi untuk akun berkredensial (punya password).
 * Memverifikasi kata sandi lama di server sebelum menyimpan yang baru.
 */
export function ChangePasswordForm() {
  const { feedback, notify } = useFeedback();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const currentPassword = fd.get("currentPassword");
    const newPassword = fd.get("newPassword");
    const confirm = fd.get("confirm");

    if (newPassword !== confirm) {
      notify("error", "Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    setLoading(true);
    const res = await changePasswordAction({ currentPassword, newPassword });
    setLoading(false);

    if (res.success) {
      notify("success", res.message || "Kata sandi berhasil diperbarui.");
      form.reset();
    } else {
      notify("error", res.error || "Gagal memperbarui kata sandi.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {feedback.message && <Alert variant={feedback.type}>{feedback.message}</Alert>}

      <Field label="Kata Sandi Saat Ini" htmlFor="currentPassword" required>
        <PasswordInput id="currentPassword" show={show} autoComplete="current-password" placeholder="Masukkan kata sandi saat ini" />
      </Field>

      <Field label="Kata Sandi Baru" htmlFor="newPassword" required hint="Minimal 8 karakter.">
        <PasswordInput id="newPassword" show={show} autoComplete="new-password" placeholder="Minimal 8 karakter" minLength={8} />
      </Field>

      <Field label="Ulangi Kata Sandi Baru" htmlFor="confirm" required>
        <PasswordInput id="confirm" show={show} autoComplete="new-password" placeholder="Ulangi kata sandi baru" minLength={8} />
      </Field>

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-gold-600 dark:hover:text-gold-300"
        >
          {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
        </button>

        <Button type="submit" size="sm" disabled={loading}>
          {loading ? "Menyimpan..." : "Perbarui Kata Sandi"}
        </Button>
      </div>
    </form>
  );
}
