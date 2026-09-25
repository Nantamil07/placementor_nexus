"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, canManageUsers, logAdminAction } from "@/lib/admin-permissions";

const VALID_ROLES = ["STUDENT", "ALUMNI", "MENTOR", "RECRUITER", "PLACEMENT_OFFICER", "ADMIN"] as const;

export async function updateUserRole(profileId: string, role: (typeof VALID_ROLES)[number]) {
  const admin = await requireAdmin();
  if (!canManageUsers(admin.role)) {
    return { success: false, error: "Only administrators can change roles." };
  }
  if (!VALID_ROLES.includes(role)) {
    return { success: false, error: "Invalid role." };
  }

  const target = await prisma.profile.findUnique({ where: { id: profileId } });
  if (!target) return { success: false, error: "User not found." };

  await prisma.profile.update({ where: { id: profileId }, data: { role } });
  await logAdminAction({
    actorId: admin.id,
    action: "USER_ROLE_UPDATED",
    targetType: "PROFILE",
    targetId: profileId,
    metadata: { from: target.role, to: role },
  });

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${profileId}`);
  return { success: true };
}
