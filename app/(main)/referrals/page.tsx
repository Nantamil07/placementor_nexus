import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getReferralCandidates, getReferralCompanies, getReferrals } from "@/services/referral/get-referrals";
import { ReferralRequestForm } from "@/components/referral/ReferralRequestForm";
import { ReferralCard } from "@/components/referral/ReferralCard";

export default async function ReferralsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const profile = await prisma.profile.findUnique({ where: { clerkId: userId }, select: { id: true } });
  if (!profile) redirect("/setup-profile");
  const [{ sent, received }, candidates, companies] = await Promise.all([
    getReferrals(profile.id),
    getReferralCandidates(profile.id),
    getReferralCompanies(),
  ]);
  return <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
    <header><h1 className="text-2xl font-bold tracking-tight">Referrals</h1><p className="mt-1 text-sm text-muted-foreground">Request and manage professional referrals for jobs and internships.</p></header>
    <ReferralRequestForm candidates={candidates} companies={companies} />
    <section className="grid gap-8 lg:grid-cols-2">
      <div><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Incoming requests</h2><span className="text-xs text-muted-foreground">{received.length}</span></div><div className="space-y-3">{received.length ? received.map(r => <ReferralCard key={r.id} referral={r} mode="received" />) : <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">No incoming referral requests.</p>}</div></div>
      <div><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Sent requests</h2><span className="text-xs text-muted-foreground">{sent.length}</span></div><div className="space-y-3">{sent.length ? sent.map(r => <ReferralCard key={r.id} referral={r} mode="sent" />) : <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">No referral requests sent yet.</p>}</div></div>
    </section>
  </main>;
}
