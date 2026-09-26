import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  uploadImage,
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_INPUT_BYTES,
} from "@/features/upload/upload.service";

// sharp adalah modul native → wajib Node.js runtime (bukan Edge).
export const runtime = "nodejs";

/**
 * POST /api/v1/upload  (multipart/form-data)
 * Field: `file` (gambar, format apa pun), `folder` (opsional).
 *
 * Alur: terima berkas → konversi ke WebP (sharp) → unggah ke R2 → balas URL .webp.
 * Berbeda dari alur presigned (dipakai audio) yang unggah langsung ke R2 tanpa
 * menyentuh server; gambar HARUS lewat server agar bisa dikonversi.
 */
export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
          error: { code: "UNAUTHORIZED", details: ["Anda harus masuk untuk mengunggah berkas."] },
        },
        { status: 401 }
      );
    }

    const form = await req.formData();
    const file = form.get("file");
    const folder = form.get("folder");

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        {
          success: false,
          message: "Bad Request",
          error: { code: "VALIDATION_ERROR", details: ["Field 'file' wajib diisi."] },
        },
        { status: 400 }
      );
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Tipe berkas tidak didukung.",
          error: {
            code: "INVALID_FILE_TYPE",
            details: ["Hanya mendukung berkas gambar (JPEG, PNG, WEBP, GIF, AVIF, HEIC)."],
          },
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_INPUT_BYTES) {
      return NextResponse.json(
        {
          success: false,
          message: "Ukuran berkas melebihi batas.",
          error: { code: "FILE_TOO_LARGE", details: ["Ukuran gambar maksimal 10MB."] },
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, width, height } = await uploadImage(buffer, {
      userId: session.user.id,
      folder: typeof folder === "string" ? folder : "images",
    });

    return NextResponse.json({
      success: true,
      data: { url, width, height },
    });
  } catch (error) {
    console.error("[POST /api/v1/upload]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memproses berkas.",
        error: { code: "INTERNAL_SERVER_ERROR", details: [error.message] },
      },
      { status: 500 }
    );
  }
}
