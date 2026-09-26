import "server-only";
import { db } from "@/lib/db";

export async function findUserByEmail(email) {
  return db.user.findUnique({ where: { email } });
}

export async function createUser(data) {
  return db.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
    },
  });
}

export async function updateUserPassword(email, hashedPassword) {
  return db.user.update({
    where: { email },
    data: { password: hashedPassword },
  });
}

// ----- Password Reset Token -----

/** Hapus semua token reset milik sebuah email (invalidasi token lama). */
export async function deletePasswordResetTokensByEmail(email) {
  return db.passwordResetToken.deleteMany({ where: { email } });
}

/** Simpan token reset baru (token = hash SHA-256). */
export async function createPasswordResetToken({ email, token, expires }) {
  return db.passwordResetToken.create({ data: { email, token, expires } });
}

/** Ambil token reset berdasarkan hash-nya. */
export async function findPasswordResetToken(tokenHash) {
  return db.passwordResetToken.findUnique({ where: { token: tokenHash } });
}

/** Hapus satu token reset berdasarkan hash (dipakai setelah dipakai/expired). */
export async function deletePasswordResetToken(tokenHash) {
  return db.passwordResetToken.deleteMany({ where: { token: tokenHash } });
}
