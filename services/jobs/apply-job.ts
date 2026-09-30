"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function applyToJob(jobId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Please sign in before applying." };
  }

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!profile) {
    return { success: false, error: "Profile not found. Complete your profile first." };
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, status: true },
  });

  if (!job || job.status !== "APPROVED") {
    return { success: false, error: "This job is not currently accepting applications." };
  }

  const existing = await prisma.jobApplication.findUnique({
    where: {
      jobId_applicantId: {
        jobId,
        applicantId: profile.id,
      },
    },
    select: { id: true },
  });

  if (existing) {
    return { success: false, error: "You have already applied to this job." };
  }

  await prisma.jobApplication.create({
    data: {
      jobId,
      applicantId: profile.id,
      status: "APPLIED",
    },
  });

  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobId}`);

  return { success: true };
}
