import { NextResponse } from "next/server";
import { registerSchema } from "@/validations/auth.validation";
import { registerUser } from "@/server/services/auth.service";

export async function POST(req) {
  try {
    const body = await req.json();
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.errors.map((e) => e.message);
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          error: {
            code: "VALIDATION_ERROR",
            details: errors,
          },
        },
        { status: 400 }
      );
    }

    const result = await registerUser(validation.data);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.error,
          error: {
            code: "CONFLICT_ERROR",
            details: [result.error],
          },
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful!",
        data: result.user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/v1/auth/register]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
        error: {
          code: "INTERNAL_SERVER_ERROR",
          details: ["An unexpected error occurred on the server."],
        },
      },
      { status: 500 }
    );
  }
}
