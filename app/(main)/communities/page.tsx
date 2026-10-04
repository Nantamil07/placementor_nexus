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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Campus Communities
            </h1>
            <p className="text-sm text-muted-foreground">
              Join topic-focused spaces to discuss interview rounds, system design, resume audits, and job drives.
            </p>
          </div>
          <CreateCommunityForm />
        </div>

        {communities.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card p-12 text-center">
            <h2 className="text-base font-semibold text-foreground">No communities yet</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Be the first to create a topic space for your campus or specialization.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {communities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
