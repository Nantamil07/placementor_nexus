import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface GetEventsParams {
  page?: number;
  limit?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
}

export async function getEvents({ page = 1, limit = 20, status }: GetEventsParams) {
  const where: Prisma.EventWhereInput = { ...(status ? { status } : {}) };

  const [events, total] = await prisma.$transaction([
    prisma.event.findMany({
      where,
      orderBy: { startsAt: "asc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { organizer: { select: { fullName: true, email: true } } },
    }),
    prisma.event.count({ where }),
  ]);

  return { events, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
}
