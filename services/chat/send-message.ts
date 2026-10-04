"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { ChatMessage } from "./get-conversations";

export async function sendMessage(
  conversationId: string,
  text: string
): Promise<{ success: boolean; message?: ChatMessage; error?: string }> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const trimmed = text.trim();

  if (!trimmed) {
    return { success: false, error: "Message cannot be empty" };
  }

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_profileId: {
        conversationId,
        profileId: profile.id,
      },
    },
  });

  if (!participant) {
    return {
      success: false,
      error: "You are not a participant in this conversation",
    };
  }

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: profile.id,
      text: trimmed,
    },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  revalidatePath("/messages");

  return {
    success: true,
    message: {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      text: message.text,
      createdAt: message.createdAt.toISOString(),
      isSeen: true,
    },
  };
}
