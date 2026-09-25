"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, canModerateContent, logAdminAction } from "@/lib/admin-permissions";

export async function rejectEvent(eventId: string, reason: string) {
  const admin = await requireAdmin();
  if (!canModerateContent(admin.role)) {
    return { success: false, error: "You do not have permission to reject events." };
  }
  if (!reason || reason.trim().length < 3) {
    return { success: false, error: "Please provide a rejection reason." };
  }

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return { success: false, error: "Event not found." };

  await prisma.event.update({ where: { id: eventId }, data: { status: "REJECTED", rejectionReason: reason.trim() } });
  await logAdminAction({ actorId: admin.id, action: "EVENT_REJECTED", targetType: "EVENT", targetId: eventId, metadata: { reason } });

  revalidatePath("/admin/events");
  return { success: true };
}
