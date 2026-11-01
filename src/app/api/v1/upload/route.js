import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isSuperAdmin } from "@/constants/roles";
import { uploadImage, MAX_IMAGE_INPUT_BYTES } from "@/features/upload/upload.service";

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
    const invitationId = form.get("invitationId");
    const scope = form.get("scope");

    // Aset tema (scope "theme") → folder `themes/` milik platform; hanya SUPER_ADMIN.
    if (scope === "theme" && !isSuperAdmin(session.user.role)) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
          error: { code: "FORBIDDEN", details: ["Hanya Super Admin yang dapat mengunggah aset tema."] },
        },
        { status: 403 }
      );
    }

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

    // Terima GAMBAR format APA PUN: cukup bertipe `image/*` (atau tanpa tipe,
    // biarkan sharp yang memvalidasi). Konversi ke WebP dilakukan di server,
    // sehingga apa pun yang bisa dibaca sharp akan tersimpan sebagai .webp.
    const looksLikeImage = !file.type || file.type.startsWith("image/");
    if (!looksLikeImage) {
      return NextResponse.json(
        {
          success: false,
          message: "Tipe berkas tidak didukung.",
          error: {
            code: "INVALID_FILE_TYPE",
            details: ["Hanya berkas gambar yang diperbolehkan pada endpoint ini."],
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

    // Konversi (sharp → WebP) + unggah. Kegagalan di sini umumnya karena berkas
    // bukan gambar valid / format tak terbaca → balas 422 (bukan 500).
    let result;
    try {
      result = await uploadImage(buffer, {
        userId: session.user.id,
        invitationId: typeof invitationId === "string" && invitationId ? invitationId : undefined,
        folder: typeof folder === "string" ? folder : "images",
        scope: scope === "theme" ? "theme" : undefined,
      });
    } catch (convErr) {
      console.error("[POST /api/v1/upload] konversi/unggah gagal:", convErr?.message);
      return NextResponse.json(
        {
          success: false,
          message: "Berkas gambar tidak dapat diproses.",
          error: {
            code: "IMAGE_PROCESSING_FAILED",
            details: ["Pastikan berkas benar-benar gambar yang valid. Sebagian format eksotik mungkin tidak didukung."],
          },
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { url: result.url, width: result.width, height: result.height },
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
