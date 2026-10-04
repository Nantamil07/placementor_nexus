"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { ConnectionStatus } from "./get-connections";

export async function sendConnectionRequest(
  targetUserId: string
): Promise<{ success: boolean; status: ConnectionStatus; error?: string }> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, status: "NONE", error: "Unauthorized" };
  }

  const sender = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!sender) {
    return { success: false, status: "NONE", error: "Profile not found" };
  }

  if (sender.id === targetUserId) {
    return {
      success: false,
      status: "NONE",
      error: "You cannot connect with yourself",
    };
  }

  const target = await prisma.profile.findUnique({
    where: { id: targetUserId },
    select: { id: true, isSuspended: true },
  });

  if (!target || target.isSuspended) {
    return { success: false, status: "NONE", error: "User not found" };
  }

  const existing = await prisma.connection.findFirst({
    where: {
      OR: [
        { senderId: sender.id, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: sender.id },
      ],
    },
  });

  if (existing) {
    if (existing.status === "ACCEPTED") {
      return { success: true, status: "ACCEPTED" };
    }

    if (
      existing.senderId === sender.id &&
      existing.receiverId === targetUserId
    ) {
      return { success: true, status: "PENDING" };
    }

    return {
      success: true,
      status: "PENDING",
    };
  }

  await prisma.connection.create({
    data: {
      senderId: sender.id,
      receiverId: targetUserId,
      status: "PENDING",
    },
  });

  revalidatePath("/network");

  return {
    success: true,
    status: "PENDING",
  };
}
