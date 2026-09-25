import "server-only";
import { prisma } from "@/lib/prisma";

export async function getNotifications(limit = 30) {
  return prisma.adminNotification.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { sentBy: { select: { fullName: true } } },
  });
}
