"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, canModerateContent, logAdminAction } from "@/lib/admin-permissions";

export async function suspendUser(profileId: string, reason: string) {
  const admin = await requireAdmin();
  if (!canModerateContent(admin.role)) {
    return { success: false, error: "You do not have permission to suspend users." };
  }
  if (profileId === admin.id) {
    return { success: false, error: "You cannot suspend your own account." };
  }
  if (!reason || reason.trim().length < 3) {
    return { success: false, error: "Please provide a reason for the suspension." };
  }

  await prisma.$transaction([
    prisma.profile.update({ where: { id: profileId }, data: { isSuspended: true } }),
    prisma.userSuspension.create({
      data: { profileId, reason: reason.trim(), suspendedById: admin.id, isActive: true },
    }),
  ]);

  await logAdminAction({ actorId: admin.id, action: "USER_SUSPENDED", targetType: "PROFILE", targetId: profileId, metadata: { reason } });

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${profileId}`);
  return { success: true };
}

export async function unsuspendUser(profileId: string) {
  const admin = await requireAdmin();
  if (!canModerateContent(admin.role)) {
    return { success: false, error: "You do not have permission to lift suspensions." };
  }

  await prisma.$transaction([
    prisma.profile.update({ where: { id: profileId }, data: { isSuspended: false } }),
    prisma.userSuspension.updateMany({
      where: { profileId, isActive: true },
      data: { isActive: false, liftedAt: new Date() },
    }),
  ]);

  await logAdminAction({ actorId: admin.id, action: "USER_UNSUSPENDED", targetType: "PROFILE", targetId: profileId });

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${profileId}`);
  return { success: true };
}
