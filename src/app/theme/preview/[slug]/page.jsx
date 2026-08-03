import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PublicInvitationClient } from "@/features/theme/components/PublicInvitationClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const theme = await db.theme.findUnique({
    where: { slug },
  });

  if (!theme) {
    return { title: "Tema Tidak Ditemukan - IKARA" };
  }

  return {
    title: `Preview Tema: ${theme.name} — IKARA`,
    description: `Lihat preview desain tema pernikahan digital ${theme.name} dari IKARA.`,
  };
}

export default async function ThemePreviewPage({ params }) {
  const { slug } = await params;

  // 1. Ambil info tema dari database untuk memvalidasi
  const theme = await db.theme.findUnique({
    where: { slug },
  });

  if (!theme) {
    notFound();
  }

  // 2. Buat Mock Data Undangan untuk Preview Estetik
  const mockInvitation = {
    id: "mock-invitation-id",
    title: `Pernikahan Budi & Rini`,
    slug: `preview-${slug}`,
    groomNickname: "Budi",
    groomFullName: "Budi Santoso",
    groomFather: "Bp. Bambang Santoso",
    groomMother: "Ibu Siti Aminah",
    groomPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    brideNickname: "Rini",
    brideFullName: "Rini Handayani",
    brideFather: "Bp. Gunawan Handayani",
    brideMother: "Ibu Hartati",
    bridePhotoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    coverUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
    galleryLayout: "CAROUSEL",
    quotes: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
    openingText: "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.",
    physicalGiftAddress: "Jl. Mawar No. 12, Menteng, Jakarta Pusat",
    physicalGiftReceiver: "Budi & Rini",
    physicalGiftPhone: "081234567890",
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    musicTitle: "Beautiful In White",
    isMusicEnabled: true,
    isPublished: true,
    theme: {
      id: theme.id,
      name: theme.name,
      slug: theme.slug,
      isPremium: theme.isPremium,
    },
    events: [
      {
        id: "evt-1",
        name: "Akad Nikah",
        date: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: "09:00",
        endTime: "10:30",
        locationName: "Masjid Agung Sunda Kelapa",
        address: "Jl. Taman Sunda Kelapa No. 16, Menteng, Jakarta Pusat",
        mapUrl: "https://maps.google.com",
      },
      {
        id: "evt-2",
        name: "Resepsi Pernikahan",
        date: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: "11:00",
        endTime: "13:00",
        locationName: "Gedung Serbaguna Jakarta",
        address: "Jl. Jenderal Sudirman Kav. 21, Jakarta Selatan",
        mapUrl: "https://maps.google.com",
      },
    ],
    loveStories: [
      {
        id: "love-1",
        title: "Pertama Bertemu",
        date: "2024-01-15",
        description: "Kami pertama kali dipertemukan di sebuah perpustakaan kota saat sama-sama mencari buku referensi. Pandangan pertama yang tak terduga berubah menjadi perbincangan hangat di kedai kopi terdekat.",
        imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600",
      },
      {
        id: "love-2",
        title: "Menjalin Komitmen",
        date: "2025-06-20",
        description: "Setelah satu tahun saling mengenal sifat satu sama lain, kami memutuskan untuk berkomitmen serius dan melangkah ke arah masa depan bersama dalam ikatan suci pernikahan.",
        imageUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600",
      },
    ],
    galleries: [
      {
        id: "gal-1",
        mediaUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600",
        thumbnailUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600",
        type: "PHOTO",
        caption: "Prewedding Session 1",
      },
      {
        id: "gal-2",
        mediaUrl: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=600",
        thumbnailUrl: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=600",
        type: "PHOTO",
        caption: "Prewedding Session 2",
      },
    ],
    gifts: [
      {
        id: "gift-1",
        type: "BANK",
        providerName: "Bank Central Asia (BCA)",
        accountName: "Budi Santoso",
        accountNumber: "1234567890",
        note: "Silakan konfirmasi setelah melakukan transfer.",
      },
      {
        id: "gift-2",
        type: "BANK",
        providerName: "Bank Mandiri",
        accountName: "Rini Handayani",
        accountNumber: "0987654321",
        note: "Kado digital Anda sangat berarti bagi kami.",
      },
    ],
  };

  // 3. Mock RSVP List untuk area buku tamu
  const mockRsvps = [
    {
      id: "rsvp-mock-1",
      name: "Ahmad Dahlan",
      attendance: "YES",
      pax: 2,
      message: "Selamat ya Budi & Rini! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Amin!",
      createdAt: new Date().toISOString(),
    },
    {
      id: "rsvp-mock-2",
      name: "Siti Rahma",
      attendance: "MAYBE",
      pax: 1,
      message: "Insya Allah datang kalau tidak ada halangan mendadak. Selamat berbahagia!",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  return (
    <PublicInvitationClient
      invitation={mockInvitation}
      initialRsvps={mockRsvps}
      guestName="Tamu Undangan"
      guestCode=""
      isPremium={true} // Selalu tampil premium di halaman preview agar visualnya maksimal
    />
  );
}
