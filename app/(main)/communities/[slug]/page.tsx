import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getCommunityBySlug } from "@/services/community/get-community";
import { getCommunityPosts } from "@/services/community/get-community-posts";
import { CommunityHeader } from "@/components/community/CommunityHeader";
import { CommunityPostForm } from "@/components/community/CommunityPostForm";
import { CommunityPostList } from "@/components/community/CommunityPostList";

interface CommunitySlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CommunitySlugPage({ params }: CommunitySlugPageProps) {
  await requireAuth();
  const { slug } = await params;
  const community = await getCommunityBySlug(slug);

  if (!community) {
    notFound();
  }

  const posts = await getCommunityPosts(community.id);

  return (
    <div className="min-h-screen bg-muted/20 pb-16">
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/communities" className="hover:text-foreground">
            ← Back to all communities
          </Link>
        </div>

        <CommunityHeader community={community} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <CommunityPostForm communityId={community.id} />
            <CommunityPostList posts={posts} />
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border bg-card p-5 shadow-xs">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                About c/{community.slug}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-foreground">
                {community.description || "No description provided for this community."}
              </p>
              <div className="mt-4 border-t pt-3 text-xs text-muted-foreground space-y-1">
                <div>Members: <span className="font-semibold text-foreground">{community.memberCount}</span></div>
                <div>Category: <span className="font-semibold text-foreground">{community.category}</span></div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
