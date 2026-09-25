"use client";

import { useState } from "react";

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing?: boolean;
}

export function FollowButton({
  targetUserId: _targetUserId,
  initialIsFollowing = false,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  const toggleFollow = () => {
    setIsFollowing((prev) => !prev);
  };

  return (
    <button
      onClick={toggleFollow}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        isFollowing
          ? "border border-border bg-background text-foreground hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
          : "border border-primary text-primary hover:bg-primary/10"
      }`}
    >
      {isFollowing ? "Following" : "+ Follow"}
    </button>
  );
}
