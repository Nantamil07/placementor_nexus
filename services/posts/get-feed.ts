import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface PostAuthor {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string | null;
  role: string;
}

export interface PostCommunity {
  id: string;
  name: string;
  slug: string;
}

export interface PostItem {
  id: string;
  content: string;
  authorId: string;
  author: PostAuthor;
  community?: PostCommunity | null;
  upvotesCount: number;
  commentsCount: number;
  userVote: number;
  isBookmarked: boolean;
  createdAt: string;
}

export interface GetFeedOptions {
  page?: number;
  limit?: number;
  profileId?: string;
  communitySlug?: string;
  sort?: "latest" | "top";
  savedOnly?: boolean;
}

export async function getFeed(
  pageOrOptions: number | GetFeedOptions = 1,
  limitParam = 10,
  profileIdParam?: string
): Promise<{
  posts: PostItem[];
  total: number;
  hasMore: boolean;
}> {
  let page = 1;
  let limit = 10;
  let profileId: string | undefined;
  let communitySlug: string | undefined;
  let sort: "latest" | "top" = "latest";
  let savedOnly = false;

  if (typeof pageOrOptions === "object") {
    page = pageOrOptions.page ?? 1;
    limit = pageOrOptions.limit ?? 10;
    profileId = pageOrOptions.profileId;
    communitySlug = pageOrOptions.communitySlug;
    sort = pageOrOptions.sort ?? "latest";
    savedOnly = Boolean(pageOrOptions.savedOnly);
  } else {
    page = pageOrOptions;
    limit = limitParam;
    profileId = profileIdParam;
  }

  const skip = (page - 1) * limit;

  const where: Prisma.PostWhereInput = {
    isRemoved: false,
    ...(communitySlug ? { community: { slug: communitySlug } } : {}),
    ...(savedOnly && profileId ? { bookmarks: { some: { profileId } } } : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
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
        community: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
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
          ? {
              where: { profileId },
              select: { id: true },
            }
          : false,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    }),
    prisma.post.count({ where }),
  ]);

  let formattedPosts: PostItem[] = posts.map((post) => {
    const upvotesCount = post.votes.reduce(
      (totalVotes, vote) => totalVotes + vote.value,
      0
    );

    const userVote = profileId
      ? post.votes.find((vote) => vote.profileId === profileId)?.value ?? 0
      : 0;

    const isBookmarked = Array.isArray(post.bookmarks) && post.bookmarks.length > 0;

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
      community: post.community,
      upvotesCount,
      commentsCount: post._count.comments,
      userVote,
      isBookmarked,
      createdAt: post.createdAt.toISOString(),
    };
  });

  if (sort === "top") {
    formattedPosts.sort((a, b) => b.upvotesCount - a.upvotesCount);
  }

  return {
    posts: formattedPosts,
    total,
    hasMore: skip + formattedPosts.length < total,
  };
}
