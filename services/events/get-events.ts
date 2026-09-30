import { prisma } from "@/lib/prisma";

export type EventListItem = {
  id: string;
  title: string;
  description: string;
  type: "WEBINAR" | "HACKATHON" | "PLACEMENT_DRIVE" | "WORKSHOP";
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  startsAt: string;
  endsAt: string | null;
  organizer: { id: string; fullName: string; username: string; avatarUrl: string | null };
  registrationCount: number;
  isRegistered: boolean;
};

type Options = { search?: string; type?: EventListItem["type"]; includePast?: boolean; profileId?: string };

export async function getEvents(options: Options = {}) {
  const { search, type, includePast = false, profileId } = options;
  const events = await prisma.event.findMany({
    where: {
      status: "APPROVED",
      ...(search?.trim() ? { OR: [
        { title: { contains: search.trim(), mode: "insensitive" } },
        { description: { contains: search.trim(), mode: "insensitive" } },
      ] } : {}),
      ...(type ? { type } : {}),
      ...(!includePast ? { startsAt: { gte: new Date() } } : {}),
    },
    orderBy: { startsAt: "asc" },
    include: {
      organizer: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
      _count: { select: { registrations: true } },
      ...(profileId ? { registrations: { where: { profileId }, select: { id: true } } } : {}),
    },
  });
  return events.map((event) => ({
    id: event.id, title: event.title, description: event.description,
    type: event.type, status: event.status, startsAt: event.startsAt.toISOString(),
    endsAt: event.endsAt?.toISOString() ?? null, organizer: event.organizer,
    registrationCount: event._count.registrations,
    isRegistered: profileId && "registrations" in event ? event.registrations.length > 0 : false,
  }));
}
