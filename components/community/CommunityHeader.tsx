"use client";

import { useState } from "react";
import { Community } from "@/services/community/get-community";
import { JoinButton } from "./JoinButton";

interface CommunityHeaderProps {
  community: Community & { isMember: boolean };
}

export function CommunityHeader({ community }: CommunityHeaderProps) {
  const [memberCount, setMemberCount] = useState(community.memberCount);

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
      <div className="h-36 w-full bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 sm:h-44">
        {community.bannerUrl && (
          <img
            src={community.bannerUrl}
            alt={`${community.name} banner`}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="px-6 pb-6 pt-0 sm:px-8">
        <div className="-mt-12 flex flex-col items-start gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-background bg-primary text-3xl font-extrabold text-primary-foreground shadow-md">
              {community.avatarUrl ? (
                <img
                  src={community.avatarUrl}
                  alt={community.name}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                community.name.charAt(0)
              )}
            </div>

            <div className="space-y-0.5">
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {community.name}
              </h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">c/{community.slug}</span>
                <span>•</span>
                <span>{memberCount} members</span>
                <span>•</span>
                <span className="rounded-sm bg-muted px-1.5 py-0.5 font-medium">
                  {community.category}
                </span>
              </div>
            </div>
          </div>

          <JoinButton
            communityId={community.id}
            initialIsMember={community.isMember}
            onCountChange={setMemberCount}
          />
        </div>
      </div>
    </div>
  );
}
