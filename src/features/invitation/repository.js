import "server-only";
import { db } from "@/lib/db";

/**
 * Repository - Invitation Data Access Layer
 * Mengelola transaksi database PostgreSQL via Prisma ORM.
 */

/**
 * Membuat record undangan baru beserta relasi Events, LoveStories, Galleries, dan Gifts secara atomic
 */
export async function createInvitation(userId, data) {
  const {
    title,
    slug,
    themeId,
    // Pasangan Pria
    groomNickname,
    groomFullName,
    groomFather,
    groomMother,
    groomPhotoUrl,
    // Pasangan Wanita
    brideNickname,
    brideFullName,
    brideFather,
    brideMother,
    bridePhotoUrl,
    // Fallback names
    groomName,
    brideName,
    // Media & Layout
    coverUrl,
    galleryLayout = "CAROUSEL",
    quotes,
    openingText,
    // Kado Fisik
    physicalGiftAddress,
    physicalGiftReceiver,
    physicalGiftPhone,
    // Musik Latar
    musicUrl,
    musicTitle,
    isMusicEnabled = true,
    // Arrays
    events = [],
    loveStories = [],
    galleries = [],
    gifts = [],
    isPublished = true,
  } = data;

  const finalGroomNickname = groomNickname || groomName || "William";
  const finalGroomFullName = groomFullName || groomName || "William Jonathan";
  const finalBrideNickname = brideNickname || brideName || "Eleanor";
  const finalBrideFullName = brideFullName || brideName || "Eleanor Grace";

  return db.invitation.create({
    data: {
      userId,
      themeId,
      slug,
      title: title || `Pernikahan ${finalGroomNickname} & ${finalBrideNickname}`,
      groomNickname: finalGroomNickname,
      groomFullName: finalGroomFullName,
      groomFather: groomFather || null,
      groomMother: groomMother || null,
      groomPhotoUrl: groomPhotoUrl || null,
      brideNickname: finalBrideNickname,
      brideFullName: finalBrideFullName,
      brideFather: brideFather || null,
      brideMother: brideMother || null,
      bridePhotoUrl: bridePhotoUrl || null,
      groomName: finalGroomNickname,
      brideName: finalBrideNickname,
      coverUrl: coverUrl || null,
      galleryLayout: galleryLayout || "CAROUSEL",
      quotes: quotes || null,
      openingText: openingText || null,
      physicalGiftAddress: physicalGiftAddress || null,
      physicalGiftReceiver: physicalGiftReceiver || null,
      physicalGiftPhone: physicalGiftPhone || null,
      musicUrl: musicUrl || null,
      musicTitle: musicTitle || null,
      isMusicEnabled: isMusicEnabled ?? true,
      isPublished,
      publishedAt: isPublished ? new Date() : null,

      // Nested Creates
      events: {
        create: events.map((evt, idx) => ({
          name: evt.name,
          date: new Date(evt.date),
          startTime: evt.startTime,
          endTime: evt.endTime || null,
          locationName: evt.locationName,
          address: evt.address,
          mapUrl: evt.mapUrl || null,
          sortOrder: idx,
        })),
      },

      loveStories: {
        create: loveStories.map((story, idx) => ({
          title: story.title,
          date: story.date || null,
          description: story.description,
          imageUrl: story.imageUrl || null,
          sortOrder: idx,
        })),
      },

      galleries: {
        create: galleries.map((gal, idx) => ({
          mediaUrl: gal.mediaUrl,
          thumbnailUrl: gal.thumbnailUrl || null,
          type: gal.type || "PHOTO",
          caption: gal.caption || null,
          sortOrder: idx,
        })),
      },

      gifts: {
        create: gifts.map((gft, idx) => ({
          type: gft.type || "BANK",
          providerName: gft.providerName,
          accountName: gft.accountName,
          accountNumber: gft.accountNumber || null,
          note: gft.note || null,
          sortOrder: idx,
        })),
      },
    },
    include: {
      theme: true,
      events: true,
      loveStories: true,
      galleries: true,
      gifts: true,
    },
  });
}

/**
 * Mengambil semua undangan milik pengguna aktif
 */
export async function getInvitationsByUserId(userId) {
  return db.invitation.findMany({
    where: { userId },
    include: {
      theme: true,
      events: true,
      loveStories: true,
      galleries: true,
      gifts: true,
      _count: {
        select: {
          guests: true,
          rsvps: true,
          visitorLogs: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Mengambil detail 1 undangan berdasarkan ID dan milik pengguna
 */
export async function getInvitationById(id, userId) {
  return db.invitation.findFirst({
    where: { id, userId },
    include: {
      theme: true,
      events: true,
      loveStories: true,
      galleries: true,
      gifts: true,
    },
  });
}

/**
 * Mengambil detail undangan secara publik berdasarkan slug URL
 */
export async function getInvitationBySlug(slug) {
  return db.invitation.findUnique({
    where: { slug },
    include: {
      theme: true,
      events: {
        orderBy: { sortOrder: "asc" },
      },
      loveStories: {
        orderBy: { sortOrder: "asc" },
      },
      galleries: {
        orderBy: { sortOrder: "asc" },
      },
      gifts: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

/**
 * Memeriksa apakah slug URL publik sudah pernah digunakan
 */
export async function checkSlugAvailability(slug) {
  const existing = await db.invitation.findUnique({
    where: { slug },
  });
  return !existing;
}

/**
 * Menghapus record undangan berdasarkan ID dan milik pengguna
 */
export async function deleteInvitation(id, userId) {
  return db.invitation.deleteMany({
    where: { id, userId },
  });
}
