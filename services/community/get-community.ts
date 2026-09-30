import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export interface CommunitySummary {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  isPrivate: boolean;
  memberCount: number;
  createdAt: string;
}

export interface CommunityDetails extends CommunitySummary {
  isMember: boolean;
  memberRole: string | null;
}

export async function getCommunities(): Promise<CommunityDetails[]> {
  const { userId } = await auth();

  const profile = userId
    ? await prisma.profile.findUnique({
        where: { clerkId: userId },
        select: { id: true },
      })
    : null;

  const communities = await prisma.community.findMany({
    where: { isRemoved: false },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { members: true } },
      members: profile
        ? {
            where: { profileId: profile.id },
            select: { role: true, isBanned: true },
          }
        : false,
    },
  });

  return communities.map((community) => {
    const membership = profile ? community.members[0] : undefined;
    return {
      id: community.id,
      slug: community.slug,
      name: community.name,
      description: community.description,
      isPrivate: community.isPrivate,
      memberCount: community._count.members,
      createdAt: community.createdAt.toISOString(),
      isMember: Boolean(membership && !membership.isBanned),
      memberRole: membership && !membership.isBanned ? membership.role : null,
    };
  });
}

export async function getCommunityBySlug(
  slug: string
): Promise<CommunityDetails | null> {
  const { userId } = await auth();

  const profile = userId
    ? await prisma.profile.findUnique({
        where: { clerkId: userId },
        select: { id: true },
      })
    : null;

  const community = await prisma.community.findFirst({
    where: { slug: slug.toLowerCase(), isRemoved: false },
    include: {
      _count: { select: { members: true } },
      members: profile
        ? {
            where: { profileId: profile.id },
            select: { role: true, isBanned: true },
          }
        : false,
    },
  });

  if (!community) return null;

  const membership = profile ? community.members[0] : undefined;

  return {
    id: community.id,
    slug: community.slug,
    name: community.name,
    description: community.description,
    isPrivate: community.isPrivate,
    memberCount: community._count.members,
    createdAt: community.createdAt.toISOString(),
    isMember: Boolean(membership && !membership.isBanned),
    memberRole: membership && !membership.isBanned ? membership.role : null,
  };
}
