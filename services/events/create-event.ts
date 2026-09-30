"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createEvent(input: {
  title: string;
  description: string;
  type: "WEBINAR" | "HACKATHON" | "PLACEMENT_DRIVE" | "WORKSHOP";
  startsAt: string;
  endsAt?: string;
}) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Please sign in first." };

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true, isSuspended: true },
  });

  if (!profile) return { success: false, error: "Profile not found." };
  if (profile.isSuspended) return { success: false, error: "Your account is suspended." };

  const title = input.title.trim();
  const description = input.description.trim();
  const startsAt = new Date(input.startsAt);
  const endsAt = input.endsAt ? new Date(input.endsAt) : null;

  if (title.length < 3) return { success: false, error: "Title must contain at least 3 characters." };
  if (description.length < 10) return { success: false, error: "Description must contain at least 10 characters." };
  if (Number.isNaN(startsAt.getTime())) return { success: false, error: "Invalid start date." };
  if (startsAt <= new Date()) return { success: false, error: "Start time must be in the future." };
  if (endsAt && (Number.isNaN(endsAt.getTime()) || endsAt <= startsAt)) {
    return { success: false, error: "End time must be after the start time." };
  }

  const event = await prisma.event.create({
    data: {
      title,
      description,
      type: input.type,
      status: "PENDING",
      organizerId: profile.id,
      startsAt,
      endsAt,
    },
    select: { id: true },
  });

  revalidatePath("/events");
  revalidatePath("/admin/events");

  return { success: true, eventId: event.id };
}
