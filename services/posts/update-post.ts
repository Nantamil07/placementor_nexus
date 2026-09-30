"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  updatePostSchema,
  UpdatePostInput,
} from "@/lib/validators/post";

export async function updatePost(
  input: UpdatePostInput
): Promise<{
  success: boolean;
  post?: {
    id: string;
    content: string;
    updatedAt: string;
  };
  error?: string;
}> {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      error: "Unauthorized. Please sign in.",
    };
  }

  const parsed = updatePostSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error:
        parsed.error.issues[0]?.message ??
        "Invalid post data.",
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
      id: parsed.data.postId,
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

  if (post.isRemoved) {
    return {
      success: false,
      error: "This post has been removed.",
    };
  }

  if (post.authorId !== profile.id) {
    return {
      success: false,
      error: "You can only edit your own posts.",
    };
  }

  const updatedPost = await prisma.post.update({
    where: {
      id: post.id,
    },
    data: {
      content: parsed.data.content,
    },
    select: {
      id: true,
      content: true,
      updatedAt: true,
    },
  });

  revalidatePath("/feed");

  return {
    success: true,
    post: {
      id: updatedPost.id,
      content: updatedPost.content,
      updatedAt: updatedPost.updatedAt.toISOString(),
    },
  };
}
