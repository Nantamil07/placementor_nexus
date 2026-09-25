import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCommunityBySlug } from "@/services/admin/get-communities";
import CommunityModerationDialog from "@/components/admin/CommunityModerationDialog";

export const dynamic = "force-dynamic";

export default async function AdminCommunityDetailPage({ params }: { params: { slug: string } }) {
  const community = await getCommunityBySlug(params.slug);
  if (!community) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/communities" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to communities
      </Link>

      <div>
        <h1 className="text-xl font-semibold text-white">{community.name}</h1>
        <p className="text-sm text-zinc-500">{community._count.members} members · {community._count.posts} posts</p>
      </div>

      <CommunityModerationDialog
        asPage
        onClose={() => {}}
        community={{
          id: community.id,
          name: community.name,
          posts: community.posts.map((p) => ({
            id: p.id,
            content: p.content,
            authorName: p.author.fullName,
            commentCount: p._count.comments,
          })),
          members: community.members.map((m) => ({
            profileId: m.profile.id,
            fullName: m.profile.fullName,
            email: m.profile.email,
            isBanned: m.isBanned,
          })),
        }}
      />
    </div>
  );
}
