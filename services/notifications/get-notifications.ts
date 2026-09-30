import "server-only";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUserNotifications(limit = 50) {
  const { userId } = await auth();
  if (!userId) return { notifications: [], unreadCount: 0 };

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!profile) return { notifications: [], unreadCount: 0 };

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { recipientId: profile.id },
      orderBy: { createdAt: "desc" },
      take: Math.min(Math.max(limit, 1), 100),
      include: {
        actor: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    }),
    prisma.notification.count({
      where: { recipientId: profile.id, isRead: false },
    }),
  ]);

  return { notifications, unreadCount };
}
