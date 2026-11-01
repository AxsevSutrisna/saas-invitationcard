/**
 * E2E / Integration Test — Modul Packet & Bundling Management
 * ===========================================================
 * Menguji alur end-to-end modul langsung ke database (Neon via Prisma):
 * entitlement per-undangan, eceran, refund, bundling, add-on stacking, reseller
 * (kredit & alokasi), serta kuota.
 *
 * SEMUA operasi dibungkus satu transaksi interaktif yang DI-ROLLBACK di akhir
 * (lempar sentinel) → database TIDAK berubah sama sekali (tanpa residu).
 *
 * Catatan cakupan:
 *  - Menguji: skema & relasi DB, constraint, urutan operasi yang persis dipakai
 *    Backend (buat/resolve entitlement, alokasi & habisnya kredit reseller,
 *    revoke refund), integritas seed, dan matematika resolusi fitur.
 *  - TIDAK menguji: Midtrans live, dan rendering FE di browser.
 *  - Helper resolusi fitur di bawah MENCERMINKAN `src/features/entitlement/
 *    featureMap.js` (direplikasi karena modul app memakai import ESM beralias
 *    `@/` + `server-only` yang tak bisa dimuat di skrip Node polos).
 *
 * Jalankan: node -r dotenv/config scripts/e2e-packet-bundling.cjs
 */
const { PrismaClient } = require("../src/generated/prisma");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv").config();

const connectionString = (process.env.DATABASE_URL || "").replace(/^["']|["']$/g, "");
if (!connectionString) {
  console.error("DATABASE_URL is missing!");
  process.exit(1);
}
const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// --- Helper resolusi fitur (mirror featureMap.js) ---------------------------
function buildFeatureMap(packageFeatures = []) {
  const map = {};
  for (const pf of packageFeatures) {
    const key = pf?.feature?.key;
    if (!key) continue;
    if (pf.feature.type === "QUOTA") map[key] = pf.limitValue ?? null;
    else map[key] = !!pf.enabled;
  }
  return map;
}
function mergeFeatureMaps(...maps) {
  const out = {};
  for (const map of maps) {
    if (!map || typeof map !== "object") continue;
    for (const [key, val] of Object.entries(map)) {
      if (typeof val === "boolean") out[key] = out[key] === true || val === true;
      else {
        const cur = out[key];
        if (cur === null || val === null) out[key] = null;
        else out[key] = Math.max(Number(cur) || 0, Number(val) || 0);
      }
    }
  }
  return out;
}
function getQuota(map, key) {
  if (!map || !(key in map)) return 0;
  const v = map[key];
  if (v === null) return Infinity;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

// --- Mini test harness ------------------------------------------------------
const results = [];
function check(name, cond) {
  results.push({ name, ok: !!cond });
  console.log(`  ${cond ? "✅ PASS" : "❌ FAIL"}  ${name}`);
}

const FEAT_INCLUDE = { packageFeatures: { include: { feature: true } } };
const future = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
const now = new Date();

class RollbackSignal extends Error {}

(async () => {
  console.log("E2E Packet & Bundling — mulai (transaksi akan di-rollback)\n");
  try {
    await prisma.$transaction(
      async (tx) => {
        // ---- 0. Integritas seed -------------------------------------------
        const [free, basic, pro, vendor, addon, bundle] = await Promise.all([
          tx.package.findUnique({ where: { slug: "free" }, include: FEAT_INCLUDE }),
          tx.package.findUnique({ where: { slug: "basic" }, include: FEAT_INCLUDE }),
          tx.package.findUnique({ where: { slug: "pro" }, include: FEAT_INCLUDE }),
          tx.package.findUnique({ where: { slug: "vendor" }, include: FEAT_INCLUDE }),
          tx.package.findUnique({ where: { slug: "addon-domain" }, include: FEAT_INCLUDE }),
          tx.package.findUnique({
            where: { slug: "bundle-komplit" },
            include: {
              ...FEAT_INCLUDE,
              bundleItems: { include: { item: { include: FEAT_INCLUDE } } },
            },
          }),
        ]);

        console.log("[Seed]");
        check("6 paket inti ada (free/basic/pro/vendor/addon/bundle)", free && basic && pro && vendor && addon && bundle);
        check("vendor = PLAN/RESELLER + wholesalePrice", vendor?.saleType === "RESELLER" && vendor?.wholesalePrice > 0);
        check("addon = ADDON/ONE_TIME", addon?.kind === "ADDON" && addon?.saleType === "ONE_TIME");
        check("bundle = BUNDLE dengan 2 item", bundle?.kind === "BUNDLE" && bundle?.bundleItems.length === 2);

        // ---- 1. Resolusi fitur paket --------------------------------------
        console.log("\n[Resolusi fitur]");
        const basicMap = buildFeatureMap(basic.packageFeatures);
        check("BASIC → NO_WATERMARK & PREMIUM_THEME", basicMap.NO_WATERMARK === true && basicMap.PREMIUM_THEME === true);
        check("BASIC → MAX_GUESTS unlimited (null)", basicMap.MAX_GUESTS === null);
        const freeMap = buildFeatureMap(free.packageFeatures);
        check("FREE → tanpa NO_WATERMARK", freeMap.NO_WATERMARK !== true);
        check("FREE → MAX_INVITATIONS = 1", getQuota(freeMap, "MAX_INVITATIONS") === 1);

        // ---- 2. Merge BUNDLE ----------------------------------------------
        console.log("\n[Bundle merge]");
        const bundleMap = mergeFeatureMaps(
          buildFeatureMap(bundle.packageFeatures),
          ...bundle.bundleItems.map((bi) => buildFeatureMap(bi.item.packageFeatures))
        );
        check("BUNDLE mewarisi NO_WATERMARK dari BASIC", bundleMap.NO_WATERMARK === true);
        check("BUNDLE mewarisi CUSTOM_DOMAIN dari add-on", bundleMap.CUSTOM_DOMAIN === true);

        // ---- Setup data uji -----------------------------------------------
        const theme = await tx.theme.findFirst({ select: { id: true } });
        if (!theme) throw new Error("Butuh minimal 1 Theme ter-seed untuk membuat undangan uji.");
        const stamp = Date.now();
        const user = await tx.user.create({
          data: { email: `e2e-${stamp}@test.local`, name: "E2E Agency", role: "AGENCY" },
        });
        const inv1 = await tx.invitation.create({
          data: { slug: `e2e-inv1-${stamp}`, userId: user.id, themeId: theme.id, title: "E2E Undangan 1" },
        });
        const inv2 = await tx.invitation.create({
          data: { slug: `e2e-inv2-${stamp}`, userId: user.id, themeId: theme.id, title: "E2E Undangan 2" },
        });

        const resolveInv = async (invId) => {
          const ents = await tx.entitlement.findMany({
            where: { invitationId: invId, status: "ACTIVE", validUntil: { gt: now } },
          });
          return mergeFeatureMaps(...ents.map((e) => e.featuresSnapshot).filter(Boolean));
        };

        // ---- 3. Eceran: beli untuk SATU undangan --------------------------
        console.log("\n[Eceran per-undangan]");
        check("inv1 awalnya BUKAN premium", (await resolveInv(inv1.id)).NO_WATERMARK !== true);
        const txn = await tx.transaction.create({
          data: {
            userId: user.id, packageId: basic.id, invitationId: inv1.id,
            amount: basic.price, quantity: 1, status: "SUCCESS",
            midtransOrderId: `E2E-ECERAN-${stamp}`,
          },
        });
        // (webhook SUCCESS → grantEntitlementFromPackage source PURCHASE)
        await tx.entitlement.create({
          data: {
            invitationId: inv1.id, ownerUserId: user.id, packageId: basic.id,
            source: "PURCHASE", status: "ACTIVE", validUntil: future,
            featuresSnapshot: basicMap, transactionId: txn.id,
          },
        });
        let m1 = await resolveInv(inv1.id);
        check("eceran: inv1 jadi premium (NO_WATERMARK)", m1.NO_WATERMARK === true);
        check("eceran: inv2 TIDAK ikut premium (per-undangan)", (await resolveInv(inv2.id)).NO_WATERMARK !== true);

        // ---- 4. Add-on stacking -------------------------------------------
        console.log("\n[Add-on stacking]");
        check("inv1 belum punya CUSTOM_DOMAIN", m1.CUSTOM_DOMAIN !== true);
        await tx.entitlement.create({
          data: {
            invitationId: inv1.id, ownerUserId: user.id, packageId: addon.id,
            source: "PURCHASE", status: "ACTIVE", validUntil: future,
            featuresSnapshot: buildFeatureMap(addon.packageFeatures),
          },
        });
        m1 = await resolveInv(inv1.id);
        check("add-on menumpuk: inv1 kini NO_WATERMARK + CUSTOM_DOMAIN", m1.NO_WATERMARK === true && m1.CUSTOM_DOMAIN === true);

        // ---- 5. Refund eceran (revoke by transactionId) -------------------
        console.log("\n[Refund eceran]");
        await tx.entitlement.updateMany({
          where: { transactionId: txn.id, status: "ACTIVE" },
          data: { status: "REVOKED" },
        });
        m1 = await resolveInv(inv1.id);
        check("refund: entitlement BASIC dicabut → NO_WATERMARK hilang", m1.NO_WATERMARK !== true);
        check("refund: add-on (transaksi lain) tetap aktif → CUSTOM_DOMAIN ada", m1.CUSTOM_DOMAIN === true);

        // ---- 6. Reseller: kredit & alokasi --------------------------------
        console.log("\n[Reseller]");
        const credit = await tx.resellerCredit.create({
          data: { agencyUserId: user.id, packageId: vendor.id, quantityTotal: 2, quantityUsed: 0 },
        });
        const vendorMap = buildFeatureMap(vendor.packageFeatures);
        const allocate = async (invId) => {
          const batches = await tx.resellerCredit.findMany({
            where: { agencyUserId: user.id, packageId: vendor.id }, orderBy: { createdAt: "asc" },
          });
          const batch = batches.find((b) => b.quantityUsed < b.quantityTotal);
          if (!batch) return false;
          await tx.resellerCredit.update({ where: { id: batch.id }, data: { quantityUsed: { increment: 1 } } });
          await tx.entitlement.create({
            data: {
              invitationId: invId, ownerUserId: user.id, packageId: vendor.id,
              source: "RESELLER", status: "ACTIVE", validUntil: future, featuresSnapshot: vendorMap,
            },
          });
          return true;
        };
        check("alokasi #1 berhasil", (await allocate(inv2.id)) === true);
        check("alokasi #2 berhasil", (await allocate(inv1.id)) === true);
        check("alokasi #3 DITOLAK (kredit habis)", (await allocate(inv2.id)) === false);
        const freshCredit = await tx.resellerCredit.findUnique({ where: { id: credit.id } });
        check("quantityUsed = 2 setelah 2 alokasi", freshCredit.quantityUsed === 2);
        const inv2Ents = await tx.entitlement.findMany({ where: { invitationId: inv2.id, status: "ACTIVE" } });
        check("inv2 mendapat Entitlement(RESELLER)", inv2Ents.some((e) => e.source === "RESELLER"));
        check("reseller: inv2 jadi premium (fitur vendor)", (await resolveInv(inv2.id)).NO_WATERMARK === true);

        // ---- 7. Kuota ------------------------------------------------------
        console.log("\n[Kuota]");
        const used = await tx.invitation.count({ where: { userId: user.id } });
        const limit = getQuota(freeMap, "MAX_INVITATIONS");
        check("user uji punya 2 undangan", used === 2);
        check("kuota FREE (limit 1) < pemakaian (2) → create ke-3 akan diblok", used >= limit);

        // ---- Rollback: tak meninggalkan residu ----------------------------
        throw new RollbackSignal("rollback");
      },
      { timeout: 30000, maxWait: 15000 }
    );
  } catch (e) {
    if (!(e instanceof RollbackSignal)) {
      console.error("\n💥 ERROR saat test:", e.message);
      await prisma.$disconnect().catch(() => {});
      await pool.end().catch(() => {});
      process.exit(1);
    }
  }

  const passed = results.filter((r) => r.ok).length;
  const failed = results.length - passed;
  console.log(`\n================ HASIL: ${passed}/${results.length} PASS, ${failed} FAIL ================`);
  console.log("(Transaksi di-rollback — database tidak berubah.)");

  await prisma.$disconnect().catch(() => {});
  await pool.end().catch(() => {});
  process.exit(failed === 0 ? 0 : 1);
})();
