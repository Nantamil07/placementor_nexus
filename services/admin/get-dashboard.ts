import "server-only";
import { prisma } from "@/lib/prisma";

export interface DashboardStats {
  totalUsers: number;
  students: number;
  alumni: number;
  recruiters: number;
  communities: number;
  posts: number;
  jobs: number;
  applications: number;
  events: number;
  placementSuccessRate: number; // percentage, 0-100
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    totalUsers,
    students,
    alumni,
    recruiters,
    communities,
    posts,
    jobs,
    applications,
    selectedApplications,
    events,
  ] = await prisma.$transaction([
    prisma.profile.count(),
    prisma.profile.count({ where: { role: "STUDENT" } }),
    prisma.profile.count({ where: { role: "ALUMNI" } }),
    prisma.profile.count({ where: { role: "RECRUITER" } }),
    prisma.community.count({ where: { isRemoved: false } }),
    prisma.post.count({ where: { isRemoved: false } }),
    prisma.job.count(),
    prisma.jobApplication.count(),
    prisma.jobApplication.count({ where: { status: "SELECTED" } }),
    prisma.event.count(),
  ]);

  const placementSuccessRate = applications === 0 ? 0 : Math.round((selectedApplications / applications) * 1000) / 10;

  return {
    totalUsers,
    students,
    alumni,
    recruiters,
    communities,
    posts,
    jobs,
    applications,
    events,
    placementSuccessRate,
  };
}
