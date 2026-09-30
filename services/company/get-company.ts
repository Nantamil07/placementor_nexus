import { prisma } from "@/lib/prisma";

export async function getCompany(slug: string, profileId?: string) {
  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      _count: { select: { followers: true } },
      jobs: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          type: true,
          createdAt: true,
        },
      },
    },
  });

  if (!company) return null;

  const isFollowing = profileId
    ? Boolean(
        await prisma.companyFollower.findUnique({
          where: { companyId_profileId: { companyId: company.id, profileId } },
          select: { id: true },
        })
      )
    : false;

  return {
    id: company.id,
    slug: company.slug,
    name: company.name,
    logoUrl: company.logoUrl,
    website: company.website,
    location: company.location,
    about: company.about,
    isVerified: company.isVerified,
    followersCount: company._count.followers,
    isFollowing,
    jobs: company.jobs.map((job) => ({ ...job, createdAt: job.createdAt.toISOString() })),
  };
}
