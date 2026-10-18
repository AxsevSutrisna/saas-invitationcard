import "server-only";
import { db } from "@/lib/db";
import { findActiveSubscriptionByUserId } from "@/features/subscription/repository";
import {
  findActiveEntitlementsByInvitationId,
  findPackageWithFeatures,
  createEntitlement,
} from "@/features/entitlement/repository";
import {
  buildFeatureMap,
  freeFeatureMap,
  getQuota,
  mergeFeatureMaps,
} from "@/features/entitlement/featureMap";
import { FEATURE_KEYS } from "@/features/entitlement/constants";

/**
 * Service - Orkestrasi entitlement.
 *
 * Dua sisi:
 *   1. BACA  → resolve "undangan ini boleh fitur apa" (gating per-undangan).
 *   2. TULIS → lahirkan entitlement dari langganan / pemberian manual.
 *
 * Sumber kebenaran gating adalah Entitlement yang menempel pada undangan.
 * Untuk undangan lama (dibuat sebelum sistem entitlement) kita fallback ke
 * langganan aktif milik pemilik — TANPA menulis, agar jalur baca tetap murni.
 */

/**
 * Peta fitur dari paket yang SUDAH di-fetch (via findPackageWithFeatures).
 * Untuk paket BUNDLE, fitur paket digabung dengan fitur seluruh item.
 * Dipisah agar pemanggil yang sudah memegang objek paket tak perlu query ulang.
 */
export function featureMapFromPackage(pkg) {
  if (!pkg) return freeFeatureMap();

  const own = buildFeatureMap(pkg.packageFeatures);

  let map = own;
  if (pkg.kind === "BUNDLE" && pkg.bundleItems?.length) {
    const itemMaps = pkg.bundleItems.map((bi) =>
      buildFeatureMap(bi.item?.packageFeatures || [])
    );
    map = mergeFeatureMaps(own, ...itemMaps);
  }

  return Object.keys(map).length ? map : freeFeatureMap();
}

/** Peta fitur sebuah paket berdasarkan id (fetch + resolve). Fallback FREE bila kosong. */
export async function getPackageFeatureMap(packageId) {
  return featureMapFromPackage(await findPackageWithFeatures(packageId));
}

/**
 * Peta fitur efektif untuk SATU undangan (gating per-undangan).
 * Urutan resolusi:
 *   1. Entitlement AKTIF pada undangan → pakai featuresSnapshot-nya.
 *   2. Langganan AKTIF milik pemilik   → pakai fitur paketnya (fallback, tak disimpan).
 *   3. FREE default.
 * @param {{ id: string, userId: string }} invitation
 */
export async function getFeaturesForInvitation(invitation) {
  if (!invitation?.id) return freeFeatureMap();

  // Gabungkan SELURUH entitlement aktif (paket dasar + add-on bertumpuk).
  const entitlements = await findActiveEntitlementsByInvitationId(invitation.id);
  if (entitlements.length) {
    const snapshots = entitlements
      .map((e) => e.featuresSnapshot)
      .filter((s) => s && typeof s === "object");
    if (snapshots.length) return mergeFeatureMaps(...snapshots);
  }

  // Fallback undangan lama: turunkan dari langganan aktif pemilik (read-only).
  if (invitation.userId) {
    const sub = await findActiveSubscriptionByUserId(invitation.userId);
    if (sub?.packageId) {
      return getPackageFeatureMap(sub.packageId);
    }
  }

  return freeFeatureMap();
}

/**
 * Peta fitur yang BISA DIBERIKAN ke user saat ini (belum terikat undangan) —
 * dipakai untuk gating di saat membuat/mengedit undangan (mis. akses tema
 * premium) dan untuk menghitung kuota. Diturunkan dari langganan aktif.
 * @param {string} userId
 * @returns {Promise<{ map: Record<string, any>, subscription: object|null }>}
 */
export async function getGrantableFeaturesForUser(userId) {
  const sub = await findActiveSubscriptionByUserId(userId);
  if (sub?.packageId) {
    return { map: await getPackageFeatureMap(sub.packageId), subscription: sub };
  }
  return { map: freeFeatureMap(), subscription: null };
}

/**
 * Cek kuota pembuatan undangan untuk user.
 * Menghitung undangan yang sudah dimiliki vs MAX_INVITATIONS pada peta fiturnya.
 * @param {string} userId
 * @param {Record<string, any>} featureMap
 * @returns {Promise<{ allowed: boolean, used: number, limit: number }>}
 */
export async function checkInvitationQuota(userId, featureMap) {
  const limit = getQuota(featureMap, FEATURE_KEYS.MAX_INVITATIONS);
  const used = await db.invitation.count({ where: { userId } });
  return { allowed: used < limit, used, limit };
}

/**
 * Lahirkan entitlement SUBSCRIPTION untuk sebuah undangan dari langganan aktif.
 * Dipanggil saat undangan dibuat di bawah langganan aktif, agar hak akses
 * terikat ke undangan tersebut (bukan sekadar per-user). No-op → null bila
 * tidak ada langganan aktif.
 * `featuresSnapshot` opsional: bila pemanggil sudah menghitung peta fitur paket
 * (mis. `getGrantableFeaturesForUser`), oper di sini agar tak query ulang paket.
 * @param {{ invitationId: string, userId: string, subscription: object, featuresSnapshot?: object }} params
 */
export async function mintEntitlementFromSubscription({ invitationId, userId, subscription, featuresSnapshot }) {
  if (!subscription?.id || !subscription.packageId) return null;

  const snapshot = featuresSnapshot ?? (await getPackageFeatureMap(subscription.packageId));

  return createEntitlement({
    invitationId,
    ownerUserId: userId,
    packageId: subscription.packageId,
    source: "SUBSCRIPTION",
    status: "ACTIVE",
    validUntil: subscription.validUntil,
    featuresSnapshot: snapshot,
    subscriptionId: subscription.id,
  });
}

/**
 * Berikan entitlement ke undangan dari sebuah paket (dipakai pembelian eceran,
 * alokasi reseller, atau pemberian manual admin).
 * @param {{ invitationId: string, ownerUserId: string, packageId: string,
 *   source?: string, durationDays?: number, transactionId?: string }} params
 */
export async function grantEntitlementFromPackage({
  invitationId,
  ownerUserId,
  packageId,
  source = "ADMIN",
  durationDays,
  transactionId,
}) {
  const pkg = await findPackageWithFeatures(packageId);
  if (!pkg) throw new Error("Paket tidak ditemukan.");

  const days = durationDays ?? pkg.durationDays ?? 180;
  const validUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  // Bundle-aware: ikut gabung fitur item bila paket adalah BUNDLE.
  const featuresSnapshot = featureMapFromPackage(pkg);

  return createEntitlement({
    invitationId,
    ownerUserId,
    packageId,
    source,
    status: "ACTIVE",
    validUntil,
    featuresSnapshot,
    ...(transactionId ? { transactionId } : {}),
  });
}
