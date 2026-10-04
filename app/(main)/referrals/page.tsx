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
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold">Referral Hub</h1>
        <p className="mt-3 text-zinc-400">
          Complete your profile before using referrals.
        </p>
      </main>
    );
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
