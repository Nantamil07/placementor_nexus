import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getFeed } from "@/services/posts/get-feed";
import { CreatePost } from "@/components/post/CreatePost";
import { PostCard } from "@/components/post/PostCard";

export default async function FeedPage() {
  const session = await requireAuth();

  const profile = await prisma.profile.findUnique({
    where: { clerkId: session.userId },
  });

  if (!profile || !profile.isOnboarded) {
    redirect("/setup-profile");
  }

  const { posts, hasMore } = await getFeed(1, 10, profile.id);

  return (
    <div className="pb-16">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <CreatePost
              authorName={profile.fullName}
              avatarUrl={profile.avatarUrl}
            />

            <div className="space-y-4">
              {posts.map((post) => (
  <PostCard
    key={post.id}
    post={post}
    currentProfileId={profile.id}
  />
))}
            </div>

            {hasMore && (
              <div className="text-center pt-4">
                <button className="rounded-lg border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">
                  Load More Posts
                </button>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border bg-card p-5 shadow-xs">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Placement Bulletins
              </h3>
              <ul className="mt-3 space-y-3 text-xs">
                <li className="border-b pb-2">
                  <span className="font-bold text-foreground">Amazon On-Campus Drive:</span>
                  <p className="text-muted-foreground">Registration closes this Friday at 5:00 PM.</p>
                </li>
                <li className="border-b pb-2">
                  <span className="font-bold text-foreground">Mock Technical Interviews:</span>
                  <p className="text-muted-foreground">Slots open with alumni mentors this weekend.</p>
                </li>
                <li>
                  <span className="font-bold text-foreground">Resume Review Clinic:</span>
                  <p className="text-muted-foreground">Get ATS feedback from recruiters.</p>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
