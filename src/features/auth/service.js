import "server-only";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import {
  findUserByEmail,
  createUser,
  updateUserPassword,
  createPasswordResetToken,
  findPasswordResetToken,
  deletePasswordResetTokensByEmail,
} from "@/features/auth/repository";
import { sendEmail } from "@/lib/email";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 jam

const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

function resetEmailHtml(resetUrl) {
  return `
  <div style="font-family:Poppins,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1F1F1F">
    <h1 style="font-size:22px;margin:0 0 8px;color:#9E7E40">IKARA</h1>
    <p style="font-size:14px;line-height:1.6;color:#555">
      Kami menerima permintaan untuk mengatur ulang kata sandi akun Anda.
      Klik tombol di bawah untuk membuat kata sandi baru. Tautan ini berlaku selama <strong>1 jam</strong>.
    </p>
    <a href="${resetUrl}"
       style="display:inline-block;margin:20px 0;padding:12px 24px;background:#C8A96A;color:#fff;text-decoration:none;border-radius:9999px;font-weight:600;font-size:14px">
      Atur Ulang Kata Sandi
    </a>
    <p style="font-size:12px;line-height:1.6;color:#888">
      Jika Anda tidak meminta ini, abaikan email ini — kata sandi Anda tidak akan berubah.
    </p>
    <p style="font-size:11px;color:#aaa;word-break:break-all">${resetUrl}</p>
  </div>`;
}

/**
 * Memproses permintaan reset password. SELALU mengembalikan success generik
 * (anti-enumeration): tidak membocorkan apakah email terdaftar.
 */
export async function requestPasswordReset(email) {
  const user = await findUserByEmail(email);

  // Hanya kirim untuk akun berkredensial (punya password). Akun Google-only
  // dilewati diam-diam. Apa pun kondisinya, respons ke user tetap generik.
  if (user?.email && user.password) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = sha256(rawToken);

    await deletePasswordResetTokensByEmail(user.email);
    await createPasswordResetToken({
      email: user.email,
      token: tokenHash,
      expires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    });

    const resetUrl = `${APP_URL}/reset-password?token=${rawToken}`;
    await sendEmail({
      to: user.email,
      subject: "Atur Ulang Kata Sandi — IKARA",
      html: resetEmailHtml(resetUrl),
    });
  }

  return { success: true };
}

/**
 * Validasi token & set kata sandi baru. Token bersifat sekali pakai & kadaluarsa.
 */
export async function resetPassword(rawToken, newPassword) {
  const tokenHash = sha256(rawToken);
  const record = await findPasswordResetToken(tokenHash);

  if (!record || record.expires < new Date()) {
    // Bersihkan token kadaluarsa bila ada
    if (record) await deletePasswordResetTokensByEmail(record.email);
    return { success: false, error: "Token tidak valid atau sudah kedaluwarsa." };
  }

  const user = await findUserByEmail(record.email);
  if (!user) {
    await deletePasswordResetTokensByEmail(record.email);
    return { success: false, error: "Token tidak valid atau sudah kedaluwarsa." };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await updateUserPassword(user.email, hashedPassword);
  await deletePasswordResetTokensByEmail(record.email); // sekali pakai

  return { success: true };
}


export async function registerUser(data) {
  const existingUser = await findUserByEmail(data.email);
  if (existingUser) {
    return { success: false, error: "Email is already registered." };
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const newUser = await createUser({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });

  const { password: _, ...safeUser } = newUser;

  return { success: true, user: safeUser };
}

export async function validateUserCredentials(credentials) {
  if (!credentials?.email || !credentials?.password) return null;

  const user = await findUserByEmail(credentials.email);

  if (!user || !user.password) return null;

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!isPasswordValid) return null;

  return user;
}
