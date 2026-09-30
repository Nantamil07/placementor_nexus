"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

type Status = "CONFIRMED" | "COMPLETED" | "CANCELLED";

export async function updateMentorshipStatus(sessionId: string, status: Status) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized. Please sign in." };

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!profile) return { success: false, error: "Profile not found." };

  const session = await prisma.mentorshipSession.findUnique({
    where: { id: sessionId },
    select: { id: true, mentorId: true, menteeId: true, status: true },
  });
  if (!session) return { success: false, error: "Mentorship session not found." };

  const isMentor = session.mentorId === profile.id;
  const isMentee = session.menteeId === profile.id;
  if (!isMentor && !isMentee) return { success: false, error: "You are not part of this mentorship." };

  if (status === "CONFIRMED" && !isMentor) {
    return { success: false, error: "Only the mentor can confirm a request." };
  }

  if (status === "COMPLETED" && !isMentor && !isMentee) {
    return { success: false, error: "Unauthorized." };
  }

  await prisma.mentorshipSession.update({
    where: { id: sessionId },
    data: { status },
  });

  return { success: true, status };
}
