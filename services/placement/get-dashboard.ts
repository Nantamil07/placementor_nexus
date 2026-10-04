import { prisma } from "@/lib/prisma";

export async function getDashboardData(profileId: string) {
  const [
    applications,
    selected,
    shortlisted,
    rejected,
    openJobs,
    recentApplications,
  ] = await Promise.all([
    prisma.jobApplication.count({
      where: { applicantId: profileId },
    }),

    prisma.jobApplication.count({
      where: {
        applicantId: profileId,
        status: "SELECTED",
      },
    }),

    prisma.jobApplication.count({
      where: {
        applicantId: profileId,
        status: "SHORTLISTED",
      },
    }),

    prisma.jobApplication.count({
      where: {
        applicantId: profileId,
        status: "REJECTED",
      },
    }),

    prisma.job.count({
      where: {
        status: "APPROVED",
      },
    }),

    prisma.jobApplication.findMany({
      where: {
        applicantId: profileId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return {
    stats: {
      applications,
      selected,
      shortlisted,
      rejected,
      openJobs,
    },
    recentApplications: recentApplications.map((application) => ({
      id: application.id,
      status: application.status,
      createdAt: application.createdAt.toISOString(),
      job: {
        id: application.job.id,
        title: application.job.title,
        location: application.job.location,
        type: application.job.type,
        company: application.job.company,
      },
    })),
  };
}
