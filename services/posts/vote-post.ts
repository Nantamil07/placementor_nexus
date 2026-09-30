"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function votePost(
  postId: string,
  direction: 1 | -1
): Promise<{
  success: boolean;
  newScore: number;
  userVote: -1 | 0 | 1;
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, newScore: 0, userVote: 0, error: "Unauthorized. Please sign in." };
  }

  if (!postId?.trim() || (direction !== 1 && direction !== -1)) {
    return { success: false, newScore: 0, userVote: 0, error: "Invalid vote." };
  }

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!profile) {
    return { success: false, newScore: 0, userVote: 0, error: "Profile not found." };
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, isRemoved: true },
  });
  if (!post || post.isRemoved) {
    return { success: false, newScore: 0, userVote: 0, error: "Post not found." };
  }

  const existingVote = await prisma.postVote.findUnique({
    where: { postId_profileId: { postId, profileId: profile.id } },
  });

  let userVote: -1 | 0 | 1 = direction;

  if (existingVote) {
    if (existingVote.value === direction) {
      await prisma.postVote.delete({ where: { id: existingVote.id } });
      userVote = 0;
    } else {
      await prisma.postVote.update({
        where: { id: existingVote.id },
        data: { value: direction },
      });
    }
  } else {
    await prisma.postVote.create({
      data: { postId, profileId: profile.id, value: direction },
    });
  }

  const aggregate = await prisma.postVote.aggregate({
    where: { postId },
    _sum: { value: true },
  });

  revalidatePath("/feed");

  return {
    success: true,
    newScore: aggregate._sum.value ?? 0,
    userVote,
  };
}
