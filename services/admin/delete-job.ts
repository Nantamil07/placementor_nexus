"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, canModerateContent, logAdminAction } from "@/lib/admin-permissions";

export async function deleteJob(jobId: string) {
  const admin = await requireAdmin();
  if (!canModerateContent(admin.role)) {
    return { success: false, error: "You do not have permission to delete jobs." };
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return { success: false, error: "Job not found." };

  await prisma.job.delete({ where: { id: jobId } });
  await logAdminAction({ actorId: admin.id, action: "JOB_DELETED", targetType: "JOB", targetId: jobId, metadata: { title: job.title } });

  revalidatePath("/admin/jobs");
  return { success: true };
}
