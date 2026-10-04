"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function acceptConnectionRequest(
  requestId: string
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  const request = await prisma.connection.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      receiverId: true,
      status: true,
    },
  });

  if (!request) {
    return { success: false, error: "Connection request not found" };
  }

  if (request.receiverId !== profile.id) {
    return {
      success: false,
      error: "You cannot accept this request",
    };
  }

  if (request.status !== "PENDING") {
    return {
      success: false,
      error: "This request is no longer pending",
    };
  }

  await prisma.connection.update({
    where: { id: requestId },
    data: { status: "ACCEPTED" },
  });

  revalidatePath("/network");

  return { success: true };
}
