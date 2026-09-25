"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { communitiesStore, communityMembersStore } from "./get-community";

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

  const community = communitiesStore.find((c) => c.id === communityId);
  if (!community) {
    return { success: false, isMember: false, memberCount: 0, error: "Community not found" };
  }

  const membershipKey = `${userId}_${communityId}`;
  const alreadyMember = communityMembersStore.has(membershipKey);

  if (alreadyMember) {
    communityMembersStore.delete(membershipKey);
    community.memberCount = Math.max(0, community.memberCount - 1);
  } else {
    communityMembersStore.add(membershipKey);
    community.memberCount += 1;
  }

  revalidatePath("/communities");
  revalidatePath(`/communities/${community.slug}`);

  return {
    success: true,
    isMember: !alreadyMember,
    memberCount: community.memberCount,
  };
}
