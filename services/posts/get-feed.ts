export interface PostAuthor {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string | null;
  role: string;
}

export interface PostItem {
  id: string;
  content: string;
  authorId: string;
  author: PostAuthor;
  upvotesCount: number;
  commentsCount: number;
  createdAt: string;
}

const globalForFeed = globalThis as unknown as {
  nexusPosts: PostItem[] | undefined;
};

const initialFeed: PostItem[] = [
  {
    id: "post_seed_1",
    content: "🚀 Placements season 2026 has officially kicked off! Make sure your GitHub projects, LeetCode profile, and resume summaries are up to date on Nexus.",
    authorId: "officer_1",
    author: {
      id: "officer_1",
      fullName: "Dr. Evelyn Reed",
      username: "placement_cell",
      avatarUrl: null,
      role: "PLACEMENT_OFFICER",
    },
    upvotesCount: 42,
    commentsCount: 9,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "post_seed_2",
    content: "Just finished my interview with Google for the SWE role! Core focus was on distributed caching, system bottlenecks, and graph traversals. Happy to mentor anyone prepping for upcoming campus rounds.",
    authorId: "alumni_1",
    author: {
      id: "alumni_1",
      fullName: "Kavya Sharma",
      username: "kavya_swe",
      avatarUrl: null,
      role: "ALUMNI",
    },
    upvotesCount: 28,
    commentsCount: 14,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
];

export const feedStore = globalForFeed.nexusPosts ?? initialFeed;
if (!globalForFeed.nexusPosts) {
  globalForFeed.nexusPosts = feedStore;
}

export async function getFeed(page = 1, limit = 10): Promise<{ posts: PostItem[]; total: number; hasMore: boolean }> {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const posts = feedStore.slice(startIndex, endIndex);

  return {
    posts,
    total: feedStore.length,
    hasMore: endIndex < feedStore.length,
  };
}
