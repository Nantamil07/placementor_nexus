import "server-only";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getEvent(eventId: string) {
  const event = await prisma.event.findFirst({
    where: { id: eventId, status: "APPROVED" },
    include: {
      organizer: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
      _count: { select: { registrations: true } },
    },
  });

  if (!event) return null;

  const { userId } = await auth();
  let isRegistered = false;

  if (userId) {
    const profile = await prisma.profile.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (profile) {
      const registration = await prisma.eventRegistration.findUnique({
        where: {
          eventId_profileId: {
            eventId,
            profileId: profile.id,
          },
        },
        select: { id: true },
      });
      isRegistered = Boolean(registration);
    }
  }

  return {
    ...event,
    registrationCount: event._count.registrations,
    isRegistered,
  };
}
