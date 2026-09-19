import { z } from "zod";

/**
 * Step 1: Informasi Dasar & Pilih Tema
 */
export const step1InfoSchema = z.object({
  title: z
    .string()
    .min(3, "Judul undangan minimal 3 karakter")
    .max(100, "Judul undangan maksimal 100 karakter"),
  slug: z
    .string()
    .min(3, "Alamat URL (slug) minimal 3 karakter")
    .max(50, "Alamat URL (slug) maksimal 50 karakter")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)"
    ),
  themeId: z.string().min(1, "Silakan pilih salah satu tema desain"),
});

/**
 * Step 2: Data Mempelai (Pasangan Pria & Wanita) & Foto Sampul
 */
export const step2CoupleSchema = z.object({
  // Mempelai Pria
  groomNickname: z.string().min(2, "Nama panggilan pria wajib diisi"),
  groomFullName: z.string().min(2, "Nama lengkap pria wajib diisi"),
  groomFather: z.string().optional(),
  groomMother: z.string().optional(),
  groomPhotoUrl: z.string().optional(),

  // Mempelai Wanita
  brideNickname: z.string().min(2, "Nama panggilan wanita wajib diisi"),
  brideFullName: z.string().min(2, "Nama lengkap wanita wajib diisi"),
  brideFather: z.string().optional(),
  brideMother: z.string().optional(),
  bridePhotoUrl: z.string().optional(),

  // Foto Sampul Prewedding
  coverUrl: z.string().optional(),
});

/**
 * Step 3: Event / Acara (Akad Nikah, Resepsi, dll)
 */
export const eventItemSchema = z.object({
  name: z.string().min(2, "Nama acara wajib diisi (misal: Akad Nikah)"),
  date: z.string().min(1, "Tanggal acara wajib diisi"),
  startTime: z.string().min(1, "Jam mulai wajib diisi"),
  endTime: z.string().optional(),
  locationName: z.string().min(2, "Nama tempat lokasi wajib diisi"),
  address: z.string().min(5, "Alamat lengkap lokasi wajib diisi"),
  mapUrl: z.string().optional(),
});

export const step3EventsSchema = z.object({
  events: z
    .array(eventItemSchema)
    .min(1, "Minimal harus ada 1 acara (misal: Akad Nikah)"),
});

/**
 * Step 4: Konten (Love Story, Galeri Foto, Kutipan/Ayat)
 */
export const loveStoryItemSchema = z.object({
  title: z.string().min(2, "Judul momen wajib diisi"),
  date: z.string().optional(),
  description: z.string().min(5, "Deskripsi cerita wajib diisi"),
  imageUrl: z.string().optional(),
});

export const galleryItemSchema = z.object({
  mediaUrl: z.string().min(1, "URL media wajib diisi"),
  type: z.enum(["PHOTO", "VIDEO"]).default("PHOTO"),
  caption: z.string().optional(),
});

export const step4ContentSchema = z.object({
  loveStories: z.array(loveStoryItemSchema).optional(),
  galleryLayout: z.enum(["CAROUSEL", "MASONRY"]).default("CAROUSEL"),
  galleries: z.array(galleryItemSchema).optional(),
  quotes: z.string().optional(),
});

/**
 * Step 5: Finalisasi (Informasi Bank Gift, Alamat Kado Fisik, Musik Latar)
 */
export const giftItemSchema = z.object({
  type: z.enum(["BANK", "EWALLET", "PHYSICAL"]).default("BANK"),
  providerName: z.string().min(2, "Nama bank / e-wallet wajib diisi (misal: BCA)"),
  accountName: z.string().min(2, "Nama pemilik rekening wajib diisi"),
  accountNumber: z.string().optional(),
  note: z.string().optional(),
});

export const step5FinalizationSchema = z.object({
  gifts: z.array(giftItemSchema).max(2, "Maksimal 2 rekening bank/e-wallet").optional(),
  physicalGiftAddress: z.string().optional(),
  physicalGiftReceiver: z.string().optional(),
  physicalGiftPhone: z.string().optional(),
  musicUrl: z.string().optional(),
  musicTitle: z.string().optional(),
  isMusicEnabled: z.boolean().default(true),
});

/**
 * Skema gabungan lengkap untuk submit form wizard pembuatan undangan
 */
export const invitationFormSchema = step1InfoSchema
  .merge(step2CoupleSchema)
  .merge(step3EventsSchema)
  .merge(step4ContentSchema)
  .merge(step5FinalizationSchema)
  .extend({
    groomName: z.string().optional(),
    brideName: z.string().optional(),
    isPublished: z.boolean().default(true),
  });
