import "server-only";

import { prisma } from "@/lib/prisma";

export async function getEvents() {
  return prisma.event.findMany({
    where: {
      status: "APPROVED",
      startsAt: { gte: new Date() },
    },
    orderBy: { startsAt: "asc" },
    include: {
      organizer: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
      _count: { select: { registrations: true } },
    },
  });
}
