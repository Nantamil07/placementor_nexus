import { VoteButtons } from "@/components/post/VoteButtons";

type CommunityPost = {
  id: string;
  content: string;
  authorId: string;
  author: {
    id: string;
    fullName: string;
    username: string;
    avatarUrl: string | null;
    role: string;
  };
  upvotesCount: number;
  commentsCount: number;
  createdAt: string;
};

export function CommunityPostList({ posts }: { posts: CommunityPost[] }) {
  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-card p-10 text-center">
        <p className="font-medium">No discussions yet</p>
        <p className="mt-1 text-xs text-muted-foreground">Start the first conversation in this community.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <article key={post.id} className="rounded-xl border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-bold text-primary">
              {post.author.avatarUrl ? <img src={post.author.avatarUrl} alt="" className="h-full w-full object-cover" /> : post.author.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold">{post.author.fullName}</p>
              <p className="text-xs text-muted-foreground">@{post.author.username} · {new Date(post.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed">{post.content}</p>
          <div className="mt-4 flex items-center gap-4 border-t pt-3">
            <VoteButtons postId={post.id} initialScore={post.upvotesCount} />
            <span className="text-xs text-muted-foreground">💬 {post.commentsCount} comments</span>
          </div>
        </article>
      ))}
    </div>
  );
}
