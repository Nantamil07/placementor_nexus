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
  userVote: number;
  createdAt: string;
}

export async function getFeed(
  page = 1,
  limit = 10,
  profileId?: string
): Promise<{
  posts: PostItem[];
  total: number;
  hasMore: boolean;
}> {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        isRemoved: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
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

        _count: {
          select: {
            comments: true,
          },
        },
      },
    }),

    prisma.post.count({
      where: {
        isRemoved: false,
      },
    }),
  ]);

  const formattedPosts: PostItem[] = posts.map((post) => {
    const upvotesCount = post.votes.reduce(
      (total, vote) => total + vote.value,
      0
    );

    const userVote =
      profileId
        ? post.votes.find(
            (vote) => vote.profileId === profileId
          )?.value ?? 0
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

      upvotesCount,
      commentsCount: post._count.comments,
      userVote,
      createdAt: post.createdAt.toISOString(),
    };
  });

  return {
    posts: formattedPosts,
    total,
    hasMore: skip + formattedPosts.length < total,
  };
}
