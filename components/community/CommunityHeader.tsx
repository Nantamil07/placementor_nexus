"use client";

import { JoinButton } from "./JoinButton";

interface CommunityHeaderProps {
  community: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    isPrivate: boolean;
    memberCount: number;
    isMember: boolean;
    role?: string | null;
  };
}

export function CommunityHeader({ community }: CommunityHeaderProps) {
  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-muted" />

      <div className="relative px-5 pb-5">
        <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border-4 border-card bg-primary/10 text-2xl font-bold text-primary shadow-sm">
              {community.name.charAt(0).toUpperCase()}
            </div>

            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">
                  {community.name}
                </h1>

                {community.isPrivate && (
                  <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    Private
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {community.memberCount}{" "}
                {community.memberCount === 1 ? "member" : "members"}
              </p>
            </div>
          </div>

          <JoinButton
            communityId={community.id}
            initialIsMember={community.isMember}
          />
        </div>

        {community.description && (
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {community.description}
          </p>
        )}
      </div>
    </section>
  );
}
