"use client";

import { useState, useTransition } from "react";
import { toggleCommunityMembership } from "@/services/community/join-community";

export function JoinButton({
  communityId,
  initialIsMember,
  onCountChange,
}: {
  communityId: string;
  initialIsMember: boolean;
  onCountChange?: (count: number) => void;
}) {
  const [isMember, setIsMember] = useState(initialIsMember);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    const previous = isMember;
    setIsMember(!previous);
    startTransition(async () => {
      const result = await toggleCommunityMembership(communityId);
      if (!result.success) setIsMember(previous);
      else {
        setIsMember(result.isMember);
        onCountChange?.(result.memberCount);
      }
    });
  };

  return (
    <button type="button" onClick={toggle} disabled={isPending} className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold disabled:opacity-50 ${isMember ? "border bg-background hover:bg-muted" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
      {isPending ? "..." : isMember ? "Joined" : "Join"}
    </button>
  );
}
