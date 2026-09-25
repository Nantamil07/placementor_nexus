"use server";

import { auth } from "@clerk/nextjs/server";
import { feedStore } from "./get-feed";

interface VoteRecord {
  [key: string]: number; // key: `${userId}_${postId}` -> value: 1 | -1
}

const globalForVotes = globalThis as unknown as {
  nexusVotes: VoteRecord | undefined;
};

const votesStore: VoteRecord = globalForVotes.nexusVotes ?? {};
if (!globalForVotes.nexusVotes) {
  globalForVotes.nexusVotes = votesStore;
}

export async function votePost(
  postId: string,
  direction: 1 | -1
): Promise<{ success: boolean; newScore: number; userVote: number; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, newScore: 0, userVote: 0, error: "Unauthorized" };
  }

  const post = feedStore.find((p) => p.id === postId);
  if (!post) {
    return { success: false, newScore: 0, userVote: 0, error: "Post not found" };
  }

  const voteKey = `${userId}_${postId}`;
  const previousVote = votesStore[voteKey] ?? 0;
  let nextVote = direction;

  // Toggle off if clicking the same vote again
  if (previousVote === direction) {
    nextVote = 0;
    delete votesStore[voteKey];
  } else {
    votesStore[voteKey] = nextVote;
  }

  const voteDiff = nextVote - previousVote;
  post.upvotesCount = Math.max(0, post.upvotesCount + voteDiff);

  return {
    success: true,
    newScore: post.upvotesCount,
    userVote: nextVote,
  };
}
