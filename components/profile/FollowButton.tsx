"use client";

import { useState, useTransition } from "react";
import { toggleFollowUser } from "@/services/network/follow-user";

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing?: boolean;
}

export function FollowButton({
  targetUserId,
  initialIsFollowing = false,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggleFollow() {
    setError(null);

    startTransition(async () => {
      const result = await toggleFollowUser(targetUserId);

      if (!result.success) {
        setError(result.error ?? "Unable to update follow status.");
        return;
      }

      setIsFollowing(result.isFollowing);
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleFollow}
        disabled={isPending}
        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
          isFollowing
            ? "border border-border bg-background text-foreground hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
            : "border border-primary text-primary hover:bg-primary/10"
        }`}
      >
        {isPending
          ? "Saving..."
          : isFollowing
            ? "Following"
            : "+ Follow"}
      </button>

      {error && (
        <p className="absolute left-0 top-full z-10 mt-1 w-48 rounded-md border bg-background p-2 text-[10px] text-destructive shadow-sm">
          {error}
        </p>
      )}
    </div>
  );
}
