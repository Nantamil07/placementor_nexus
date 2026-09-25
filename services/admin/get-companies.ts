import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface GetCompaniesParams {
  page?: number;
  limit?: number;
  search?: string;
  verifiedOnly?: boolean;
}

export async function getCompanies({ page = 1, limit = 20, search, verifiedOnly }: GetCompaniesParams) {
  const where: Prisma.CompanyWhereInput = {
    ...(verifiedOnly ? { isVerified: true } : {}),
    ...(search
      ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { location: { contains: search, mode: "insensitive" } }] }
      : {}),
  };

  const [companies, total] = await prisma.$transaction([
    prisma.company.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { _count: { select: { jobs: true, followers: true } } },
    }),
    prisma.company.count({ where }),
  ]);

  return { companies, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export async function getCompanyById(id: string) {
  return prisma.company.findUnique({
    where: { id },
    include: {
      jobs: { orderBy: { createdAt: "desc" }, take: 10 },
      _count: { select: { jobs: true, followers: true } },
    },
  });
}
