"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ReportType, ReportTargetType } from "@prisma/client";

export async function reportContent({
  targetType,
  targetId,
  type,
  reason,
}: {
  targetType: ReportTargetType;
  targetId: string;
  type: ReportType;
  reason: string;
}): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized. Please sign in." };
  }

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!profile) {
    return { success: false, error: "Profile not found." };
  }

  const trimmedReason = reason.trim();
  if (!trimmedReason) {
    return { success: false, error: "Please provide a reason for the report." };
  }

  // Prevent duplicate reports by the same user on the same target
  const existingReport = await prisma.report.findFirst({
    where: {
      reporterId: profile.id,
      targetId,
      targetType,
      status: "PENDING",
    },
  });

  if (existingReport) {
    return { success: false, error: "You have already submitted a pending report for this content." };
  }

  await prisma.report.create({
    data: {
      type,
      targetType,
      targetId,
      reason: trimmedReason,
      reporterId: profile.id,
    },
  });

  return { success: true };
}
