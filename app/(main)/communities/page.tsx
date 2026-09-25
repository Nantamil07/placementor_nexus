import { requireAuth } from "@/lib/auth";
import { getCommunities } from "@/services/community/get-community";
import { CommunityCard } from "@/components/community/CommunityCard";

export default async function CommunitiesPage() {
  await requireAuth();
  const communities = await getCommunities();

  return (
    <div className="min-h-screen bg-muted/20 pb-16">
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Campus Communities
          </h1>
          <p className="text-sm text-muted-foreground">
            Join topic-focused spaces to discuss interview rounds, system design, resume audits, and job drives.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {communities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      </main>
    </div>
  );
}
