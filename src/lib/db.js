import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";

// Singleton pattern untuk mencegah multiple PrismaClient instances
const globalForPrisma = globalThis;

const connectionString = (process.env.DATABASE_URL || "").replace(
  /^["']|["']$/g,
  ""
);

if (!connectionString) {
  throw new Error("[DB] DATABASE_URL tidak ditemukan di environment variables!");
}

function createPrismaClient() {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const db =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
