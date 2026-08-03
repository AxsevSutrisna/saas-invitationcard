import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { invitationId, referrer } = body;

    // 1. Validasi Input Utama
    if (!invitationId) {
      return NextResponse.json(
        { success: false, message: "Invitation ID wajib disertakan." },
        { status: 400 }
      );
    }

    // 2. Ambil IP Address Klien dari Headers (Mendukung Proxy/CDN Cloudflare)
    const forwardHeader = request.headers.get("x-forwarded-for");
    const realIpHeader = request.headers.get("x-real-ip");
    const cfIpHeader = request.headers.get("cf-connecting-ip");

    let rawIp = "127.0.0.1";
    if (cfIpHeader) {
      rawIp = cfIpHeader;
    } else if (realIpHeader) {
      rawIp = realIpHeader;
    } else if (forwardHeader) {
      rawIp = forwardHeader.split(",")[0].trim();
    }

    // 3. Enkripsi IP Address (SHA256) demi Kepatuhan Privasi / GDPR Compliant
    const hashedIp = crypto
      .createHash("sha256")
      .update(rawIp)
      .digest("hex");

    // 4. Ambil User Agent dari Headers
    const userAgent = request.headers.get("user-agent") || "Unknown Device";

    // 5. Simpan Log Kunjungan ke Database Neon
    await db.visitorLog.create({
      data: {
        invitationId,
        ipAddress: hashedIp,
        userAgent,
        referrer: referrer || "Direct Visit",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Log kunjungan berhasil dicatat.",
    });
  } catch (error) {
    console.error("Analytics Visit API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mencatat kunjungan.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
