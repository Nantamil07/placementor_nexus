"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export type CreateEventInput = {
  title: string;
  description: string;
  type: "WEBINAR" | "HACKATHON" | "PLACEMENT_DRIVE" | "WORKSHOP";
  startsAt: string;
  endsAt?: string;
};

export async function createEvent(input: CreateEventInput) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized. Please sign in." };
  const profile = await prisma.profile.findUnique({ where: { clerkId: userId }, select: { id: true } });
  if (!profile) return { success: false, error: "Profile not found." };
  const title = input.title.trim(), description = input.description.trim();
  if (!title) return { success: false, error: "Title is required." };
  if (!description) return { success: false, error: "Description is required." };
  const startsAt = new Date(input.startsAt), endsAt = input.endsAt ? new Date(input.endsAt) : null;
  if (Number.isNaN(startsAt.getTime())) return { success: false, error: "Invalid start date/time." };
  if (startsAt <= new Date()) return { success: false, error: "Event must start in the future." };
  if (endsAt && (Number.isNaN(endsAt.getTime()) || endsAt <= startsAt)) return { success: false, error: "End time must be later than the start time." };
  const event = await prisma.event.create({ data: { title, description, type: input.type, status: "PENDING", organizerId: profile.id, startsAt, endsAt }, select: { id: true } });
  return { success: true, eventId: event.id, message: "Event submitted for approval." };
}
