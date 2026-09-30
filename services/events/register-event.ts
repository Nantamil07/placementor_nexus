"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function registerForEvent(eventId: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized. Please sign in." };
  const profile = await prisma.profile.findUnique({ where: { clerkId: userId }, select: { id: true } });
  if (!profile) return { success: false, error: "Profile not found." };
  const event = await prisma.event.findUnique({ where: { id: eventId }, select: { id: true, status: true, startsAt: true } });
  if (!event) return { success: false, error: "Event not found." };
  if (event.status !== "APPROVED") return { success: false, error: "This event is not open for registration." };
  if (event.startsAt <= new Date()) return { success: false, error: "Registration is closed for this event." };
  const existing = await prisma.eventRegistration.findUnique({ where: { eventId_profileId: { eventId, profileId: profile.id } }, select: { id: true } });
  if (existing) return { success: true, registered: true, message: "Already registered." };
  await prisma.eventRegistration.create({ data: { eventId, profileId: profile.id } });
  return { success: true, registered: true, message: "Registered successfully." };
}

export async function unregisterFromEvent(eventId: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized. Please sign in." };
  const profile = await prisma.profile.findUnique({ where: { clerkId: userId }, select: { id: true } });
  if (!profile) return { success: false, error: "Profile not found." };
  await prisma.eventRegistration.deleteMany({ where: { eventId, profileId: profile.id } });
  return { success: true, registered: false, message: "Registration cancelled." };
}
