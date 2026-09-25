"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, canModerateContent, logAdminAction } from "@/lib/admin-permissions";

export async function verifyRecruiter(profileId: string) {
  const admin = await requireAdmin();
  if (!canModerateContent(admin.role)) {
    return { success: false, error: "You do not have permission to verify recruiters." };
  }

  const target = await prisma.profile.findUnique({ where: { id: profileId } });
  if (!target || target.role !== "RECRUITER") {
    return { success: false, error: "This user is not a recruiter." };
  }

  await prisma.profile.update({ where: { id: profileId }, data: { isVerifiedRecruiter: !target.isVerifiedRecruiter } });
  await logAdminAction({
    actorId: admin.id,
    action: target.isVerifiedRecruiter ? "RECRUITER_UNVERIFIED" : "RECRUITER_VERIFIED",
    targetType: "PROFILE",
    targetId: profileId,
  });

  revalidatePath("/admin/recruiters");
  return { success: true };
}

export async function getRecruiters(search?: string) {
  return prisma.profile.findMany({
    where: {
      role: "RECRUITER",
      ...(search
        ? { OR: [{ fullName: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    select: { id: true, fullName: true, email: true, avatarUrl: true, isVerifiedRecruiter: true, isSuspended: true, createdAt: true },
  });
}
