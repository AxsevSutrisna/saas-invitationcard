import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Serialisasi objek Prisma (Date, dsb) menjadi plain object aman untuk
 * dikirim dari Server Component ke Client Component.
 */
export function serialize(data) {
  return JSON.parse(JSON.stringify(data));
}
