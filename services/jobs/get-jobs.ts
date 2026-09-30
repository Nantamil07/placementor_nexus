import "server-only";

import { prisma } from "@/lib/prisma";
import type { JobType } from "@prisma/client";

export interface GetJobsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: JobType;
  location?: string;
}

export async function getJobs({
  page = 1,
  limit = 10,
  search,
  type,
  location,
}: GetJobsParams = {}) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(1, limit), 50);
  const query = search?.trim();
  const locationQuery = location?.trim();

  const where = {
    status: "APPROVED" as const,
    ...(type ? { type } : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" as const } },
            { description: { contains: query, mode: "insensitive" as const } },
            { company: { name: { contains: query, mode: "insensitive" as const } } },
          ],
        }
      : {}),
    ...(locationQuery
      ? { location: { contains: locationQuery, mode: "insensitive" as const } }
      : {}),
  };

  const [jobs, total] = await prisma.$transaction([
    prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        type: true,
        status: true,
        createdAt: true,
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            location: true,
            isVerified: true,
          },
        },
        _count: { select: { applications: true } },
      },
    }),
    prisma.job.count({ where }),
  ]);

  return {
    jobs,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    hasMore: safePage * safeLimit < total,
  };
}
