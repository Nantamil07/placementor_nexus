"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function registerForEvent(eventId: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Please sign in to register." };

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true, isSuspended: true },
  });
  if (!profile) return { success: false, error: "Profile not found." };
  if (profile.isSuspended) return { success: false, error: "Your account is suspended." };

  const event = await prisma.event.findFirst({
    where: { id: eventId, status: "APPROVED", startsAt: { gt: new Date() } },
    select: { id: true },
  });
  if (!event) return { success: false, error: "Event is unavailable for registration." };

  await prisma.eventRegistration.upsert({
    where: {
      eventId_profileId: {
        eventId,
        profileId: profile.id,
      },
    },
    update: {},
    create: { eventId, profileId: profile.id },
  });

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/events");
  return { success: true, registered: true };
}
