import "server-only";

/**
 * Pengirim email via Resend REST API (tanpa SDK — cukup fetch).
 * Set env: RESEND_API_KEY (wajib) & RESEND_FROM_EMAIL (opsional).
 *
 * Best-effort: bila API key belum di-set, fungsi tidak melempar error —
 * hanya mencatat peringatan & mengembalikan { success:false } agar alur
 * pemanggil tetap aman (anti-enumeration pada flow reset password).
 *
 * @param {{ to: string|string[], subject: string, html: string }} params
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "IKARA <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn(
      "[email] RESEND_API_KEY belum di-set — email tidak dikirim. Set di .env untuk mengaktifkan."
    );
    return { success: false, error: "Layanan email belum dikonfigurasi." };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[email] Resend gagal:", res.status, detail);
      return { success: false, error: "Gagal mengirim email." };
    }

    return { success: true };
  } catch (error) {
    console.error("[email] Error jaringan:", error?.message);
    return { success: false, error: "Gagal mengirim email." };
  }
}
