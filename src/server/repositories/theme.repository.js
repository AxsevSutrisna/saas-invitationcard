import "server-only";
import { db } from "@/lib/db";

export async function findAllActiveThemes() {
  return db.theme.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function findThemeBySlug(slug) {
  return db.theme.findUnique({
    where: { slug },
  });
}

export async function findThemeById(id) {
  return db.theme.findUnique({
    where: { id },
  });
}
