import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getCommunityBySlug } from "@/services/community/get-community";
import { getCommunityPosts } from "@/services/community/get-community-posts";
import { CommunityHeader } from "@/components/community/CommunityHeader";
import { CommunityPostForm } from "@/components/community/CommunityPostForm";
import { CommunityPostList } from "@/components/community/CommunityPostList";

export default async function CommunitySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAuth();
  const { slug } = await params;
  const community = await getCommunityBySlug(slug);
  if (!community) notFound();

  const posts = await getCommunityPosts(community.id);

  return (
    <div className="min-h-screen bg-muted/20 pb-16">
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <Link href="/communities" className="text-xs text-muted-foreground hover:text-foreground">← Back to communities</Link>

        <CommunityHeader community={community} />

        {!community.isMember ? (
          <div className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">Join this community to start discussions.</div>
        ) : (
          <CommunityPostForm communityId={community.id} />
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <CommunityPostList posts={posts} />
          </section>
          <aside>
            <div className="rounded-xl border bg-card p-5 shadow-xs">
              <h2 className="text-sm font-semibold">About c/{community.slug}</h2>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{community.description || "No description provided."}</p>
              <div className="mt-4 space-y-1 border-t pt-3 text-xs text-muted-foreground">
                <div>Members: <strong className="text-foreground">{community.memberCount}</strong></div>
                <div>Visibility: <strong className="text-foreground">{community.isPrivate ? "Private" : "Public"}</strong></div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
