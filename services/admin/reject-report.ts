"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, canModerateContent, logAdminAction } from "@/lib/admin-permissions";

export async function rejectReport(reportId: string, note?: string) {
  const admin = await requireAdmin();
  if (!canModerateContent(admin.role)) {
    return { success: false, error: "You do not have permission to reject reports." };
  }

  const report = await prisma.report.findUnique({ where: { id: reportId } });
  if (!report) return { success: false, error: "Report not found." };

  await prisma.report.update({
    where: { id: reportId },
    data: { status: "REJECTED", resolvedById: admin.id, resolutionNote: note ?? null },
  });
  await logAdminAction({ actorId: admin.id, action: "REPORT_REJECTED", targetType: "REPORT", targetId: reportId, metadata: { note } });

  revalidatePath("/admin/reports");
  revalidatePath(`/admin/reports/${reportId}`);
  return { success: true };
}
