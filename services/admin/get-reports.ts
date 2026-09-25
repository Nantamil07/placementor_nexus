import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface GetReportsParams {
  page?: number;
  limit?: number;
  status?: "PENDING" | "RESOLVED" | "REJECTED";
}

export async function getReports({ page = 1, limit = 20, status }: GetReportsParams) {
  const where: Prisma.ReportWhereInput = { ...(status ? { status } : {}) };

  const [reports, total] = await prisma.$transaction([
    prisma.report.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        reporter: { select: { fullName: true, email: true } },
        resolvedBy: { select: { fullName: true } },
      },
    }),
    prisma.report.count({ where }),
  ]);

  return { reports, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export async function getReportById(id: string) {
  return prisma.report.findUnique({
    where: { id },
    include: {
      reporter: { select: { fullName: true, email: true } },
      resolvedBy: { select: { fullName: true } },
    },
  });
}
