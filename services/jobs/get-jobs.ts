import { prisma } from "@/lib/prisma";
import type { Job as PrismaJob } from "@prisma/client";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  status: string;
  companyId: string;
}

export async function getJobs(): Promise<Job[]> {
  const jobs = await prisma.job.findMany({
    where: {
      status: "APPROVED",
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company.name,
    location: job.location,
    type: formatJobType(job.type),
    description: job.description,
    status: job.status,
    companyId: job.companyId,
  }));
}

function formatJobType(type: PrismaJob["type"]): string {
  switch (type) {
    case "FULL_TIME":
      return "Full Time";
    case "PART_TIME":
      return "Part Time";
    case "CONTRACT":
      return "Contract";
    default:
      return String(type);
  }
}
