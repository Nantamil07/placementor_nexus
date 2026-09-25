"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin, canManageUsers, logAdminAction } from "@/lib/admin-permissions";

export async function deleteUser(profileId: string) {
  const admin = await requireAdmin();
  if (!canManageUsers(admin.role)) {
    return { success: false, error: "Only administrators can delete users." };
  }
  if (profileId === admin.id) {
    return { success: false, error: "You cannot delete your own account." };
  }

  const target = await prisma.profile.findUnique({ where: { id: profileId } });
  if (!target) return { success: false, error: "User not found." };

  await prisma.profile.delete({ where: { id: profileId } });
  await logAdminAction({
    actorId: admin.id,
    action: "USER_DELETED",
    targetType: "PROFILE",
    targetId: profileId,
    metadata: { email: target.email, fullName: target.fullName },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUserAndRedirect(profileId: string) {
  const result = await deleteUser(profileId);
  if (result.success) {
    redirect("/admin/users");
  }
  return result;
}
