"use client";

import { useState, useTransition } from "react";
import { votePost } from "@/services/posts/vote-post";

interface VoteButtonsProps {
  postId: string;
  initialScore: number;
  initialVote?: -1 | 0 | 1;
}

export function VoteButtons({ postId, initialScore, initialVote = 0 }: VoteButtonsProps) {
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<-1 | 0 | 1>(initialVote);
  const [isPending, startTransition] = useTransition();

  const handleVote = (direction: 1 | -1) => {
    const previousScore = score;
    const previousVote = userVote;
    const nextVote: -1 | 0 | 1 = previousVote === direction ? 0 : direction;

    setScore(previousScore + nextVote - previousVote);
    setUserVote(nextVote);

    startTransition(async () => {
      const result = await votePost(postId, direction);
      if (!result.success) {
        setScore(previousScore);
        setUserVote(previousVote);
        return;
      }
      setScore(result.newScore);
      setUserVote(result.userVote);
    });
  };

  return (
    <div className="flex items-center rounded-lg border bg-muted/40 p-0.5" aria-label="Post voting">
      <button
        type="button"
        onClick={() => handleVote(1)}
        disabled={isPending}
        title="Upvote"
        aria-label="Upvote post"
        aria-pressed={userVote === 1}
        className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold transition-colors ${
          userVote === 1
            ? "bg-primary text-primary-foreground shadow-xs"
            : "text-muted-foreground hover:bg-background hover:text-foreground"
        }`}
      >
        ▲
      </button>
      <span className="min-w-[2.5rem] px-2 text-center text-xs font-semibold text-foreground">
        {score}
      </span>
      <button
        type="button"
        onClick={() => handleVote(-1)}
        disabled={isPending}
        title="Downvote"
        aria-label="Downvote post"
        aria-pressed={userVote === -1}
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
