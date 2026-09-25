"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, canModerateContent, logAdminAction } from "@/lib/admin-permissions";

export async function rejectJob(jobId: string, reason: string) {
  const admin = await requireAdmin();
  if (!canModerateContent(admin.role)) {
    return { success: false, error: "You do not have permission to reject jobs." };
  }
  if (!reason || reason.trim().length < 3) {
    return { success: false, error: "Please provide a rejection reason." };
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return { success: false, error: "Job not found." };

  await prisma.job.update({ where: { id: jobId }, data: { status: "REJECTED", rejectionReason: reason.trim() } });
  await logAdminAction({ actorId: admin.id, action: "JOB_REJECTED", targetType: "JOB", targetId: jobId, metadata: { reason } });

  revalidatePath("/admin/jobs");
  revalidatePath(`/admin/jobs/${jobId}`);
  return { success: true };
}
