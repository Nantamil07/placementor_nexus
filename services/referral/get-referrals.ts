import { prisma } from "@/lib/prisma";

import type { ReferralStatus } from "@prisma/client";

export interface ReferralView {
  id: string;
  jobTitle: string;
  jobUrl: string | null;
  resumeUrl: string | null;
  notes: string | null;
  status: ReferralStatus;
  createdAt: string;

  requester: {
    id: string;
    fullName: string;
    username: string;
    avatarUrl: string | null;
  };

  referrer: {
    id: string;
    fullName: string;
    username: string;
    avatarUrl: string | null;
  };

  company: {
    id: string;
    name: string;
  } | null;
}
function mapReferral(r: any): ReferralView {
  return {
    id: r.id,
    jobTitle: r.jobTitle,
    jobUrl: r.jobUrl,
    resumeUrl: r.resumeUrl,
    notes: r.notes,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    company: r.company ? { id: r.company.id, name: r.company.name } : null,
    requester: r.requester,
    referrer: r.referrer,
  };
}

export async function getReferrals(profileId: string) {
  const [sent, received] = await Promise.all([
    prisma.referral.findMany({
      where: { requesterId: profileId },
      orderBy: { createdAt: "desc" },
      include: {
        company: { select: { id: true, name: true } },
        requester: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
        referrer: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
      },
    }),
    prisma.referral.findMany({
      where: { referrerId: profileId },
      orderBy: { createdAt: "desc" },
      include: {
        company: { select: { id: true, name: true } },
        requester: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
        referrer: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
      },
    }),
  ]);

  return { sent: sent.map(mapReferral), received: received.map(mapReferral) };
}

export async function getReferralCandidates(currentProfileId: string) {
  return prisma.profile.findMany({
    where: { id: { not: currentProfileId } },
    orderBy: { fullName: "asc" },
    take: 100,
    select: { id: true, fullName: true, username: true, avatarUrl: true, role: true },
  });
}

export async function getReferralCompanies() {
  return prisma.company.findMany({
    orderBy: { name: "asc" },
    take: 100,
    select: { id: true, name: true },
  });
}
