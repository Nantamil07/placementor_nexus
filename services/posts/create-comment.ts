"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { feedStore } from "./get-feed";

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

const globalForComments = globalThis as unknown as {
  nexusComments: CommentItem[] | undefined;
};

export const commentsStore: CommentItem[] = globalForComments.nexusComments ?? [];
if (!globalForComments.nexusComments) {
  globalForComments.nexusComments = commentsStore;
}

export async function createComment(
  postId: string,
  content: string,
  parentId?: string | null
): Promise<{ success: boolean; comment?: CommentItem; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized. Please sign in." };
  }

  const trimmed = content.trim();
  if (!trimmed) {
    return { success: false, error: "Comment cannot be empty." };
  }

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true, fullName: true, username: true, avatarUrl: true, role: true },
  });

  if (!profile) {
    return { success: false, error: "Profile not found." };
  }

  const newComment: CommentItem = {
    id: `comm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    postId,
    parentId: parentId || null,
    content: trimmed,
    author: {
      id: profile.id,
      fullName: profile.fullName,
      username: profile.username,
      avatarUrl: profile.avatarUrl,
      role: profile.role,
    },
    createdAt: new Date().toISOString(),
    replies: [],
  };

  commentsStore.push(newComment);

  const post = feedStore.find((p) => p.id === postId);
  if (post) {
    post.commentsCount += 1;
  }

  revalidatePath("/feed");
  return { success: true, comment: newComment };
}

export async function getCommentsForPost(postId: string): Promise<CommentItem[]> {
  const postComments = commentsStore.filter((c) => c.postId === postId);
  const commentMap = new Map<string, CommentItem>();
  const topLevel: CommentItem[] = [];

  postComments.forEach((c) => {
    commentMap.set(c.id, { ...c, replies: [] });
  });

  postComments.forEach((c) => {
    const item = commentMap.get(c.id)!;
    if (c.parentId && commentMap.has(c.parentId)) {
      commentMap.get(c.parentId)!.replies!.push(item);
    } else {
      topLevel.push(item);
    }
  });

  return topLevel;
}
