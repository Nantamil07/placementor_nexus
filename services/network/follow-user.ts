"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function toggleFollowUser(targetUserId: string): Promise<{ success: boolean; isFollowing: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { success: false, isFollowing: false, error: "Unauthorized" };
  const me = await prisma.profile.findUnique({ where: { clerkId: userId }, select: { id: true } });
  if (!me) return { success: false, isFollowing: false, error: "Profile not found" };
  if (me.id === targetUserId) return { success: false, isFollowing: false, error: "You cannot follow yourself" };

  const existing = await prisma.follow.findUnique({ where: { followerId_followingId: { followerId: me.id, followingId: targetUserId } } });
  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    revalidatePath("/network");
    return { success: true, isFollowing: false };
  }

  const target = await prisma.profile.findUnique({ where: { id: targetUserId }, select: { id: true, isSuspended: true } });
  if (!target || target.isSuspended) return { success: false, isFollowing: false, error: "User not found" };
  await prisma.follow.create({ data: { followerId: me.id, followingId: targetUserId } });
  revalidatePath("/network");
  return { success: true, isFollowing: true };
}
