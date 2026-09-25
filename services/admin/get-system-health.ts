import "server-only";
import { prisma } from "@/lib/prisma";

export interface SystemHealth {
  databaseOk: boolean;
  pendingJobs: number;
  pendingEvents: number;
  pendingReports: number;
  activeSuspensions: number;
}

export async function getSystemHealth(): Promise<SystemHealth> {
  let databaseOk = true;
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    databaseOk = false;
  }

  const [pendingJobs, pendingEvents, pendingReports, activeSuspensions] = await prisma.$transaction([
    prisma.job.count({ where: { status: "PENDING" } }),
    prisma.event.count({ where: { status: "PENDING" } }),
    prisma.report.count({ where: { status: "PENDING" } }),
    prisma.userSuspension.count({ where: { isActive: true } }),
  ]);

  return { databaseOk, pendingJobs, pendingEvents, pendingReports, activeSuspensions };
}
