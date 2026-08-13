const { PrismaClient } = require('../src/generated/prisma');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
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

  // Seed Packages
  console.log("Seeding Packages...");
  const packages = [
    {
      name: "FREE",
      slug: "free",
      type: "ONE_TIME",
      price: 0,
      features: [
        "1 Undangan Aktif",
        "Watermark Platform Aktif",
        "Pilihan Tema Terbatas",
        "Masa Aktif 30 Hari"
      ],
      maxInvitations: 1,
      durationDays: 30,
      isActive: true,
    },
    {
      name: "BASIC",
      slug: "basic",
      type: "ONE_TIME",
      price: 99000,
      features: [
        "1 Undangan Premium",
        "Tanpa Watermark",
        "Semua Pilihan Tema",
        "Fitur Amplop Digital",
        "Masa Aktif 180 Hari"
      ],
      maxInvitations: 1,
      durationDays: 180,
      isActive: true,
    },
    {
      name: "PRO",
      slug: "pro",
      type: "RECURRING",
      price: 199000,
      features: [
        "Hingga 10 Undangan Aktif/Bulan",
        "Tanpa Watermark",
        "Semua Pilihan Tema",
        "Fitur Amplop Digital",
        "Fitur RSVP & QR Check-in",
        "Masa Aktif 30 Hari (Berlangganan)"
      ],
      maxInvitations: 10,
      durationDays: 30,
      isActive: true,
    }
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    });
  }

  // Seed Themes
  console.log("Seeding Themes...");
  const themes = [
    {
      name: "Classic Elegance",
      slug: "classic-elegance",
      description: "Desain undangan klasik dengan nuansa warna emas dan putih gading, sangat elegan.",
      thumbnailUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
      isPremium: false,
      isActive: true,
      sortOrder: 1,
    },
    {
      name: "Floral Blossom",
      slug: "floral-blossom",
      description: "Tema bunga-bunga romantis dengan animasi kelopak berguguran yang memikat.",
      thumbnailUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
      isPremium: true,
      isActive: true,
      sortOrder: 2,
    },
    {
      name: "Modern Minimalist",
      slug: "modern-minimalist",
      description: "Tampilan bersih dan kontemporer untuk pasangan modern.",
      thumbnailUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
      isPremium: true,
      isActive: true,
      sortOrder: 3,
    },
    {
      name: "Floral Blue",
      slug: "floral-blue",
      description: "Desain dedaunan biru anggun berpalet biru es dan navy yang tenang.",
      thumbnailUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80",
      isPremium: true,
      isActive: true,
      sortOrder: 4,
    },
    {
      name: "Nature Harmony",
      slug: "nature-harmony",
      description: "Nuansa alam hijau hutan dan earth tone dengan animasi zoom in/out yang menenangkan.",
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
