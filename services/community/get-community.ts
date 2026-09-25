import { auth } from "@clerk/nextjs/server";

export interface Community {
  id: string;
  slug: string;
  name: string;
  description: string;
  bannerUrl?: string | null;
  avatarUrl?: string | null;
  memberCount: number;
  category: string;
  createdAt: string;
}

const globalForCommunities = globalThis as unknown as {
  nexusCommunities: Community[] | undefined;
  nexusCommunityMembers: Set<string> | undefined; // `${userId}_${communityId}`
};

export const initialCommunities: Community[] = [
  {
    id: "comm_1",
    slug: "interview-prep",
    name: "Tech Interview Prep",
    description: "DSA patterns, mock interview pairs, LeetCode discussion, and system design drills.",
    bannerUrl: null,
    avatarUrl: null,
    memberCount: 342,
    category: "Preparation",
    createdAt: new Date("2026-01-01").toISOString(),
  },
  {
    id: "comm_2",
    slug: "system-design",
    name: "System Design Hub",
    description: "High-level architecture, scalability trade-offs, microservices, and database indexing.",
    bannerUrl: null,
    avatarUrl: null,
    memberCount: 215,
    category: "Architecture",
    createdAt: new Date("2026-01-05").toISOString(),
  },
  {
    id: "comm_3",
    slug: "resume-roast",
    name: "Resume & Portfolio Clinic",
    description: "Get constructive, brutal feedback on your resume from seniors, mentors, and recruiters.",
    bannerUrl: null,
    avatarUrl: null,
    memberCount: 189,
    category: "Career",
    createdAt: new Date("2026-01-10").toISOString(),
  },
  {
    id: "comm_4",
    slug: "off-campus",
    name: "Off-Campus Opportunities",
    description: "Verified referral postings, startup openings, and early-career remote roles.",
    bannerUrl: null,
    avatarUrl: null,
    memberCount: 410,
    category: "Jobs",
    createdAt: new Date("2026-01-12").toISOString(),
  },
];

export const communitiesStore = globalForCommunities.nexusCommunities ?? initialCommunities;
export const communityMembersStore = globalForCommunities.nexusCommunityMembers ?? new Set<string>();

if (!globalForCommunities.nexusCommunities) globalForCommunities.nexusCommunities = communitiesStore;
if (!globalForCommunities.nexusCommunityMembers) globalForCommunities.nexusCommunityMembers = communityMembersStore;

export async function getCommunities(): Promise<(Community & { isMember: boolean })[]> {
  const { userId } = await auth();

  return communitiesStore.map((comm) => ({
    ...comm,
    isMember: userId ? communityMembersStore.has(`${userId}_${comm.id}`) : false,
  }));
}

export async function getCommunityBySlug(slug: string): Promise<(Community & { isMember: boolean }) | null> {
  const { userId } = await auth();
  const comm = communitiesStore.find((c) => c.slug === slug);
  if (!comm) return null;

  return {
    ...comm,
    isMember: userId ? communityMembersStore.has(`${userId}_${comm.id}`) : false,
  };
}
