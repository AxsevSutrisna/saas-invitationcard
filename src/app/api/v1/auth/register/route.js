import { NextResponse } from "next/server";
import { registerSchema } from "@/validations/auth.validation";
import { registerUser } from "@/server/services/auth.service";

/**
 * POST /api/v1/auth/register
 * Endpoint registrasi user baru.
 * Thin controller — hanya validasi input dan delegasi ke service.
 */
export async function POST(req) {
  try {
    const body = await req.json();

    // Validasi input dengan Zod
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.errors.map((e) => e.message);
      return NextResponse.json(
        { success: false, message: errors[0], errors },
        { status: 400 }
      );
    }

    // Delegasi ke service layer
    const result = await registerUser(validation.data);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Registrasi berhasil!", data: result.user },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/v1/auth/register]", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
