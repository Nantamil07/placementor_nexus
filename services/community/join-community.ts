"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleCommunityMembership(communityId: string): Promise<{
  success: boolean;
  isMember: boolean;
  memberCount: number;
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, isMember: false, memberCount: 0, error: "Unauthorized. Please sign in." };
  }

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!profile) {
    return { success: false, isMember: false, memberCount: 0, error: "Profile not found." };
  }

  const community = await prisma.community.findUnique({
    where: { id: communityId },
    select: { id: true, slug: true, isRemoved: true, isPrivate: true },
  });

  if (!community || community.isRemoved) {
    return { success: false, isMember: false, memberCount: 0, error: "Community not found." };
  }

  const existing = await prisma.communityMember.findUnique({
    where: { communityId_profileId: { communityId, profileId: profile.id } },
    select: { id: true, isBanned: true },
  });

  if (existing?.isBanned) {
    const count = await prisma.communityMember.count({ where: { communityId, isBanned: false } });
    return { success: false, isMember: false, memberCount: count, error: "You are banned from this community." };
  }

  if (existing) {
    await prisma.communityMember.delete({ where: { id: existing.id } });
  } else {
    if (community.isPrivate) {
      const count = await prisma.communityMember.count({ where: { communityId, isBanned: false } });
      return { success: false, isMember: false, memberCount: count, error: "This private community requires an invitation or approval." };
    }
    await prisma.communityMember.create({
      data: { communityId, profileId: profile.id, role: "MEMBER" },
    });
  }

  const memberCount = await prisma.communityMember.count({
    where: { communityId, isBanned: false },
  });

  revalidatePath("/communities");
  revalidatePath(`/communities/${community.slug}`);

  return {
    success: true,
    isMember: !existing,
    memberCount,
  };
}
