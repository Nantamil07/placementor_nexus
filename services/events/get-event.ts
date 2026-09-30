import { prisma } from "@/lib/prisma";

export async function getEvent(eventId: string, profileId?: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      organizer: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
      _count: { select: { registrations: true } },
      ...(profileId ? { registrations: { where: { profileId }, select: { id: true } } } : {}),
    },
  });
  if (!event) return null;
  return {
    id: event.id, title: event.title, description: event.description,
    type: event.type, status: event.status, startsAt: event.startsAt.toISOString(),
    endsAt: event.endsAt?.toISOString() ?? null, rejectionReason: event.rejectionReason,
    createdAt: event.createdAt.toISOString(), organizer: event.organizer,
    registrationCount: event._count.registrations,
    isRegistered: profileId && "registrations" in event ? event.registrations.length > 0 : false,
  };
}
