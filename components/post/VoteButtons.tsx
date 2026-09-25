"use client";

import { useState, useTransition } from "react";
import { votePost } from "@/services/posts/vote-post";

interface VoteButtonsProps {
  postId: string;
  initialScore: number;
}

export function VoteButtons({ postId, initialScore }: VoteButtonsProps) {
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<number>(0); // 1 = upvoted, -1 = downvoted, 0 = none
  const [isPending, startTransition] = useTransition();

  const handleVote = (direction: 1 | -1) => {
    const previousScore = score;
    const previousVote = userVote;

    // Optimistic calculation
    let optimisticVote = direction;
    if (previousVote === direction) {
      optimisticVote = 0;
    }
    const diff = optimisticVote - previousVote;
    setScore(Math.max(0, previousScore + diff));
    setUserVote(optimisticVote);

    startTransition(async () => {
      const result = await votePost(postId, direction);
      if (!result.success) {
        setScore(previousScore);
        setUserVote(previousVote);
      } else {
        setScore(result.newScore);
        setUserVote(result.userVote);
      }
    });
  };

  return (
    <div className="flex items-center rounded-lg border bg-muted/40 p-0.5">
      <button
        onClick={() => handleVote(1)}
        disabled={isPending}
        title="Upvote"
        className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold transition-colors ${
          userVote === 1
            ? "bg-primary text-primary-foreground shadow-xs"
            : "text-muted-foreground hover:bg-background hover:text-foreground"
        }`}
      >
        ▲
      </button>

      <span className="px-2 text-xs font-semibold text-foreground min-w-[2rem] text-center">
        {score}
      </span>

      <button
        onClick={() => handleVote(-1)}
        disabled={isPending}
        title="Downvote"
        className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold transition-colors ${
          userVote === -1
            ? "bg-destructive text-destructive-foreground shadow-xs"
            : "text-muted-foreground hover:bg-background hover:text-foreground"
        }`}
      >
        ▼
      </button>
    </div>
  );
}
