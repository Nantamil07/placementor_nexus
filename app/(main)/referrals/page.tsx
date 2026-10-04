import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getReferrals,
  getReferralCandidates,
  getReferralCompanies,
} from "@/services/referral/get-referrals";
import ReferralsClient from "@/components/referral/ReferralsClient";

export default async function ReferralsPage() {
  const { userId } = await requireAuth();

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!profile) {
    redirect("/setup-profile");
    return null;
  }

  const [referrals, candidates, companies] = await Promise.all([
    getReferrals(profile.id),
    getReferralCandidates(profile.id),
    getReferralCompanies(),
  ]);

  return (
    <ReferralsClient
      sent={referrals.sent}
      received={referrals.received}
      candidates={candidates}
      companies={companies}
    />
  );
}
