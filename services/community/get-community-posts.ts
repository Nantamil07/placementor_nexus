import { prisma } from "@/lib/prisma";

export async function getCommunityPosts(communityId: string, limit = 20) {
  const posts = await prisma.post.findMany({
    where: { communityId, isRemoved: false },
    orderBy: { createdAt: "desc" },
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
      votes: { select: { value: true } },
      _count: { select: { comments: { where: { isRemoved: false } } } },
    },
  });

  return posts.map((post) => ({
    id: post.id,
    content: post.content,
    authorId: post.authorId,
    author: post.author,
    upvotesCount: post.votes.reduce((sum, vote) => sum + vote.value, 0),
    commentsCount: post._count.comments,
    createdAt: post.createdAt.toISOString(),
  }));
}
