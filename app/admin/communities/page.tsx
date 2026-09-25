import { getCommunities } from "@/services/admin/get-communities";
import CommunityTable from "@/components/admin/CommunityTable";

export const dynamic = "force-dynamic";

export default async function AdminCommunitiesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const page = Number(searchParams.page ?? "1") || 1;
  const { communities } = await getCommunities({ page, search: searchParams.search });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Communities</h1>
        <p className="text-sm text-zinc-500">Moderate posts and members, or remove a community entirely.</p>
      </div>
      <CommunityTable
        communities={communities.map((c) => ({
          id: c.id,
          slug: c.slug,
          name: c.name,
          isPrivate: c.isPrivate,
          isRemoved: c.isRemoved,
          memberCount: c._count.members,
          postCount: c._count.posts,
        }))}
      />
    </div>
  );
}
