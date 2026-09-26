/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Nilai quality yang boleh dipakai <Image> (Next.js 16 mewajibkan didaftarkan).
    // 72 dipakai HeroSection; 75 adalah default Next.
    qualities: [72, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
    ],
  },
};

export default nextConfig;
