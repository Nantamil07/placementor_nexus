"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function togglePostBookmark(postId: string): Promise<{
  success: boolean;
  bookmarked: boolean;
  error?: string;
}> {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      bookmarked: false,
      error: "Unauthorized. Please sign in.",
    };
  }

  if (!postId?.trim()) {
    return {
      success: false,
      bookmarked: false,
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
      bookmarked: false,
      error: "Profile not found.",
    };
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
      isRemoved: true,
    },
  });

  if (!post) {
    return {
      success: false,
      bookmarked: false,
      error: "Post not found.",
    };
  }

  if (post.isRemoved) {
    return {
      success: false,
      bookmarked: false,
      error: "This post has been removed.",
    };
  }

  const existingBookmark =
    await prisma.postBookmark.findUnique({
      where: {
        postId_profileId: {
          postId: post.id,
          profileId: profile.id,
        },
      },
    });

  if (existingBookmark) {
    await prisma.postBookmark.delete({
      where: {
        id: existingBookmark.id,
      },
    });

    revalidatePath("/feed");

    return {
      success: true,
      bookmarked: false,
    };
  }

  await prisma.postBookmark.create({
    data: {
      postId: post.id,
      profileId: profile.id,
    },
  });

  revalidatePath("/feed");

  return {
    success: true,
    bookmarked: true,
  };
}
