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
    return { success: false, isMember: false, memberCount: 0, error: "Unauthorized" };
  }

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!profile) {
    return { success: false, isMember: false, memberCount: 0, error: "Profile not found" };
  }

  const community = await prisma.community.findUnique({
    where: { id: communityId },
    select: { id: true, slug: true, isRemoved: true },
  });

  if (!community || community.isRemoved) {
    return { success: false, isMember: false, memberCount: 0, error: "Community not found" };
  }

  const existingMember = await prisma.communityMember.findUnique({
    where: {
      communityId_profileId: {
        communityId,
        profileId: profile.id,
      },
    },
  });

  if (existingMember) {
    await prisma.communityMember.delete({
      where: { id: existingMember.id },
    });
  } else {
    await prisma.communityMember.create({
      data: {
        communityId,
        profileId: profile.id,
        role: "MEMBER",
      },
    });
  }

  const memberCount = await prisma.communityMember.count({
    where: { communityId, isBanned: false },
  });

  revalidatePath("/communities");
  revalidatePath(`/communities/${community.slug}`);

  return {
    success: true,
    isMember: !existingMember,
    memberCount,
  };
}
