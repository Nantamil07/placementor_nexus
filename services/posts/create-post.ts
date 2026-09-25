"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createPostSchema, CreatePostInput } from "@/lib/validators/post";
import { feedStore, PostItem } from "./get-feed";

export async function createPost(input: CreatePostInput): Promise<{
  success: boolean;
  post?: PostItem;
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized. Please sign in." };
  }

  const parsed = createPostSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      fullName: true,
      username: true,
      avatarUrl: true,
      role: true,
    },
  });

  if (!profile) {
    return { success: false, error: "Profile not found. Please complete onboarding." };
  }

  const newPost: PostItem = {
    id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    content: parsed.data.content,
    authorId: profile.id,
    author: {
      id: profile.id,
      fullName: profile.fullName,
      username: profile.username,
      avatarUrl: profile.avatarUrl,
      role: profile.role,
    },
    upvotesCount: 0,
    commentsCount: 0,
    createdAt: new Date().toISOString(),
  };

  feedStore.unshift(newPost);
  revalidatePath("/feed");

  return { success: true, post: newPost };
}
