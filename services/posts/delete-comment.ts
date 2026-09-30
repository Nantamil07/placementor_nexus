"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteComment(commentId: string): Promise<{
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

  if (!commentId?.trim()) {
    return {
      success: false,
      error: "Comment ID is required.",
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

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    select: {
      id: true,
      authorId: true,
      isRemoved: true,
    },
  });

  if (!comment) {
    return {
      success: false,
      error: "Comment not found.",
    };
  }

  if (comment.authorId !== profile.id) {
    return {
      success: false,
      error: "You can only delete your own comments.",
    };
  }

  if (comment.isRemoved) {
    return {
      success: false,
      error: "This comment has already been removed.",
    };
  }

  await prisma.comment.update({
    where: {
      id: comment.id,
    },
    data: {
      isRemoved: true,
    },
  });

  revalidatePath("/feed");

  return {
    success: true,
  };
}
