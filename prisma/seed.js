const { PrismaClient } = require('../src/generated/prisma');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectionString = (process.env.DATABASE_URL || "").replace(/^["']|["']$/g, "");
if (!connectionString) {
  console.error("DATABASE_URL is missing!");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding started...");

  // Seed Features (katalog fitur machine-readable — sumber gating)
  console.log("Seeding Features...");
  const featureDefs = [
    // BOOLEAN
    { key: "NO_WATERMARK", name: "Tanpa Watermark", type: "BOOLEAN", category: "Branding", sortOrder: 1 },
    { key: "PREMIUM_THEME", name: "Akses Tema Premium", type: "BOOLEAN", category: "Tema", sortOrder: 2 },
    { key: "DIGITAL_ENVELOPE", name: "Amplop Digital", type: "BOOLEAN", category: "Hadiah", sortOrder: 3 },
    { key: "RSVP", name: "Konfirmasi Kehadiran (RSVP)", type: "BOOLEAN", category: "Tamu", sortOrder: 4 },
    { key: "QR_CHECKIN", name: "Check-in QR", type: "BOOLEAN", category: "Tamu", sortOrder: 5 },
    { key: "GUEST_BOOK", name: "Buku Tamu & Ucapan", type: "BOOLEAN", category: "Tamu", sortOrder: 6 },
    { key: "LIVE_STREAM", name: "Live Streaming", type: "BOOLEAN", category: "Acara", sortOrder: 7 },
    { key: "BACKGROUND_MUSIC", name: "Musik Latar", type: "BOOLEAN", category: "Media", sortOrder: 8 },
    { key: "LOVE_STORY", name: "Cerita Perjalanan Cinta", type: "BOOLEAN", category: "Konten", sortOrder: 9 },
    { key: "CUSTOM_DOMAIN", name: "Domain Kustom", type: "BOOLEAN", category: "Lanjutan", sortOrder: 10 },
    // QUOTA
    { key: "MAX_INVITATIONS", name: "Jumlah Undangan", type: "QUOTA", unit: "undangan", category: "Kuota", sortOrder: 11 },
    { key: "MAX_GUESTS", name: "Jumlah Tamu", type: "QUOTA", unit: "tamu", category: "Kuota", sortOrder: 12 },
    { key: "MAX_PHOTOS", name: "Jumlah Foto Galeri", type: "QUOTA", unit: "foto", category: "Kuota", sortOrder: 13 },
  ];

  for (const f of featureDefs) {
    await prisma.feature.upsert({
      where: { key: f.key },
      update: f,
      create: f,
    });
  }

  const allFeatures = await prisma.feature.findMany();
  const featureIdByKey = Object.fromEntries(allFeatures.map((f) => [f.key, f.id]));

  // Seed Packages + penugasan fitur (PackageFeature).
  // `features` = bullet marketing (tampilan). `assignments` = gating sebenarnya.
  console.log("Seeding Packages...");
  const packages = [
    {
      name: "FREE",
      slug: "free",
      kind: "PLAN",
      saleType: "ONE_TIME",
      price: 0,
      features: [
        "1 Undangan Aktif",
        "Watermark Platform Aktif",
        "Pilihan Tema Terbatas",
        "Masa Aktif 30 Hari",
      ],
      maxInvitations: 1,
      durationDays: 30,
      sortOrder: 1,
      isActive: true,
      assignments: [
        { key: "MAX_INVITATIONS", limitValue: 1 },
        { key: "MAX_GUESTS", limitValue: 100 },
        { key: "MAX_PHOTOS", limitValue: 8 },
        { key: "BACKGROUND_MUSIC" },
        { key: "RSVP" },
      ],
    },
    {
      name: "BASIC",
      slug: "basic",
      kind: "PLAN",
      saleType: "ONE_TIME",
      price: 99000,
      features: [
        "1 Undangan Premium",
        "Tanpa Watermark",
        "Semua Pilihan Tema",
        "Fitur Amplop Digital",
        "Masa Aktif 180 Hari",
      ],
      maxInvitations: 1,
      durationDays: 180,
      sortOrder: 2,
      isActive: true,
      assignments: [
        { key: "NO_WATERMARK" },
        { key: "PREMIUM_THEME" },
        { key: "DIGITAL_ENVELOPE" },
        { key: "BACKGROUND_MUSIC" },
        { key: "LOVE_STORY" },
        { key: "RSVP" },
        { key: "MAX_INVITATIONS", limitValue: 1 },
        { key: "MAX_GUESTS", limitValue: null }, // unlimited
        { key: "MAX_PHOTOS", limitValue: 20 },
      ],
    },
    {
      name: "PRO",
      slug: "pro",
      kind: "PLAN",
      saleType: "SUBSCRIPTION",
      price: 199000,
      features: [
        "Hingga 10 Undangan Aktif/Bulan",
        "Tanpa Watermark",
        "Semua Pilihan Tema",
        "Fitur Amplop Digital",
        "Fitur RSVP & QR Check-in",
        "Masa Aktif 30 Hari (Berlangganan)",
      ],
      maxInvitations: 10,
      durationDays: 30,
      sortOrder: 3,
      isActive: true,
      assignments: [
        { key: "NO_WATERMARK" },
        { key: "PREMIUM_THEME" },
        { key: "DIGITAL_ENVELOPE" },
        { key: "BACKGROUND_MUSIC" },
        { key: "LOVE_STORY" },
        { key: "RSVP" },
        { key: "QR_CHECKIN" },
        { key: "GUEST_BOOK" },
        { key: "LIVE_STREAM" },
        { key: "MAX_INVITATIONS", limitValue: 10 },
        { key: "MAX_GUESTS", limitValue: null }, // unlimited
        { key: "MAX_PHOTOS", limitValue: null }, // unlimited
      ],
    },
    {
      // Add-on: dijual terpisah, menumpuk di atas paket undangan.
      name: "Add-on Domain Kustom",
      slug: "addon-domain",
      kind: "ADDON",
      saleType: "ONE_TIME",
      price: 50000,
      features: ["Domain kustom untuk undangan Anda"],
      maxInvitations: 1,
      durationDays: 365,
      sortOrder: 5,
      isActive: true,
      assignments: [{ key: "CUSTOM_DOMAIN" }],
    },
    {
      // Bundle: fitur diturunkan dari item (BASIC + Add-on Domain) saat gating.
      name: "Paket Komplit",
      slug: "bundle-komplit",
      kind: "BUNDLE",
      saleType: "ONE_TIME",
      price: 129000, // hemat vs beli terpisah (99rb + 50rb)
      features: ["Semua fitur BASIC", "+ Domain Kustom", "Lebih hemat dari beli terpisah"],
      maxInvitations: 1,
      durationDays: 180,
      sortOrder: 6,
      isActive: true,
      assignments: [],
      bundleSlugs: ["basic", "addon-domain"],
    },
    {
      // Paket reseller: dibeli AGENCY sebagai kredit (harga grosir).
      name: "Vendor Pack",
      slug: "vendor",
      kind: "PLAN",
      saleType: "RESELLER",
      price: 150000, // acuan harga eceran
      wholesalePrice: 99000, // harga grosir per lisensi
      features: [
        "Lisensi undangan premium",
        "Tanpa watermark",
        "Semua tema premium",
        "RSVP & QR Check-in",
        "Masa aktif 1 tahun",
      ],
      maxInvitations: 1,
      durationDays: 365,
      sortOrder: 4,
      isActive: true,
      assignments: [
        { key: "NO_WATERMARK" },
        { key: "PREMIUM_THEME" },
        { key: "DIGITAL_ENVELOPE" },
        { key: "BACKGROUND_MUSIC" },
        { key: "LOVE_STORY" },
        { key: "RSVP" },
        { key: "QR_CHECKIN" },
        { key: "GUEST_BOOK" },
        { key: "MAX_INVITATIONS", limitValue: 1 },
        { key: "MAX_GUESTS", limitValue: null },
        { key: "MAX_PHOTOS", limitValue: null },
      ],
    },
  ];

  const savedBySlug = {};
  for (const { assignments, bundleSlugs, ...pkg } of packages) {
    const saved = await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    });
    savedBySlug[pkg.slug] = { id: saved.id, bundleSlugs };

    // Set ulang penugasan fitur agar seed idempotent.
    await prisma.packageFeature.deleteMany({ where: { packageId: saved.id } });
    const rows = (assignments || [])
      .filter((a) => featureIdByKey[a.key])
      .map((a) => ({
        packageId: saved.id,
        featureId: featureIdByKey[a.key],
        enabled: a.enabled ?? true,
        limitValue: a.limitValue ?? null,
      }));
    if (rows.length) {
      await prisma.packageFeature.createMany({ data: rows });
    }
  }

  // Rangkai isi BUNDLE (setelah semua paket ada) — idempotent.
  for (const { id, bundleSlugs } of Object.values(savedBySlug)) {
    if (!bundleSlugs?.length) continue;
    await prisma.bundleItem.deleteMany({ where: { bundleId: id } });
    const items = bundleSlugs
      .map((s) => savedBySlug[s]?.id)
      .filter(Boolean)
      .map((itemId) => ({ bundleId: id, itemId, quantity: 1 }));
    if (items.length) {
      await prisma.bundleItem.createMany({ data: items });
    }
  }

  // Seed Themes
  console.log("Seeding Themes...");
  const themes = [
    {
      name: "Classic Elegance",
      slug: "classic-elegance",
      description: "Desain undangan klasik dengan nuansa warna emas dan putih gading, sangat elegan.",
      category: "Elegant",
      thumbnailUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
      isPremium: false,
      isActive: true,
      sortOrder: 1,
    },
    {
      name: "Floral Blossom",
      slug: "floral-blossom",
      description: "Tema bunga-bunga romantis dengan animasi kelopak berguguran yang memikat.",
      category: "Floral",
      thumbnailUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
      isPremium: true,
      isActive: true,
      sortOrder: 2,
    },
    {
      name: "Modern Minimalist",
      slug: "modern-minimalist",
      description: "Tampilan bersih dan kontemporer untuk pasangan modern.",
      category: "Minimalist",
      thumbnailUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
      isPremium: true,
      isActive: true,
      sortOrder: 3,
    },
    {
      name: "Floral Blue",
      slug: "floral-blue",
      description: "Desain dedaunan biru anggun berpalet biru es dan navy yang tenang.",
      category: "Blue",
      thumbnailUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80",
      isPremium: true,
      isActive: true,
      sortOrder: 4,
    },
    {
      name: "Nature Harmony",
      slug: "nature-harmony",
      description: "Nuansa alam hijau hutan dan earth tone dengan animasi zoom in/out yang menenangkan.",
      category: "Nature",
      thumbnailUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
      isPremium: true,
      isActive: true,
      sortOrder: 5,
    }
  ];

  for (const theme of themes) {
    await prisma.theme.upsert({
      where: { slug: theme.slug },
      update: theme,
      create: theme,
    });
  }

  // Seed Super Admin (idempotent, akun berkredensial email+password).
  // Kredensial default bisa dioverride lewat env (SUPER_ADMIN_EMAIL/PASSWORD/NAME).
  // CATATAN: password diset ulang setiap kali seed dijalankan agar kredensial
  // default selalu valid — ganti password dari halaman Pengaturan setelah login
  // jika ingin kata sandi permanen yang tidak ter-reset oleh seeder.
  console.log("Seeding Super Admin...");
  const ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "ikaraadmin@gmail.com";
  const ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || "ikara2026!";
  const ADMIN_NAME = process.env.SUPER_ADMIN_NAME || "IKARA Super Admin";
  const hashedAdminPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "SUPER_ADMIN", password: hashedAdminPassword, name: ADMIN_NAME },
    create: {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      password: hashedAdminPassword,
      role: "SUPER_ADMIN",
    },
  });
  console.log(`Super Admin siap: ${ADMIN_EMAIL}`);

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
