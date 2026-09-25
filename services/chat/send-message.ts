"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  conversationsStore,
  messagesStore,
  ChatMessage,
} from "./get-conversations";

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

  const newMessage: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    conversationId,
    senderId: "current_user",
    text: trimmed,
    createdAt: new Date().toISOString(),
    isSeen: false,
  };

  if (!messagesStore[conversationId]) {
    messagesStore[conversationId] = [];
  }
  messagesStore[conversationId].push(newMessage);

  const conv = conversationsStore.find((c) => c.id === conversationId);
  if (conv) {
    conv.lastMessage = trimmed;
    conv.lastMessageAt = newMessage.createdAt;
  }

  revalidatePath("/messages");
  return { success: true, message: newMessage };
}
