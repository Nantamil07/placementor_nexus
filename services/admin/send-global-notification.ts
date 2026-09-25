"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, canSendNotifications, logAdminAction } from "@/lib/admin-permissions";

const AUDIENCES = ["ALL", "STUDENTS", "ALUMNI", "MENTORS", "RECRUITERS", "PLACEMENT_OFFICERS"] as const;

export async function sendGlobalNotification(
  title: string,
  message: string,
  audience: (typeof AUDIENCES)[number] = "ALL"
) {
  const admin = await requireAdmin();
  if (!canSendNotifications(admin.role)) {
    return { success: false, error: "Only administrators can broadcast notifications." };
  }
  if (!title.trim() || !message.trim()) {
    return { success: false, error: "Title and message are required." };
  }
  if (!AUDIENCES.includes(audience)) {
    return { success: false, error: "Invalid audience." };
  }

  const notification = await prisma.adminNotification.create({
    data: { title: title.trim(), message: message.trim(), audience, sentById: admin.id },
  });

  await logAdminAction({
    actorId: admin.id,
    action: "NOTIFICATION_SENT",
    targetType: "ADMIN_NOTIFICATION",
    targetId: notification.id,
    metadata: { audience, title },
  });

  revalidatePath("/admin/notifications");
  return { success: true, notification };
}
