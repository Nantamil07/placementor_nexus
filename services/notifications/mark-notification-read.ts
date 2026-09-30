"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markNotificationRead(notificationId: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized." };

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!profile) return { success: false, error: "Profile not found." };

  const result = await prisma.notification.updateMany({
    where: {
      id: notificationId,
      recipientId: profile.id,
      isRead: false,
    },
    data: { isRead: true },
  });

  if (result.count === 0) {
    const exists = await prisma.notification.findFirst({
      where: { id: notificationId, recipientId: profile.id },
      select: { id: true },
    });
    if (!exists) return { success: false, error: "Notification not found." };
  }

  revalidatePath("/notifications");
  return { success: true };
}
