"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { upsertActiveSubscription } from "@/server/repositories/subscription.repository";

// Helper Keamanan Super Admin
async function checkSuperAdmin() {
  const session = await auth();
  if (!session || !session.user || session.user.email !== "asepsutrisnasp@gmail.com") {
    throw new Error("Akses ditolak. Anda tidak memiliki wewenang Super Admin.");
  }
  return session.user;
}

// =============================================================================
// 1. MANAJEMEN PENGGUNA (USERS)
// =============================================================================

export async function updateUserRoleAction(userId, role) {
  try {
    await checkSuperAdmin();
    
    await db.user.update({
      where: { id: userId },
      data: { role },
    });
    
    revalidatePath("/dashboard/admin");
    return { success: true, message: "Peran pengguna berhasil diperbarui." };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function upgradeUserSubscriptionAction(userId, packageId) {
  try {
    await checkSuperAdmin();

    const pkg = await db.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      return { success: false, error: "Paket langganan tidak ditemukan." };
    }

    // Aktifkan subskripsi secara manual melalui repository
    await upsertActiveSubscription({
      userId,
      packageId,
      durationDays: pkg.durationDays,
    });

    revalidatePath("/dashboard/admin");
    return { success: true, message: "Paket langganan pengguna berhasil di-upgrade secara manual." };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// 2. KELOLA TEMA UNDANGAN (THEMES CRUD)
// =============================================================================

export async function createThemeAction(data) {
  try {
    await checkSuperAdmin();
    const { name, slug, description, thumbnailUrl, isPremium, isActive } = data;

    // Cek duplikasi slug
    const exists = await db.theme.findUnique({ where: { slug } });
    if (exists) {
      return { success: false, error: "Tema dengan slug tersebut sudah terdaftar." };
    }

    const created = await db.theme.create({
      data: {
        name,
        slug,
        description: description || null,
        thumbnailUrl: thumbnailUrl || null,
        isPremium: isPremium ?? false,
        isActive: isActive ?? true,
      },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/themes");
    return { success: true, message: "Tema undangan baru berhasil ditambahkan.", data: created };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateThemeAction(themeId, data) {
  try {
    await checkSuperAdmin();
    const { name, slug, description, thumbnailUrl, isPremium, isActive } = data;

    await db.theme.update({
      where: { id: themeId },
      data: {
        name,
        slug,
        description: description ?? null,
        thumbnailUrl: thumbnailUrl ?? null,
        isPremium: isPremium ?? false,
        isActive: isActive ?? true,
      },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/themes");
    return { success: true, message: "Tema undangan berhasil diperbarui." };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteThemeAction(themeId) {
  try {
    await checkSuperAdmin();

    // Pastikan tema tidak sedang digunakan oleh undangan manapun
    const count = await db.invitation.count({
      where: { themeId },
    });

    if (count > 0) {
      return {
        success: false,
        error: "Tema tidak bisa dihapus karena sedang digunakan oleh undangan aktif.",
      };
    }

    await db.theme.delete({
      where: { id: themeId },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/themes");
    return { success: true, message: "Tema berhasil dihapus." };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// 3. TEMPLAT AYAT & KUTIPAN (QUOTES CRUD)
// =============================================================================

export async function createQuoteTemplateAction(data) {
  try {
    await checkSuperAdmin();
    const { title, content, category } = data;

    const created = await db.quoteTemplate.create({
      data: {
        title,
        content,
        category: category || "General",
      },
    });

    revalidatePath("/dashboard/admin");
    return { success: true, message: "Templat ayat berhasil ditambahkan.", data: created };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateQuoteTemplateAction(quoteId, data) {
  try {
    await checkSuperAdmin();
    const { title, content, category } = data;

    await db.quoteTemplate.update({
      where: { id: quoteId },
      data: {
        title,
        content,
        category: category || "General",
      },
    });

    revalidatePath("/dashboard/admin");
    return { success: true, message: "Templat ayat berhasil diperbarui." };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteQuoteTemplateAction(quoteId) {
  try {
    await checkSuperAdmin();

    await db.quoteTemplate.delete({
      where: { id: quoteId },
    });

    revalidatePath("/dashboard/admin");
    return { success: true, message: "Templat ayat berhasil dihapus." };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// 4. PUSTAKA LAGU LATAR (MUSIC CRUD)
// =============================================================================

export async function createMusicTemplateAction(data) {
  try {
    await checkSuperAdmin();
    const { title, url, isActive } = data;

    const created = await db.musicTemplate.create({
      data: {
        title,
        url,
        isActive: isActive ?? true,
      },
    });

    revalidatePath("/dashboard/admin");
    return { success: true, message: "Lagu latar berhasil ditambahkan.", data: created };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateMusicTemplateAction(musicId, data) {
  try {
    await checkSuperAdmin();
    const { title, url, isActive } = data;

    await db.musicTemplate.update({
      where: { id: musicId },
      data: {
        title,
        url,
        isActive: isActive ?? true,
      },
    });

    revalidatePath("/dashboard/admin");
    return { success: true, message: "Lagu latar berhasil diperbarui." };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteMusicTemplateAction(musicId) {
  try {
    await checkSuperAdmin();

    await db.musicTemplate.delete({
      where: { id: musicId },
    });

    revalidatePath("/dashboard/admin");
    return { success: true, message: "Lagu latar berhasil dihapus." };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// 5. KELOLA FAQ LANDING PAGE (FAQ CRUD)
// =============================================================================

export async function createFaqAction(data) {
  try {
    await checkSuperAdmin();
    const { question, answer, sortOrder } = data;

    let finalSortOrder = parseInt(sortOrder);
    if (isNaN(finalSortOrder) || finalSortOrder === undefined || finalSortOrder === null) {
      const maxFaq = await db.fAQ.findFirst({
        orderBy: { sortOrder: "desc" },
      });
      finalSortOrder = maxFaq ? maxFaq.sortOrder + 1 : 0;
    } else {
      finalSortOrder = Math.max(0, finalSortOrder);
    }

    const created = await db.fAQ.create({
      data: {
        question,
        answer,
        sortOrder: finalSortOrder,
      },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/");
    return { success: true, message: "FAQ baru berhasil ditambahkan.", data: created };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateFaqAction(faqId, data) {
  try {
    await checkSuperAdmin();
    const { question, answer, sortOrder } = data;

    let finalSortOrder = parseInt(sortOrder);
    if (isNaN(finalSortOrder) || finalSortOrder === undefined || finalSortOrder === null) {
      const maxFaq = await db.fAQ.findFirst({
        orderBy: { sortOrder: "desc" },
      });
      finalSortOrder = maxFaq ? maxFaq.sortOrder + 1 : 0;
    } else {
      finalSortOrder = Math.max(0, finalSortOrder);
    }

    await db.fAQ.update({
      where: { id: faqId },
      data: {
        question,
        answer,
        sortOrder: finalSortOrder,
      },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/");
    return { success: true, message: "FAQ berhasil diperbarui." };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteFaqAction(faqId) {
  try {
    await checkSuperAdmin();

    await db.fAQ.delete({
      where: { id: faqId },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/");
    return { success: true, message: "FAQ berhasil dihapus." };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// 6. PENGATURAN WHATSAPP & GLOBAL SETTINGS
// =============================================================================

export async function updateSystemSettingAction(key, value) {
  try {
    await checkSuperAdmin();

    await db.systemSetting.upsert({
      where: { key },
      update: { value },
      create: {
        key,
        value,
        description: "Nomor WhatsApp Customer Service Melayang",
      },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/");
    return { success: true, message: "Pengaturan berhasil diperbarui." };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
