"use client";

import { useState, useTransition } from "react";
import { toggleCompanyFollow } from "@/services/company/follow-company";

export function CompanyFollowButton({ companyId, initialFollowing }: { companyId: string; initialFollowing: boolean }) {
  const [following, setFollowing] = useState(initialFollowing);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await toggleCompanyFollow(companyId);
      if (result.success) setFollowing(result.following);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="rounded-lg border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-50"
    >
      {isPending ? "Saving..." : following ? "Following" : "Follow"}
    </button>
  );
}
