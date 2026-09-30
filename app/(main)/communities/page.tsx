import { requireAuth } from "@/lib/auth";
import { getCommunities } from "@/services/community/get-community";
import { CommunityCard } from "@/components/community/CommunityCard";
import { CreateCommunityForm } from "@/components/community/CreateCommunityForm";

export default async function CommunitiesPage() {
  await requireAuth();
  const communities = await getCommunities();

  return (
    <div className="min-h-screen bg-muted/20 pb-16">
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Campus Communities</h1>
            <p className="mt-1 text-sm text-muted-foreground">Join focused spaces for placements, interviews, projects, and career discussions.</p>
          </div>
          <CreateCommunityForm />
        </div>

        {communities.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card p-10 text-center text-sm text-muted-foreground">No communities have been created yet.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {communities.map((community) => <CommunityCard key={community.id} community={community} />)}
          </div>
        )}
      </main>
    </div>
  );
}
