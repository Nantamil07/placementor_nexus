"use client";

import { useState, useTransition } from "react";
import { votePost } from "@/services/posts/vote-post";

interface VoteButtonsProps {
  postId: string;
  initialScore: number;
  initialVote: -1 | 0 | 1;
}

export function VoteButtons({
  postId,
  initialScore,
  initialVote,
}: VoteButtonsProps) {
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<-1 | 0 | 1>(initialVote);
  const [isPending, startTransition] = useTransition();

  const handleVote = (direction: 1 | -1) => {
    if (isPending) return;

    const previousVote = userVote;
    const previousScore = score;

    let optimisticVote: -1 | 0 | 1 = direction;
    let scoreChange = 0;

    if (userVote === direction) {
      optimisticVote = 0;
      scoreChange = -direction;
    } else if (userVote === 0) {
      scoreChange = direction;
    } else {
      scoreChange = direction * 2;
    }

    setUserVote(optimisticVote);
    setScore((current) => current + scoreChange);

    startTransition(async () => {
      const result = await votePost(postId, direction);

      if (!result.success) {
        setUserVote(previousVote);
        setScore(previousScore);
        return;
      }

      setUserVote(result.userVote as -1 | 0 | 1);
      setScore(result.newScore);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => handleVote(1)}
        disabled={isPending}
        className={`rounded-md px-3 py-1.5 text-sm transition ${
          userVote === 1
            ? "bg-orange-100 text-orange-600"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        ▲
      </button>

      <span className="min-w-[2rem] text-center text-sm font-medium">
        {score}
      </span>

      <button
        type="button"
        onClick={() => handleVote(-1)}
        disabled={isPending}
        className={`rounded-md px-3 py-1.5 text-sm transition ${
          userVote === -1
            ? "bg-blue-100 text-blue-600"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        ▼
      </button>
    </div>
  );
}
