import "server-only";
import { db } from "@/lib/db";

export async function createInvitation(data) {
  return db.invitation.create({
    data: {
      slug: data.slug,
      userId: data.userId,
      themeId: data.themeId,
      title: data.title,
      brideName: data.brideName,
      groomName: data.groomName,
    },
  });
}

export async function findInvitationsByUserId(userId) {
  return db.invitation.findMany({
    where: { userId },
    include: {
      theme: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function findInvitationBySlug(slug) {
  return db.invitation.findUnique({
    where: { slug },
    include: {
      theme: true,
      events: { orderBy: { sortOrder: "asc" } },
      loveStories: { orderBy: { sortOrder: "asc" } },
      galleries: { orderBy: { sortOrder: "asc" } },
      gifts: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function findInvitationById(id) {
  return db.invitation.findUnique({
    where: { id },
    include: {
      theme: true,
      events: true,
      loveStories: true,
      galleries: true,
      gifts: true,
    },
  });
}

export async function updateInvitation(id, data) {
  return db.invitation.update({
    where: { id },
    data,
  });
}

export async function deleteInvitation(id) {
  return db.invitation.delete({
    where: { id },
  });
}

export async function isSlugTaken(slug) {
  const count = await db.invitation.count({
    where: { slug },
  });
  return count > 0;
}
