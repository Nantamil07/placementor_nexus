"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getOrCreateConversation(targetProfileId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const currentProfile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!currentProfile) {
    return { success: false, error: "Profile not found" };
  }

  if (currentProfile.id === targetProfileId) {
    return { success: false, error: "You cannot message yourself" };
  }

  const targetProfile = await prisma.profile.findUnique({
    where: { id: targetProfileId },
    select: { id: true, isSuspended: true },
  });

  if (!targetProfile || targetProfile.isSuspended) {
    return { success: false, error: "User not found" };
  }

  const existing = await prisma.conversation.findFirst({
    where: {
      AND: [
        {
          participants: {
            some: { profileId: currentProfile.id },
          },
        },
        {
          participants: {
            some: { profileId: targetProfileId },
          },
        },
      ],
    },
    select: { id: true },
  });

  if (existing) {
    return {
      success: true,
      conversationId: existing.id,
    };
  }

  const conversation = await prisma.conversation.create({
    data: {
      participants: {
        create: [
          { profileId: currentProfile.id },
          { profileId: targetProfileId },
        ],
      },
    },
    select: { id: true },
  });

  return {
    success: true,
    conversationId: conversation.id,
  };
}
