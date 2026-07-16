import "server-only";
import bcrypt from "bcryptjs";
import {
  findUserByEmail,
  createUser,
} from "@/server/repositories/user.repository";

/**
 * Service Layer - Auth
 * Business logic terkait autentikasi.
 * Import "server-only" memastikan file ini tidak pernah dijalankan di client.
 */

/**
 * Registrasi user baru dengan email dan password
 * @param {{ name: string, email: string, password: string }} data
 * @returns {{ success: boolean, user?: object, error?: string }}
 */
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

  // Jangan kembalikan password ke client
  const { password: _, ...safeUser } = newUser;

  return { success: true, user: safeUser };
}

/**
 * Validasi credentials saat login (digunakan oleh Credentials Provider)
 * @param {{ email: string, password: string }} credentials
 * @returns {object|null}
 */
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
