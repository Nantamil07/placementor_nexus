import "server-only";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getJob(id: string) {
  const job = await prisma.job.findFirst({
    where: { id, status: "APPROVED" },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      type: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          website: true,
          location: true,
          about: true,
          isVerified: true,
        },
      },
      _count: { select: { applications: true } },
    },
  });

  if (!job) return null;

  const { userId } = await auth();
  let hasApplied = false;

  if (userId) {
    const profile = await prisma.profile.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (profile) {
      const application = await prisma.jobApplication.findUnique({
        where: {
          jobId_applicantId: {
            jobId: id,
            applicantId: profile.id,
          },
        },
        select: { id: true },
      });
      hasApplied = Boolean(application);
    }
  }

  return { ...job, hasApplied };
}
