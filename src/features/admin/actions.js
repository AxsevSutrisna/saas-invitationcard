"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { deleteObjectByUrl, deleteObjectsByUrls } from "@/lib/r2";
import { upsertActiveSubscription } from "@/features/subscription/repository";
import { grantEntitlementFromPackage } from "@/features/entitlement/service";
import { requireSuperAdmin } from "@/features/auth/guard";
import { ROLE_VALUES } from "@/constants/roles";

// Nilai enum yang sah untuk validasi input paket/fitur (cegah nilai liar ke DB).
const PACKAGE_KINDS = ["PLAN", "ADDON", "BUNDLE"];
const SALE_TYPES = ["ONE_TIME", "SUBSCRIPTION", "RESELLER"];
const FEATURE_TYPES = ["BOOLEAN", "QUOTA"];

/**
 * Normalisasi daftar penugasan fitur ke paket (featureAssignments) dari form.
 * @param {Array<{featureId: string, enabled?: boolean, limitValue?: number|string|null}>} assignments
 */
function normalizeFeatureAssignments(assignments) {
  if (!Array.isArray(assignments)) return [];
  return assignments
    .filter((a) => a && a.featureId)
    .map((a) => ({
      featureId: a.featureId,
      enabled: a.enabled ?? true,
      limitValue:
        a.limitValue === "" || a.limitValue == null
          ? null
          : Math.max(0, parseInt(a.limitValue) || 0),
    }));
}

/**
 * Normalisasi isi bundle (bundleItems) dari form: buang item kosong, duplikat,
 * dan referensi ke diri sendiri (selfId) agar bundle tidak memuat dirinya.
 */
function normalizeBundleItems(bundleItems, selfId) {
  if (!Array.isArray(bundleItems)) return [];
  const seen = new Set();
  const out = [];
  for (const b of bundleItems) {
    if (!b || !b.itemId || b.itemId === selfId || seen.has(b.itemId)) continue;
    seen.add(b.itemId);
    out.push({ itemId: b.itemId, quantity: Math.max(1, parseInt(b.quantity) || 1) });
  }
  return out;
}

/**
 * Menentukan urutan (sortOrder) FAQ: pakai nilai yang diberikan bila valid,
 * jika tidak, taruh di urutan paling akhir.
 */
async function resolveFaqSortOrder(sortOrder) {
  const parsed = parseInt(sortOrder);
  if (isNaN(parsed)) {
    const maxFaq = await db.fAQ.findFirst({ orderBy: { sortOrder: "desc" } });
    return maxFaq ? maxFaq.sortOrder + 1 : 0;
  }
  return Math.max(0, parsed);
}

// =============================================================================
// 1. MANAJEMEN PENGGUNA (USERS)
// =============================================================================

export async function updateUserRoleAction(userId, role) {
  try {
    await requireSuperAdmin();

    // Validasi: hanya terima nilai role yang sah (cegah nilai sembarang ke DB).
    if (!ROLE_VALUES.includes(role)) {
      return { success: false, error: "Peran tidak valid." };
    }

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
    await requireSuperAdmin();

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
    await requireSuperAdmin();
    const { name, slug, description, category, thumbnailUrl, previewImages, isPremium, isActive } = data;
    const previews = Array.isArray(previewImages) ? previewImages.filter(Boolean) : [];

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
        category: category || null,
        thumbnailUrl: thumbnailUrl || null,
        previewImages: previews,
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
    await requireSuperAdmin();
    const { name, slug, description, category, thumbnailUrl, previewImages, isPremium, isActive } = data;
    const newPreviews = Array.isArray(previewImages) ? previewImages.filter(Boolean) : [];

    // Ambil aset lama untuk cek pergantian gambar (thumbnail + preview)
    const existing = await db.theme.findUnique({
      where: { id: themeId },
      select: { thumbnailUrl: true, previewImages: true },
    });

    await db.theme.update({
      where: { id: themeId },
      data: {
        name,
        slug,
        description: description ?? null,
        category: category || null,
        thumbnailUrl: thumbnailUrl ?? null,
        previewImages: newPreviews,
        isPremium: isPremium ?? false,
        isActive: isActive ?? true,
      },
    });

    // Bersihkan objek R2 lama yang tak lagi dipakai (thumbnail diganti + preview
    // yang dihapus). Best-effort; aset tema (bukan ber-prefix user) → tanpa guard.
    const oldPreviews = Array.isArray(existing?.previewImages) ? existing.previewImages : [];
    const orphaned = oldPreviews.filter((u) => !newPreviews.includes(u));
    if (existing?.thumbnailUrl && existing.thumbnailUrl !== (thumbnailUrl ?? null)) {
      orphaned.push(existing.thumbnailUrl);
    }
    if (orphaned.length > 0) {
      await deleteObjectsByUrls(orphaned);
    }

    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/themes");
    return { success: true, message: "Tema undangan berhasil diperbarui." };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteThemeAction(themeId) {
  try {
    await requireSuperAdmin();

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

    // Ambil aset R2 (thumbnail + preview) sebelum record dihapus
    const existing = await db.theme.findUnique({
      where: { id: themeId },
      select: { thumbnailUrl: true, previewImages: true },
    });

    await db.theme.delete({
      where: { id: themeId },
    });

    // Bersihkan objek R2 milik tema (best-effort, guard domain).
    const previews = Array.isArray(existing?.previewImages)
      ? existing.previewImages
      : [];
    await deleteObjectsByUrls([existing?.thumbnailUrl, ...previews]);

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
    await requireSuperAdmin();
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
    await requireSuperAdmin();
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
    await requireSuperAdmin();

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
    await requireSuperAdmin();
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
    await requireSuperAdmin();
    const { title, url, isActive } = data;

    // Ambil URL lagu lama untuk cek pergantian berkas
    const existing = await db.musicTemplate.findUnique({
      where: { id: musicId },
      select: { url: true },
    });

    await db.musicTemplate.update({
      where: { id: musicId },
      data: {
        title,
        url,
        isActive: isActive ?? true,
      },
    });

    // Berkas lama diganti → hapus objek R2 lama (best-effort, guard domain).
    if (existing?.url && existing.url !== url) {
      await deleteObjectByUrl(existing.url);
    }

    revalidatePath("/dashboard/admin");
    return { success: true, message: "Lagu latar berhasil diperbarui." };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteMusicTemplateAction(musicId) {
  try {
    await requireSuperAdmin();

    // Ambil URL berkas sebelum record dihapus
    const existing = await db.musicTemplate.findUnique({
      where: { id: musicId },
      select: { url: true },
    });

    await db.musicTemplate.delete({
      where: { id: musicId },
    });

    // Bersihkan berkas audio di R2 (best-effort, guard domain).
    await deleteObjectByUrl(existing?.url);

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
    await requireSuperAdmin();
    const { question, answer, sortOrder } = data;

    const finalSortOrder = await resolveFaqSortOrder(sortOrder);

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
    await requireSuperAdmin();
    const { question, answer, sortOrder } = data;

    const finalSortOrder = await resolveFaqSortOrder(sortOrder);

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
    await requireSuperAdmin();

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
    await requireSuperAdmin();

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

// =============================================================================
// 7. KELOLA PAKET & BUNDLING (PACKAGES CRUD)
// =============================================================================
// Membuat harga, kuota, masa aktif, dan fitur paket bisa diubah dari panel admin
// TANPA edit seed / deploy ulang. `features` = bullet marketing (tampilan);
// gating nyata ditentukan oleh penugasan fitur (PackageFeature).

/** Rakit objek data scalar Package dari payload form (dipakai create & update). */
function buildPackageScalarData(data) {
  const {
    name,
    slug,
    description,
    kind,
    saleType,
    price,
    wholesalePrice,
    features,
    maxInvitations,
    durationDays,
    sortOrder,
    isHighlighted,
    isActive,
  } = data;

  return {
    name,
    slug,
    description: description || null,
    kind: PACKAGE_KINDS.includes(kind) ? kind : "PLAN",
    saleType: SALE_TYPES.includes(saleType) ? saleType : "ONE_TIME",
    price: Math.max(0, parseInt(price) || 0),
    wholesalePrice:
      wholesalePrice === "" || wholesalePrice == null
        ? null
        : Math.max(0, parseInt(wholesalePrice) || 0),
    features: Array.isArray(features) ? features.filter(Boolean) : [],
    maxInvitations: Math.max(1, parseInt(maxInvitations) || 1),
    durationDays: Math.max(1, parseInt(durationDays) || 180),
    sortOrder: parseInt(sortOrder) || 0,
    isHighlighted: !!isHighlighted,
    isActive: isActive ?? true,
  };
}

export async function createPackageAction(data) {
  try {
    await requireSuperAdmin();

    if (!data?.name || !data?.slug) {
      return { success: false, error: "Nama dan slug paket wajib diisi." };
    }

    const exists = await db.package.findUnique({ where: { slug: data.slug } });
    if (exists) {
      return { success: false, error: "Paket dengan slug tersebut sudah terdaftar." };
    }

    const assignments = normalizeFeatureAssignments(data.featureAssignments);
    const bundleItems =
      data.kind === "BUNDLE" ? normalizeBundleItems(data.bundleItems, null) : [];

    const created = await db.package.create({
      data: {
        ...buildPackageScalarData(data),
        ...(assignments.length
          ? { packageFeatures: { create: assignments } }
          : {}),
        ...(bundleItems.length ? { bundleItems: { create: bundleItems } } : {}),
      },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/");
    revalidatePath("/dashboard/subscription");
    return { success: true, message: "Paket baru berhasil ditambahkan.", data: created };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updatePackageAction(packageId, data) {
  try {
    await requireSuperAdmin();

    if (!data?.name || !data?.slug) {
      return { success: false, error: "Nama dan slug paket wajib diisi." };
    }

    // Cek keunikan slug — izinkan slug yang sama bila masih milik paket ini.
    const slugOwner = await db.package.findUnique({
      where: { slug: data.slug },
      select: { id: true },
    });
    if (slugOwner && slugOwner.id !== packageId) {
      return { success: false, error: "Slug sudah digunakan oleh paket lain." };
    }

    const assignments = normalizeFeatureAssignments(data.featureAssignments);
    const bundleItems = normalizeBundleItems(data.bundleItems, packageId);

    await db.$transaction(async (tx) => {
      await tx.package.update({
        where: { id: packageId },
        data: buildPackageScalarData(data),
      });

      // Ganti seluruh penugasan fitur hanya bila field dikirim form.
      if (data.featureAssignments !== undefined) {
        await tx.packageFeature.deleteMany({ where: { packageId } });
        if (assignments.length) {
          await tx.packageFeature.createMany({
            data: assignments.map((a) => ({ ...a, packageId })),
          });
        }
      }

      // Ganti seluruh isi bundle hanya bila field dikirim form. Bila kind bukan
      // BUNDLE, isi bundle dikosongkan (pembersihan).
      if (data.bundleItems !== undefined) {
        await tx.bundleItem.deleteMany({ where: { bundleId: packageId } });
        if (bundleItems.length && data.kind === "BUNDLE") {
          await tx.bundleItem.createMany({
            data: bundleItems.map((b) => ({ ...b, bundleId: packageId })),
          });
        }
      }
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/");
    revalidatePath("/dashboard/subscription");
    return { success: true, message: "Paket berhasil diperbarui." };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deletePackageAction(packageId) {
  try {
    await requireSuperAdmin();

    // Jaga integritas: paket yang sudah dipakai langganan/transaksi/entitlement
    // tidak boleh dihapus (riwayat & hak akses bisa rusak). Sarankan nonaktifkan.
    const [subCount, txCount, entCount] = await Promise.all([
      db.subscription.count({ where: { packageId } }),
      db.transaction.count({ where: { packageId } }),
      db.entitlement.count({ where: { packageId } }),
    ]);

    if (subCount + txCount + entCount > 0) {
      return {
        success: false,
        error:
          "Paket tidak bisa dihapus karena sudah dipakai langganan/transaksi/entitlement. Nonaktifkan saja paket ini (set tidak aktif).",
      };
    }

    // Cascade menghapus PackageFeature & BundleItem terkait.
    await db.package.delete({ where: { id: packageId } });

    revalidatePath("/dashboard/admin");
    revalidatePath("/");
    revalidatePath("/dashboard/subscription");
    return { success: true, message: "Paket berhasil dihapus." };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// 8. KATALOG FITUR (FEATURES CRUD)
// =============================================================================

/** Normalisasi key fitur: huruf besar, spasi → underscore. */
function normalizeFeatureKey(key) {
  return String(key || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
}

export async function createFeatureAction(data) {
  try {
    await requireSuperAdmin();
    const { key, name, description, type, unit, category, sortOrder, isActive } = data;

    const normalizedKey = normalizeFeatureKey(key);
    if (!normalizedKey || !name) {
      return { success: false, error: "Key dan nama fitur wajib diisi." };
    }

    const exists = await db.feature.findUnique({ where: { key: normalizedKey } });
    if (exists) {
      return { success: false, error: "Fitur dengan key tersebut sudah ada." };
    }

    const created = await db.feature.create({
      data: {
        key: normalizedKey,
        name,
        description: description || null,
        type: FEATURE_TYPES.includes(type) ? type : "BOOLEAN",
        unit: unit || null,
        category: category || null,
        sortOrder: parseInt(sortOrder) || 0,
        isActive: isActive ?? true,
      },
    });

    revalidatePath("/dashboard/admin");
    return { success: true, message: "Fitur baru berhasil ditambahkan.", data: created };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateFeatureAction(featureId, data) {
  try {
    await requireSuperAdmin();
    const { key, name, description, type, unit, category, sortOrder, isActive } = data;

    const normalizedKey = normalizeFeatureKey(key);
    if (!normalizedKey || !name) {
      return { success: false, error: "Key dan nama fitur wajib diisi." };
    }

    // Cek keunikan key — izinkan key sama bila masih milik fitur ini.
    const keyOwner = await db.feature.findUnique({
      where: { key: normalizedKey },
      select: { id: true },
    });
    if (keyOwner && keyOwner.id !== featureId) {
      return { success: false, error: "Key sudah digunakan oleh fitur lain." };
    }

    await db.feature.update({
      where: { id: featureId },
      data: {
        key: normalizedKey,
        name,
        description: description || null,
        type: FEATURE_TYPES.includes(type) ? type : "BOOLEAN",
        unit: unit || null,
        category: category || null,
        sortOrder: parseInt(sortOrder) || 0,
        isActive: isActive ?? true,
      },
    });

    revalidatePath("/dashboard/admin");
    return { success: true, message: "Fitur berhasil diperbarui." };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteFeatureAction(featureId) {
  try {
    await requireSuperAdmin();

    // Cascade menghapus baris PackageFeature yang mereferensikan fitur ini.
    // Snapshot fitur pada entitlement lama (JSON) tidak terpengaruh.
    await db.feature.delete({ where: { id: featureId } });

    revalidatePath("/dashboard/admin");
    return { success: true, message: "Fitur berhasil dihapus." };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// 9. PEMBERIAN ENTITLEMENT MANUAL (ADMIN GRANT)
// =============================================================================
// Mengikat hak akses sebuah paket ke SATU undangan (mis. kompensasi, bonus,
// atau aktivasi manual tanpa pembayaran).

export async function grantEntitlementAction({ invitationSlug, packageId, durationDays }) {
  try {
    await requireSuperAdmin();

    const slug = String(invitationSlug || "").trim();
    if (!slug || !packageId) {
      return { success: false, error: "Slug undangan dan paket wajib diisi." };
    }

    // Cari undangan berdasarkan slug (lebih mudah bagi admin daripada ID).
    const invitation = await db.invitation.findUnique({
      where: { slug },
      select: { id: true, userId: true },
    });
    if (!invitation) {
      return { success: false, error: `Undangan dengan slug "${slug}" tidak ditemukan.` };
    }

    await grantEntitlementFromPackage({
      invitationId: invitation.id,
      ownerUserId: invitation.userId,
      packageId,
      source: "ADMIN",
      durationDays: durationDays ? parseInt(durationDays) : undefined,
    });

    revalidatePath("/dashboard/admin");
    revalidatePath(`/${slug}`);
    return { success: true, message: "Entitlement berhasil diberikan ke undangan." };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
