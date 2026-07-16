import "server-only";
import { db } from "@/lib/db";

/**
 * Repository Layer - User
 * Query database untuk entitas User.
 * Import "server-only" memastikan file ini tidak pernah dijalankan di client.
 */

/**
 * Cari user berdasarkan email
 * @param {string} email
 */
export async function findUserByEmail(email) {
  return db.user.findUnique({ where: { email } });
}

/**
 * Cari user berdasarkan ID
 * @param {string} id
 */
export async function findUserById(id) {
  return db.user.findUnique({ where: { id } });
}

/**
 * Buat user baru
 * @param {{ name: string, email: string, password: string }} data
 */
export async function createUser(data) {
  return db.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
    },
  });
}

/**
 * Update data user
 * @param {string} id
 * @param {object} data
 */
export async function updateUser(id, data) {
  return db.user.update({ where: { id }, data });
}
