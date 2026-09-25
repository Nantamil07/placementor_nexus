import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface GetCommunitiesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getCommunities({ page = 1, limit = 20, search }: GetCommunitiesParams) {
  const where: Prisma.CommunityWhereInput = {
    ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
  };

  const [communities, total] = await prisma.$transaction([
    prisma.community.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { _count: { select: { members: true, posts: true } } },
    }),
    prisma.community.count({ where }),
  ]);

  return { communities, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export async function getCommunityBySlug(slug: string) {
  return prisma.community.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { isRemoved: false },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { author: { select: { fullName: true } }, _count: { select: { comments: true } } },
      },
      members: {
        orderBy: { joinedAt: "desc" },
        take: 50,
        include: { profile: { select: { id: true, fullName: true, email: true, avatarUrl: true } } },
      },
      _count: { select: { members: true, posts: true } },
    },
  });
}
