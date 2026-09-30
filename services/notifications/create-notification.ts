import "server-only";

import type { NotificationType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function createNotification(input: {
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  actorId?: string | null;
}) {
  return prisma.notification.create({
    data: {
      recipientId: input.recipientId,
      type: input.type,
      title: input.title,
      message: input.message,
      link: input.link ?? null,
      actorId: input.actorId ?? null,
    },
  });
}
