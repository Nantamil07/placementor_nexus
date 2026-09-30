"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deletePost(postId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      error: "Unauthorized. Please sign in.",
    };
  }

  if (!postId?.trim()) {
    return {
      success: false,
      error: "Post ID is required.",
    };
  }

  const profile = await prisma.profile.findUnique({
    where: {
      clerkId: userId,
    },
    select: {
      id: true,
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
      authorId: true,
      isRemoved: true,
    },
  });

  if (!post) {
    return {
      success: false,
      error: "Post not found.",
    };
  }

  if (post.authorId !== profile.id) {
    return {
      success: false,
      error: "You can only delete your own posts.",
    };
  }

  if (post.isRemoved) {
    return {
      success: false,
      error: "This post has already been removed.",
    };
  }

  await prisma.post.update({
    where: {
      id: post.id,
    },
    data: {
      isRemoved: true,
      removedReason: "Deleted by author",
    },
  });

  revalidatePath("/feed");

  return {
    success: true,
  };
}
