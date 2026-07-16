import { handlers } from "@/lib/auth";

/**
 * Route Handler untuk Auth.js
 * CATATAN: Route ini HARUS berada di /api/auth/ (bukan /api/v1/auth/)
 * karena Auth.js secara internal mengenali prefix ini.
 */
export const { GET, POST } = handlers;
