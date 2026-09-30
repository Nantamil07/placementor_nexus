"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markAllNotificationsRead() {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized." };

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!profile) return { success: false, error: "Profile not found." };

  await prisma.notification.updateMany({
    where: { recipientId: profile.id, isRead: false },
    data: { isRead: true },
  });

  revalidatePath("/notifications");
  return { success: true };
}
