import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { s3Client, R2_BUCKET_NAME, R2_PUBLIC_DOMAIN } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Batasan tipe & ukuran berkas
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
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

    // 3. Klasifikasi & Validasi Tipe & Ukuran File
    const isImage = ALLOWED_IMAGE_TYPES.includes(fileType);
    const isAudio = ALLOWED_AUDIO_TYPES.includes(fileType);

    if (!isImage && !isAudio) {
      return NextResponse.json(
        {
          success: false,
          message: "Tipe berkas tidak didukung.",
          error: { code: "INVALID_FILE_TYPE", details: ["Hanya mendukung gambar (JPEG, PNG, WEBP) atau audio (MP3, WAV, M4A)."] },
        },
        { status: 400 }
      );
    }

    if (isImage && fileSize > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Ukuran berkas melebihi batas.",
          error: { code: "FILE_TOO_LARGE", details: ["Ukuran gambar maksimal 5MB."] },
        },
        { status: 400 }
      );
    }

    if (isAudio && fileSize > MAX_AUDIO_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Ukuran berkas melebihi batas.",
          error: { code: "FILE_TOO_LARGE", details: ["Ukuran berkas musik maksimal 10MB."] },
        },
        { status: 400 }
      );
    }

    // 4. Generate Unique Key untuk S3/R2
    const fileExtension = filename.split(".").pop() || "";
    const cleanExtension = fileExtension.toLowerCase().replace(/[^a-z0-9]/g, "");
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10);
    const folder = isImage ? "images" : "audio";
    
    const uniqueKey = `invitations/${session.user.id}/${folder}/${timestamp}-${randomStr}.${cleanExtension}`;

    // 5. Generate Presigned URL (PUT)
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: uniqueKey,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    // 6. Tentukan URL Publik Akhir
    const cleanPublicDomain = R2_PUBLIC_DOMAIN.endsWith("/") ? R2_PUBLIC_DOMAIN.slice(0, -1) : R2_PUBLIC_DOMAIN;
    const publicUrl = `${cleanPublicDomain}/${uniqueKey}`;

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
