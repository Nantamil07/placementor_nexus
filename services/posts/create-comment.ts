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

const authorSelect = {
  id: true,
  fullName: true,
  username: true,
  avatarUrl: true,
  role: true,
} as const;

export async function createComment(
  postId: string,
  content: string,
  parentId?: string | null
): Promise<{ success: boolean; comment?: CommentItem; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized. Please sign in." };

  const trimmed = content.trim();
  if (!trimmed) return { success: false, error: "Comment cannot be empty." };
  if (trimmed.length > 2000) return { success: false, error: "Comment is too long." };

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: authorSelect,
  });
  if (!profile) return { success: false, error: "Profile not found." };

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, isRemoved: true },
  });
  if (!post || post.isRemoved) return { success: false, error: "Post not found." };

  if (parentId) {
    const parent = await prisma.comment.findUnique({
      where: { id: parentId },
      select: { id: true, postId: true, isRemoved: true },
    });
    if (!parent || parent.postId !== postId || parent.isRemoved) {
      return { success: false, error: "Parent comment not found." };
    }
  }

  const comment = await prisma.comment.create({
    data: {
      postId,
      parentId: parentId ?? null,
      authorId: profile.id,
      content: trimmed,
    },
    select: {
      id: true,
      postId: true,
      parentId: true,
      content: true,
      createdAt: true,
      author: { select: authorSelect },
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
      author: comment.author,
      createdAt: comment.createdAt.toISOString(),
      replies: [],
    },
  };
}

export async function getCommentsForPost(postId: string): Promise<CommentItem[]> {
  const comments = await prisma.comment.findMany({
    where: { postId, isRemoved: false },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      postId: true,
      parentId: true,
      content: true,
      createdAt: true,
      author: { select: authorSelect },
    },
  });

  const map = new Map<string, CommentItem>();
  for (const comment of comments) {
    map.set(comment.id, {
      id: comment.id,
      postId: comment.postId,
      parentId: comment.parentId,
      content: comment.content,
      author: comment.author,
      createdAt: comment.createdAt.toISOString(),
      replies: [],
    });
  }

  const topLevel: CommentItem[] = [];
  for (const comment of comments) {
    const item = map.get(comment.id)!;
    if (comment.parentId && map.has(comment.parentId)) {
      map.get(comment.parentId)!.replies!.push(item);
    } else {
      topLevel.push(item);
    }
  }

  return topLevel;
}
