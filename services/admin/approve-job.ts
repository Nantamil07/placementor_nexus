"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, canModerateContent, logAdminAction } from "@/lib/admin-permissions";

export async function approveJob(jobId: string) {
  const admin = await requireAdmin();
  if (!canModerateContent(admin.role)) {
    return { success: false, error: "You do not have permission to approve jobs." };
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return { success: false, error: "Job not found." };

  await prisma.job.update({ where: { id: jobId }, data: { status: "APPROVED", rejectionReason: null } });
  await logAdminAction({ actorId: admin.id, action: "JOB_APPROVED", targetType: "JOB", targetId: jobId });

  revalidatePath("/admin/jobs");
  revalidatePath(`/admin/jobs/${jobId}`);
  return { success: true };
}
