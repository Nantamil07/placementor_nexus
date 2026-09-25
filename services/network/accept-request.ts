"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { connectionRequestsStore } from "./get-connections";

export async function acceptConnectionRequest(
  requestId: string
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const request = connectionRequestsStore.find((req) => req.id === requestId);
  if (!request) {
    return { success: false, error: "Connection request not found" };
  }

  request.status = "ACCEPTED";
  revalidatePath("/network");

  return { success: true };
}
