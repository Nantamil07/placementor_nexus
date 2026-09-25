import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export async function getUsers({ page = 1, limit = 20, search, role }: GetUsersParams) {
  const where: Prisma.ProfileWhereInput = {
    ...(role ? { role: role as Prisma.ProfileWhereInput["role"] } : {}),
    ...(search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { username: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [users, total] = await prisma.$transaction([
    prisma.profile.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        fullName: true,
        email: true,
        username: true,
        avatarUrl: true,
        role: true,
        isSuspended: true,
        isOnboarded: true,
        createdAt: true,
      },
    }),
    prisma.profile.count({ where }),
  ]);

  return { users, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export async function getUserById(id: string) {
  return prisma.profile.findUnique({
    where: { id },
    include: {
      skills: true,
      education: true,
      projects: true,
      suspensionsRecieved: { orderBy: { createdAt: "desc" }, take: 5 },
      jobApplications: { take: 5, orderBy: { createdAt: "desc" }, include: { job: { select: { title: true } } } },
    },
  });
}
