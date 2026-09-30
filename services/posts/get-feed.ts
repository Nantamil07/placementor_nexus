import { prisma } from "@/lib/prisma";

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
  userVote: -1 | 0 | 1;
  isBookmarked: boolean;
  createdAt: string;
}

export async function getFeed(page = 1, limit = 10, profileId?: string) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(1, limit), 50);
  const skip = (safePage - 1) * safeLimit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { isRemoved: false },
      orderBy: { createdAt: "desc" },
      skip,
      take: safeLimit,
      select: {
        id: true,
        content: true,
        authorId: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            role: true,
          },
        },
        votes: {
          select: {
            value: true,
            profileId: true,
          },
        },
        bookmarks: profileId
          ? { where: { profileId }, select: { profileId: true } }
          : { select: { profileId: true }, take: 0 },
        _count: {
          select: {
            comments: { where: { isRemoved: false } },
          },
        },
      },
    }),
    prisma.post.count({ where: { isRemoved: false } }),
  ]);

  const formattedPosts: PostItem[] = posts.map((post) => {
    const score = post.votes.reduce((sum, vote) => sum + vote.value, 0);
    const currentVote = profileId
      ? post.votes.find((vote) => vote.profileId === profileId)?.value ?? 0
      : 0;

    return {
      id: post.id,
      content: post.content,
      authorId: post.authorId,
      author: {
        id: post.author.id,
        fullName: post.author.fullName,
        username: post.author.username,
        avatarUrl: post.author.avatarUrl,
        role: post.author.role,
      },
      upvotesCount: score,
      commentsCount: post._count.comments,
      userVote: currentVote as -1 | 0 | 1,
      isBookmarked: post.bookmarks.length > 0,
      createdAt: post.createdAt.toISOString(),
    };
  });

  return {
    posts: formattedPosts,
    total,
    hasMore: skip + formattedPosts.length < total,
  };
}
