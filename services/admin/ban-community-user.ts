"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, canModerateContent, logAdminAction } from "@/lib/admin-permissions";

export async function banCommunityUser(communityId: string, profileId: string) {
  const admin = await requireAdmin();
  if (!canModerateContent(admin.role)) {
    return { success: false, error: "You do not have permission to ban members." };
  }

  const member = await prisma.communityMember.findUnique({
    where: { communityId_profileId: { communityId, profileId } },
  });
  if (!member) return { success: false, error: "Membership not found." };

  await prisma.communityMember.update({
    where: { communityId_profileId: { communityId, profileId } },
    data: { isBanned: true },
  });
  await logAdminAction({
    actorId: admin.id,
    action: "COMMUNITY_MEMBER_BANNED",
    targetType: "COMMUNITY",
    targetId: communityId,
    metadata: { profileId },
  });

  revalidatePath(`/admin/communities`);
  return { success: true };
}

export async function unbanCommunityUser(communityId: string, profileId: string) {
  const admin = await requireAdmin();
  if (!canModerateContent(admin.role)) {
    return { success: false, error: "You do not have permission to unban members." };
  }

  await prisma.communityMember.update({
    where: { communityId_profileId: { communityId, profileId } },
    data: { isBanned: false },
  });
  await logAdminAction({ actorId: admin.id, action: "COMMUNITY_MEMBER_UNBANNED", targetType: "COMMUNITY", targetId: communityId, metadata: { profileId } });

  revalidatePath(`/admin/communities`);
  return { success: true };
}
