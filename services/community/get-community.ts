import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export interface Community {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  bannerUrl?: string | null;
  avatarUrl?: string | null;
  memberCount: number;
  category: string;
  createdAt: string;
}

export async function getCommunities(): Promise<(Community & { isMember: boolean })[]> {
  const { userId } = await auth();

  let currentProfileId: string | null = null;
  if (userId) {
    const profile = await prisma.profile.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });
    currentProfileId = profile?.id ?? null;
  }

  const communities = await prisma.community.findMany({
    where: { isRemoved: false },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          members: {
            where: { isBanned: false },
          },
        },
      },
      members: currentProfileId
        ? {
            where: {
              profileId: currentProfileId,
              isBanned: false,
            },
            select: { id: true },
          }
        : false,
    },
  });

  return communities.map((comm) => ({
    id: comm.id,
    slug: comm.slug,
    name: comm.name,
    description: comm.description ?? "",
    bannerUrl: null,
    avatarUrl: null,
    memberCount: comm._count.members,
    category: "General",
    createdAt: comm.createdAt.toISOString(),
    isMember: Array.isArray(comm.members) && comm.members.length > 0,
  }));
}

export async function getCommunityBySlug(slug: string): Promise<(Community & { isMember: boolean }) | null> {
  const { userId } = await auth();

  let currentProfileId: string | null = null;
  if (userId) {
    const profile = await prisma.profile.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });
    currentProfileId = profile?.id ?? null;
  }

  const comm = await prisma.community.findFirst({
    where: { slug, isRemoved: false },
    include: {
      _count: {
        select: {
          members: {
            where: { isBanned: false },
          },
        },
      },
      members: currentProfileId
        ? {
            where: {
              profileId: currentProfileId,
              isBanned: false,
            },
            select: { id: true },
          }
        : false,
    },
  });

  if (!comm) return null;

  return {
    id: comm.id,
    slug: comm.slug,
    name: comm.name,
    description: comm.description ?? "",
    bannerUrl: null,
    avatarUrl: null,
    memberCount: comm._count.members,
    category: "General",
    createdAt: comm.createdAt.toISOString(),
    isMember: Array.isArray(comm.members) && comm.members.length > 0,
  };
}
