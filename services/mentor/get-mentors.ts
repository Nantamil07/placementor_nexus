import { prisma } from "@/lib/prisma";

export async function getMentors(search?: string) {
  const q = search?.trim();
  return prisma.profile.findMany({
    where: {
      role: "MENTOR",
      isSuspended: false,
      ...(q
        ? {
            OR: [
              { fullName: { contains: q, mode: "insensitive" } },
              { username: { contains: q, mode: "insensitive" } },
              { headline: { contains: q, mode: "insensitive" } },
              { bio: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      fullName: true,
      username: true,
      avatarUrl: true,
      headline: true,
      bio: true,
      skills: { select: { id: true, name: true } },
    },
    orderBy: { fullName: "asc" },
  });
}

export async function getMyMentorships(profileId: string) {
  return prisma.mentorshipSession.findMany({
    where: { OR: [{ menteeId: profileId }, { mentorId: profileId }] },
    include: {
      mentor: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
      mentee: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
