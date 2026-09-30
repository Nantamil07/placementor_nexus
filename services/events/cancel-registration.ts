"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function cancelEventRegistration(eventId: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Please sign in first." };

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!profile) return { success: false, error: "Profile not found." };

  await prisma.eventRegistration.deleteMany({
    where: { eventId, profileId: profile.id },
  });

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/events");
  return { success: true, registered: false };
}
