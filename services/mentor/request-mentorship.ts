"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function requestMentorship(mentorId: string, topic: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized. Please sign in." };

  const mentee = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!mentee) return { success: false, error: "Profile not found." };
  if (mentee.id === mentorId) return { success: false, error: "You cannot request yourself as a mentor." };

  const mentor = await prisma.profile.findUnique({
    where: { id: mentorId },
    select: { id: true, role: true, isSuspended: true },
  });
  if (!mentor || mentor.role !== "MENTOR" || mentor.isSuspended) {
    return { success: false, error: "Mentor not found or unavailable." };
  }

  const cleanTopic = topic.trim();
  if (!cleanTopic) return { success: false, error: "Topic is required." };
  if (cleanTopic.length > 300) return { success: false, error: "Topic is too long." };

  const active = await prisma.mentorshipSession.findFirst({
    where: {
      mentorId,
      menteeId: mentee.id,
      status: { in: ["REQUESTED", "CONFIRMED"] },
    },
    select: { id: true },
  });
  if (active) return { success: false, error: "You already have an active mentorship request with this mentor." };

  const session = await prisma.mentorshipSession.create({
    data: { mentorId, menteeId: mentee.id, topic: cleanTopic, status: "REQUESTED" },
    select: { id: true },
  });

  await prisma.notification.create({
    data: {
      recipientId: mentorId,
      actorId: mentee.id,
      type: "MENTORSHIP_UPDATE",
      title: "New mentorship request",
      message: `You received a mentorship request about: ${cleanTopic}`,
      link: "/mentorship",
    },
  });

  return { success: true, sessionId: session.id };
}

export async function updateMentorshipStatus(
  sessionId: string,
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED",
) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized. Please sign in." };

  const profile = await prisma.profile.findUnique({ where: { clerkId: userId }, select: { id: true } });
  if (!profile) return { success: false, error: "Profile not found." };

  const session = await prisma.mentorshipSession.findUnique({
    where: { id: sessionId },
    select: { id: true, mentorId: true, menteeId: true, status: true, topic: true },
  });
  if (!session) return { success: false, error: "Mentorship session not found." };

  const isMentor = session.mentorId === profile.id;
  const isMentee = session.menteeId === profile.id;
  if (!isMentor && !isMentee) return { success: false, error: "You are not part of this mentorship." };

  if (status === "CONFIRMED" && (!isMentor || session.status !== "REQUESTED")) {
    return { success: false, error: "Only the mentor can confirm a requested session." };
  }
  if (status === "COMPLETED" && (!isMentor || session.status !== "CONFIRMED")) {
    return { success: false, error: "Only the mentor can complete a confirmed session." };
  }
  if (status === "CANCELLED" && !["REQUESTED", "CONFIRMED"].includes(session.status)) {
    return { success: false, error: "This session can no longer be cancelled." };
  }

  await prisma.mentorshipSession.update({ where: { id: sessionId }, data: { status } });

  const recipientId = isMentor ? session.menteeId : session.mentorId;
  await prisma.notification.create({
    data: {
      recipientId,
      actorId: profile.id,
      type: "MENTORSHIP_UPDATE",
      title: `Mentorship ${status.toLowerCase()}`,
      message: `Your mentorship request about "${session.topic}" is now ${status.toLowerCase()}.`,
      link: "/mentorship",
    },
  });

  return { success: true, status };
}
