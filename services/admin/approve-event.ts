"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, canModerateContent, logAdminAction } from "@/lib/admin-permissions";

export async function approveEvent(eventId: string) {
  const admin = await requireAdmin();
  if (!canModerateContent(admin.role)) {
    return { success: false, error: "You do not have permission to approve events." };
  }

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return { success: false, error: "Event not found." };

  await prisma.event.update({ where: { id: eventId }, data: { status: "APPROVED", rejectionReason: null } });
  await logAdminAction({ actorId: admin.id, action: "EVENT_APPROVED", targetType: "EVENT", targetId: eventId });

  revalidatePath("/admin/events");
  return { success: true };
}
