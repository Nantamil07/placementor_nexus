"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  connectionRequestsStore,
  defaultSuggestions,
  ConnectionRequestItem,
  ConnectionStatus,
} from "./get-connections";

export async function sendConnectionRequest(
  targetUserId: string
): Promise<{ success: boolean; status: ConnectionStatus; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, status: "NONE", error: "Unauthorized" };
  }

  const existing = connectionRequestsStore.find(
    (req) => req.receiverId === targetUserId && req.senderId === userId
  );

  if (existing) {
    return { success: true, status: existing.status };
  }

  const target = defaultSuggestions.find((s) => s.id === targetUserId);

  const newRequest: ConnectionRequestItem = {
    id: `req_${Date.now()}`,
    senderId: userId,
    receiverId: targetUserId,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    sender: {
      id: userId,
      fullName: "You",
      username: "you",
      avatarUrl: null,
      headline: "Campus Member",
      role: "STUDENT",
      mutualCount: target?.mutualCount ?? 0,
    },
  };

  connectionRequestsStore.push(newRequest);
  revalidatePath("/network");

  return { success: true, status: "PENDING" };
}
