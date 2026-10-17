import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { s3Client, R2_BUCKET_NAME, buildPublicUrl, buildUserObjectKey } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Endpoint ini KHUSUS AUDIO (unggah langsung ke R2 via presigned PUT).
// Gambar selalu lewat POST /api/v1/upload (dikompres sharp → WebP).
const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/x-m4a"];

export async function POST(req) {
  try {
    // 1. Verifikasi Otentikasi Sesi
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

    // 2. Baca payload JSON
    const body = await req.json();
    const { filename, fileType, fileSize } = body;

    if (!filename || !fileType || !fileSize) {
      return NextResponse.json(
        {
          success: false,
          message: "Bad Request",
          error: { code: "VALIDATION_ERROR", details: ["Parameter filename, fileType, dan fileSize wajib diisi."] },
        },
        { status: 400 }
      );
    }

    // 3. Validasi Tipe & Ukuran File (audio saja)
    if (!ALLOWED_AUDIO_TYPES.includes(fileType)) {
      return NextResponse.json(
        {
          success: false,
          message: "Tipe berkas tidak didukung.",
          error: { code: "INVALID_FILE_TYPE", details: ["Endpoint ini hanya untuk audio (MP3, WAV, OGG, M4A)."] },
        },
        { status: 400 }
      );
    }

    if (fileSize > MAX_AUDIO_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Ukuran berkas melebihi batas.",
          error: { code: "FILE_TOO_LARGE", details: ["Ukuran berkas musik maksimal 10MB."] },
        },
        { status: 400 }
      );
    }

    // 4. Generate Unique Key untuk S3/R2 (builder bersama — prefix & konvensi
    //    terpusat di r2.js agar selaras dengan guard penghapusan).
    const fileExtension = filename.split(".").pop() || "";
    const uniqueKey = buildUserObjectKey({
      userId: session.user.id,
      folder: "audio",
      ext: fileExtension,
    });

    // 5. Generate Presigned URL (PUT)
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: uniqueKey,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    // 6. Tentukan URL Publik Akhir (buildPublicUrl menjamin skema https://)
    const publicUrl = buildPublicUrl(uniqueKey);

    return NextResponse.json({
      success: true,
      data: {
        presignedUrl,
        publicUrl,
        key: uniqueKey,
      },
    });
  } catch (error) {
    console.error("[POST /api/v1/upload/presigned-url]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
        error: { code: "INTERNAL_SERVER_ERROR", details: [error.message] },
      },
      { status: 500 }
    );
  }
}
