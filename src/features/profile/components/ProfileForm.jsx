"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/Alert";
import { useFeedback } from "@/hooks/useFeedback";
import { updateProfileAction } from "@/features/profile/actions";

/**
 * Form ubah profil (nama). Email ditampilkan read-only karena merupakan
 * identitas masuk — perubahannya butuh alur verifikasi tersendiri.
 */
export function ProfileForm({ name: initialName = "", email = "" }) {
  const router = useRouter();
  const { feedback, notify } = useFeedback();
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);

  const dirty = name.trim() !== (initialName || "").trim();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!dirty || loading) return;

    setLoading(true);
    const res = await updateProfileAction({ name: name.trim() });
    setLoading(false);

    if (res.success) {
      notify("success", res.message || "Profil berhasil diperbarui.");
      router.refresh();
    } else {
      notify("error", res.error || "Gagal memperbarui profil.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {feedback.message && <Alert variant={feedback.type}>{feedback.message}</Alert>}

      <TextField
        label="Nama Lengkap"
        htmlFor="profile-name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama Anda"
        maxLength={80}
        autoComplete="name"
      />

      <TextField
        label="Email"
        htmlFor="profile-email"
        value={email}
        disabled
        hint="Email adalah identitas masuk dan tidak dapat diubah dari sini."
        inputClassName="cursor-not-allowed opacity-70"
      />

      <div className="flex justify-end pt-1">
        <Button type="submit" size="sm" disabled={loading || !dirty}>
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
