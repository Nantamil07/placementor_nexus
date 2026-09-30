"use client";

import { useState, useTransition } from "react";
import { toggleCommunityMembership } from "@/services/community/join-community";

interface JoinButtonProps {
  communityId: string;
  initialIsMember: boolean;
  onCountChange?: (newCount: number) => void;
}

export function JoinButton({
  communityId,
  initialIsMember,
  onCountChange,
}: JoinButtonProps) {
  const [isMember, setIsMember] = useState(initialIsMember);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const previousState = isMember;
    setIsMember(!previousState);

    startTransition(async () => {
      const res = await toggleCommunityMembership(communityId);
      if (!res.success) {
        setIsMember(previousState);
      } else {
        setIsMember(res.isMember);
        if (onCountChange) onCountChange(res.memberCount);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
        isMember
          ? "border border-border bg-background text-foreground hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      } disabled:opacity-50`}
    >
      {isMember ? "Joined" : "Join"}
    </button>
  );
}
