import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface GetJobsParams {
  page?: number;
  limit?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "CLOSED";
  search?: string;
}

export async function getJobs({ page = 1, limit = 20, status, search }: GetJobsParams) {
  const where: Prisma.JobWhereInput = {
    ...(status ? { status } : {}),
    ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
  };

  const [jobs, total] = await prisma.$transaction([
    prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { company: { select: { name: true } }, _count: { select: { applications: true } } },
    }),
    prisma.job.count({ where }),
  ]);

  return { jobs, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export async function getJobById(id: string) {
  return prisma.job.findUnique({
    where: { id },
    include: {
      company: true,
      postedBy: { select: { fullName: true, email: true } },
      applications: { take: 10, orderBy: { createdAt: "desc" }, include: { applicant: { select: { fullName: true } } } },
      _count: { select: { applications: true } },
    },
  });
}
