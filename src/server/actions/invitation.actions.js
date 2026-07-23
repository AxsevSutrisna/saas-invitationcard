"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { invitationFormSchema } from "@/lib/validations/invitation.schema";
import {
  createInvitation,
  deleteInvitation,
  checkSlugAvailability,
} from "@/server/repositories/invitation.repository";

import fs from "fs/promises";
import path from "path";

/**
 * Action: Memproses Pembuatan Undangan Baru
 */
export async function createInvitationAction(payload) {
  const debugPath = path.join(process.cwd(), "src", "action_debug.log");
  try {
    await fs.writeFile(debugPath, `[${new Date().toISOString()}] START - Payload: ${JSON.stringify(payload, null, 2)}\n`);

    const session = await auth();
    if (!session?.user?.id) {
      await fs.appendFile(debugPath, `[ERROR] No Session User ID\n`);
      return { success: false, error: "Sesi telah berakhir. Silakan login kembali." };
    }

    // Validasi Zod
    const validatedData = invitationFormSchema.parse(payload);

    // Cek keunikan slug
    const isSlugFree = await checkSlugAvailability(validatedData.slug);
    if (!isSlugFree) {
      await fs.appendFile(debugPath, `[ERROR] Slug already used: ${validatedData.slug}\n`);
      return {
        success: false,
        error: `Alamat URL "${validatedData.slug}" sudah digunakan. Silakan gunakan slug lain.`,
      };
    }

    // Eksekusi Simpan di PostgreSQL
    const newInvitation = await createInvitation(session.user.id, validatedData);

    await fs.appendFile(debugPath, `[SUCCESS] Created Invitation ID: ${newInvitation.id}\n`);

    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        id: newInvitation.id,
        slug: newInvitation.slug,
      },
    };
  } catch (error) {
    console.error("Error createInvitationAction:", error);
    try {
      await fs.appendFile(debugPath, `[ERROR] Exception: ${error.message}\nStack: ${error.stack}\n`);
    } catch (e) {
      console.error("Failed to write error log:", e);
    }
    return {
      success: false,
      error: error.message || "Gagal membuat undangan. Silakan coba lagi.",
    };
  }
}

/**
 * Action: Menghapus Undangan
 */
export async function deleteInvitationAction(invitationId) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Sesi telah berakhir. Silakan login kembali." };
    }

    await deleteInvitation(invitationId, session.user.id);

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error deleteInvitationAction:", error);
    return {
      success: false,
      error: "Gagal menghapus undangan. Silakan coba lagi.",
    };
  }
}
