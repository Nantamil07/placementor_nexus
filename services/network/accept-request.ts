"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function acceptConnectionRequest(requestId: string): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const receiver = await prisma.profile.findUnique({ where: { clerkId: userId }, select: { id: true } });
  if (!receiver) return { success: false, error: "Profile not found" };

  const request = await prisma.connection.findFirst({ where: { id: requestId, receiverId: receiver.id, status: "PENDING" } });
  if (!request) return { success: false, error: "Connection request not found" };

  await prisma.$transaction([
    prisma.connection.update({ where: { id: request.id }, data: { status: "ACCEPTED" } }),
    prisma.notification.create({
      data: {
        recipientId: request.senderId,
        actorId: receiver.id,
        type: "CONNECTION_ACCEPTED",
        title: "Connection accepted",
        message: "Your connection request was accepted.",
        link: "/network",
      },
    }),
  ]);

  revalidatePath("/network");
  return { success: true };
}
