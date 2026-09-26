import "server-only";
import { db } from "@/lib/db";

/**
 * Repository - Invitation Data Access Layer
 * Mengelola transaksi database PostgreSQL via Prisma ORM.
 */

// Bentuk relasi undangan yang dipakai berulang di beberapa query
const invitationRelations = {
  theme: true,
  events: true,
  loveStories: true,
  galleries: true,
  gifts: true,
};

// Versi terurut (untuk tampilan publik)
const invitationRelationsOrdered = {
  theme: true,
  events: { orderBy: { sortOrder: "asc" } },
  loveStories: { orderBy: { sortOrder: "asc" } },
  galleries: { orderBy: { sortOrder: "asc" } },
  gifts: { orderBy: { sortOrder: "asc" } },
};

/**
 * Membuat record undangan baru beserta relasi Events, LoveStories, Galleries, dan Gifts secara atomic
 */
export async function createInvitation(userId, data) {
  const { isPublished = true } = data;

  // Pakai builder bersama (buildInvitationWriteData) agar konsisten dengan
  // updateInvitation — termasuk pemetaan gift.qrCodeUrl.
  return db.invitation.create({
    data: {
      userId,
      ...buildInvitationWriteData(data),
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
    include: invitationRelations,
  });
}

/**
 * Mengambil semua undangan milik pengguna aktif
 */
export async function getInvitationsByUserId(userId) {
  return db.invitation.findMany({
    where: { userId },
    include: {
      ...invitationRelations,
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
 * Ringkasan undangan milik user (id + judul saja) — untuk dropdown/pemilih
 * pada halaman analytics, tanpa memuat relasi berat.
 */
export async function getInvitationSummariesByUserId(userId) {
  return db.invitation.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Detail satu undangan untuk analytics (owner-scoped): hanya field yang dipakai
 * halaman — tanggal acara (untuk hitung hari) + jumlah tamu/rsvp/kunjungan.
 */
export async function getInvitationAnalytics(id, userId) {
  return db.invitation.findFirst({
    where: { id, userId },
    select: {
      id: true,
      title: true,
      events: { select: { date: true }, orderBy: { date: "asc" } },
      _count: { select: { guests: true, rsvps: true, visitorLogs: true } },
    },
  });
}

/**
 * Mengambil detail undangan secara publik berdasarkan slug URL
 */
export async function getInvitationBySlug(slug) {
  return db.invitation.findUnique({
    where: { slug },
    include: invitationRelationsOrdered,
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
 * Mengambil identitas kepemilikan undangan (ringan) untuk cek otorisasi.
 * Hanya memuat field yang dibutuhkan oleh `can()`.
 * @param {string} invitationId
 * @returns {Promise<{ id: string, userId: string } | null>}
 */
export async function getInvitationOwner(invitationId) {
  return db.invitation.findUnique({
    where: { id: invitationId },
    select: { id: true, userId: true },
  });
}

/**
 * Mengambil seluruh URL media milik sebuah undangan (cover, foto mempelai,
 * musik, galeri, foto cerita) — dipakai untuk pembersihan objek R2 yatim
 * saat undangan diperbarui/dihapus.
 * @param {string} invitationId
 */
export async function getInvitationMediaUrls(invitationId) {
  return db.invitation.findUnique({
    where: { id: invitationId },
    select: {
      coverUrl: true,
      groomPhotoUrl: true,
      bridePhotoUrl: true,
      musicUrl: true,
      galleries: { select: { mediaUrl: true, thumbnailUrl: true } },
      loveStories: { select: { imageUrl: true } },
      gifts: { select: { qrCodeUrl: true } },
    },
  });
}

/**
 * Mengambil undangan lengkap milik pengguna untuk keperluan EDIT (prefill form).
 * Dibatasi ke pemilik (userId) agar tidak bisa mengedit undangan orang lain.
 * @param {string} id
 * @param {string} userId
 */
export async function getInvitationForEdit(id, userId) {
  return db.invitation.findFirst({
    where: { id, userId },
    include: {
      events: { orderBy: { sortOrder: "asc" } },
      loveStories: { orderBy: { sortOrder: "asc" } },
      galleries: { orderBy: { sortOrder: "asc" } },
      gifts: { orderBy: { sortOrder: "asc" } },
    },
  });
}

// Membangun objek data scalar + nested-create Prisma dari payload form.
// Dipakai bersama oleh create & update agar konsisten (DRY).
function buildInvitationWriteData(data) {
  const {
    title,
    themeId,
    slug,
    groomNickname,
    groomFullName,
    groomFather,
    groomMother,
    groomPhotoUrl,
    brideNickname,
    brideFullName,
    brideFather,
    brideMother,
    bridePhotoUrl,
    groomName,
    brideName,
    coverUrl,
    galleryLayout = "CAROUSEL",
    quotes,
    openingText,
    physicalGiftAddress,
    physicalGiftReceiver,
    physicalGiftPhone,
    musicUrl,
    musicTitle,
    isMusicEnabled = true,
    events = [],
    loveStories = [],
    galleries = [],
    gifts = [],
  } = data;

  const finalGroomNickname = groomNickname || groomName || "William";
  const finalGroomFullName = groomFullName || groomName || "William Jonathan";
  const finalBrideNickname = brideNickname || brideName || "Eleanor";
  const finalBrideFullName = brideFullName || brideName || "Eleanor Grace";

  return {
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
        qrCodeUrl: gft.qrCodeUrl || null,
        note: gft.note || null,
        sortOrder: idx,
      })),
    },
  };
}

/**
 * Memperbarui undangan milik pengguna secara transaksional.
 * Strategi: update field scalar, lalu HAPUS & buat ulang seluruh child
 * (events/loveStories/galleries/gifts) dari payload agar konsisten dengan
 * urutan & isi form. Tamu (Guest) & RSVP TIDAK disentuh.
 * @param {string} id
 * @param {string} userId - pemilik (untuk pembatasan akses)
 * @param {object} data - payload form tervalidasi
 */
export async function updateInvitation(id, userId, data) {
  const writeData = buildInvitationWriteData(data);
  const { isPublished = true } = data;

  return db.$transaction(async (tx) => {
    // Pastikan undangan ada & milik pengguna ini
    const existing = await tx.invitation.findFirst({
      where: { id, userId },
      select: { id: true, isPublished: true, publishedAt: true },
    });
    if (!existing) {
      throw new Error("Undangan tidak ditemukan atau bukan milik Anda.");
    }

    // Ganti seluruh child records
    await tx.event.deleteMany({ where: { invitationId: id } });
    await tx.loveStory.deleteMany({ where: { invitationId: id } });
    await tx.gallery.deleteMany({ where: { invitationId: id } });
    await tx.gift.deleteMany({ where: { invitationId: id } });

    // publishedAt di-set saat pertama kali dipublikasikan; dipertahankan sesudahnya
    const publishedAt = isPublished
      ? existing.publishedAt ?? new Date()
      : null;

    return tx.invitation.update({
      where: { id },
      data: { ...writeData, isPublished, publishedAt },
      include: invitationRelations,
    });
  });
}

/**
 * Mengambil status publikasi undangan (ringan) untuk validasi endpoint publik
 * (RSVP, log kunjungan). Mengembalikan null bila undangan tidak ada.
 * @param {string} invitationId
 * @returns {Promise<{ id: string, isPublished: boolean } | null>}
 */
export async function getInvitationPublishStatus(invitationId) {
  return db.invitation.findUnique({
    where: { id: invitationId },
    select: { id: true, isPublished: true },
  });
}

/**
 * Menghapus record undangan berdasarkan ID dan milik pengguna
 */
export async function deleteInvitation(id, userId) {
  return db.invitation.deleteMany({
    where: { id, userId },
  });
}
