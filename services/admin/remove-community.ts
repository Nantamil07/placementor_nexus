"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, canModerateContent, logAdminAction } from "@/lib/admin-permissions";

/** Soft-removes an entire community (hides it platform-wide but keeps records for audit). */
export async function removeCommunity(communityId: string) {
  const admin = await requireAdmin();
  if (!canModerateContent(admin.role)) {
    return { success: false, error: "You do not have permission to remove communities." };
  }

  const community = await prisma.community.findUnique({ where: { id: communityId } });
  if (!community) return { success: false, error: "Community not found." };

  await prisma.community.update({ where: { id: communityId }, data: { isRemoved: true } });
  await logAdminAction({
    actorId: admin.id,
    action: "COMMUNITY_REMOVED",
    targetType: "COMMUNITY",
    targetId: communityId,
    metadata: { name: community.name },
  });

  revalidatePath("/admin/communities");
  return { success: true };
}

/** Removes a single inappropriate post from a community. */
export async function removePost(postId: string, reason?: string) {
  const admin = await requireAdmin();
  if (!canModerateContent(admin.role)) {
    return { success: false, error: "You do not have permission to remove posts." };
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return { success: false, error: "Post not found." };

  await prisma.post.update({ where: { id: postId }, data: { isRemoved: true, removedReason: reason ?? "Removed by moderator" } });
  await logAdminAction({ actorId: admin.id, action: "POST_REMOVED", targetType: "POST", targetId: postId, metadata: { reason } });

  revalidatePath("/admin/communities");
  return { success: true };
}
