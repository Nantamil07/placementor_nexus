"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CommentItem {
  id: string;
  postId: string;
  parentId?: string | null;
  content: string;
  author: {
    id: string;
    fullName: string;
    username: string;
    avatarUrl: string | null;
    role: string;
  };
  createdAt: string;
  replies?: CommentItem[];
}

export async function createComment(
  postId: string,
  content: string,
  parentId?: string | null
): Promise<{
  success: boolean;
  comment?: CommentItem;
  error?: string;
}> {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      error: "Unauthorized. Please sign in.",
    };
  }

  const trimmed = content.trim();

  if (!trimmed) {
    return {
      success: false,
      error: "Comment cannot be empty.",
    };
  }

  const profile = await prisma.profile.findUnique({
    where: {
      clerkId: userId,
    },
    select: {
      id: true,
      fullName: true,
      username: true,
      avatarUrl: true,
      role: true,
    },
  });

  if (!profile) {
    return {
      success: false,
      error: "Profile not found.",
    };
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
    },
  });

  if (!post) {
    return {
      success: false,
      error: "Post not found.",
    };
  }

  if (parentId) {
    const parentComment = await prisma.comment.findFirst({
      where: {
        id: parentId,
        postId,
        isRemoved: false,
      },
      select: {
        id: true,
      },
    });

    if (!parentComment) {
      return {
        success: false,
        error: "Parent comment not found.",
      };
    }
  }

  const comment = await prisma.comment.create({
    data: {
      postId,
      authorId: profile.id,
      parentId: parentId ?? null,
      content: trimmed,
    },
    select: {
      id: true,
      postId: true,
      parentId: true,
      content: true,
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
    },
  });

  revalidatePath("/feed");

  return {
    success: true,
    comment: {
      id: comment.id,
      postId: comment.postId,
      parentId: comment.parentId,
      content: comment.content,
      author: {
        id: comment.author.id,
        fullName: comment.author.fullName,
        username: comment.author.username,
        avatarUrl: comment.author.avatarUrl,
        role: comment.author.role,
      },
      createdAt: comment.createdAt.toISOString(),
      replies: [],
    },
  };
}

export async function getCommentsForPost(
  postId: string
): Promise<CommentItem[]> {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
      isRemoved: false,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      postId: true,
      parentId: true,
      content: true,
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
    },
  });

  const commentMap = new Map<string, CommentItem>();
  const topLevel: CommentItem[] = [];

  for (const comment of comments) {
    commentMap.set(comment.id, {
      id: comment.id,
      postId: comment.postId,
      parentId: comment.parentId,
      content: comment.content,
      author: {
        id: comment.author.id,
        fullName: comment.author.fullName,
        username: comment.author.username,
        avatarUrl: comment.author.avatarUrl,
        role: comment.author.role,
      },
      createdAt: comment.createdAt.toISOString(),
      replies: [],
    });
  }

  for (const comment of comments) {
    const item = commentMap.get(comment.id)!;

    if (comment.parentId && commentMap.has(comment.parentId)) {
      commentMap.get(comment.parentId)!.replies!.push(item);
    } else {
      topLevel.push(item);
    }
  }

  return topLevel;
}
