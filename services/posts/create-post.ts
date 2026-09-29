"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  createPostSchema,
  CreatePostInput,
} from "@/lib/validators/post";

export async function createPost(input: CreatePostInput): Promise<{
  success: boolean;
  post?: {
    id: string;
    content: string;
    authorId: string;
    author: {
      id: string;
      fullName: string;
      username: string;
      avatarUrl: string | null;
      role: string;
    };
    upvotesCount: number;
    commentsCount: number;
    createdAt: string;
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

  const parsed = createPostSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
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
      error: "Profile not found. Please complete onboarding.",
    };
  }

  const post = await prisma.post.create({
    data: {
      content: parsed.data.content,
      authorId: profile.id,
    },
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
      _count: {
        select: {
          comments: true,
          votes: true,
        },
      },
    },
  });

  revalidatePath("/feed");

  return {
    success: true,
    post: {
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
      upvotesCount: post._count.votes,
      commentsCount: post._count.comments,
      createdAt: post.createdAt.toISOString(),
    },
  };
}
