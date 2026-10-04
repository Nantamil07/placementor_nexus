import { prisma } from "@/lib/prisma";

export async function getJob(id: string) {
  return prisma.job.findUnique({
    where: {
      id,
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          website: true,
          location: true,
          about: true,
        },
      },
    },
  });
}
