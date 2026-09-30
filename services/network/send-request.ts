"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type ConnectionStatus = "NONE" | "PENDING" | "ACCEPTED" | "REJECTED";

export async function sendConnectionRequest(targetUserId: string): Promise<{ success: boolean; status: ConnectionStatus; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { success: false, status: "NONE", error: "Unauthorized" };

  const sender = await prisma.profile.findUnique({ where: { clerkId: userId }, select: { id: true } });
  if (!sender) return { success: false, status: "NONE", error: "Profile not found" };
  if (sender.id === targetUserId) return { success: false, status: "NONE", error: "You cannot connect with yourself" };

  const target = await prisma.profile.findUnique({ where: { id: targetUserId }, select: { id: true, isSuspended: true } });
  if (!target || target.isSuspended) return { success: false, status: "NONE", error: "User not found" };

  const existing = await prisma.connection.findFirst({
    where: {
      OR: [
        { senderId: sender.id, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: sender.id },
      ],
    },
  });
  if (existing) return { success: true, status: existing.status };

  await prisma.$transaction([
    prisma.connection.create({ data: { senderId: sender.id, receiverId: targetUserId, status: "PENDING" } }),
    prisma.notification.create({
      data: {
        recipientId: targetUserId,
        actorId: sender.id,
        type: "CONNECTION_REQUEST",
        title: "New connection request",
        message: "You received a new connection request.",
        link: "/network",
      },
    }),
  ]);

  revalidatePath("/network");
  return { success: true, status: "PENDING" };
}
