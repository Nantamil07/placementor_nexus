import { prisma } from "@/lib/prisma";

export async function getCompany(slug: string) {
  return prisma.company.findUnique({
    where: {
      slug,
    },
    include: {
      jobs: {
        where: {
          status: "APPROVED",
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}
