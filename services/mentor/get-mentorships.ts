import { prisma } from "@/lib/prisma";

export async function getMyMentorships(profileId: string) {
  return prisma.mentorshipSession.findMany({
    where: {
      OR: [{ mentorId: profileId }, { menteeId: profileId }],
    },
    include: {
      mentor: {
        select: { id: true, fullName: true, username: true, avatarUrl: true },
      },
      mentee: {
        select: { id: true, fullName: true, username: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
