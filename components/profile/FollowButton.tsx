"use client";

import { useState, useTransition } from "react";
import { toggleFollowUser } from "@/services/network/follow-user";

export function FollowButton({ targetUserId, initialIsFollowing = false }: { targetUserId: string; initialIsFollowing?: boolean }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();
  const toggle = () => startTransition(async () => {
    const result = await toggleFollowUser(targetUserId);
    if (result.success) setIsFollowing(result.isFollowing);
  });
  return <button onClick={toggle} disabled={isPending} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${isFollowing ? "border border-border bg-background text-foreground" : "border border-primary text-primary hover:bg-primary/10"}`}>{isFollowing ? "Following" : "+ Follow"}</button>;
}
