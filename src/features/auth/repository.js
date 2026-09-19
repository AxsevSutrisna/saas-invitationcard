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
