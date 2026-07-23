"use server";

import fs from "fs/promises";
import path from "path";

/**
 * Server Action - Local File Upload Handler (Development Mode)
 * Menyimpan file gambar/media yang diunggah ke folder lokal `public/uploads/`
 * dan mengembalikan URL publik `/uploads/filename.ext`
 */
export async function uploadFileAction(formData) {
  try {
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return { success: false, error: "File tidak ditemukan dalam form data." };
    }

    // Validasi ukuran (maksimal 20MB)
    if (file.size > 20 * 1024 * 1024) {
      return { success: false, error: "Ukuran file terlalu besar (Maksimal 20MB)." };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Pastikan direktori `public/uploads` ada
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Format nama file unik: timestamp-random.ext
    const ext = path.extname(file.name) || ".jpg";
    const cleanExt = ext.toLowerCase();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${cleanExt}`;
    const filePath = path.join(uploadsDir, filename);

    // Tulis buffer ke file lokal
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Local File Upload Error:", error);
    return { success: false, error: "Terjadi kesalahan saat menyimpan file ke folder lokal." };
  }
}
