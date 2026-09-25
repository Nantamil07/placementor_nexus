import Link from "next/link";
import { Community } from "@/services/community/get-community";
import { JoinButton } from "./JoinButton";

interface CommunityCardProps {
  community: Community & { isMember: boolean };
}

export function CommunityCard({ community }: CommunityCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-xs transition-shadow hover:shadow-sm">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
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

            <div>
              <Link
                href={`/communities/${community.slug}`}
                className="font-bold text-foreground hover:underline"
              >
                {community.name}
              </Link>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>c/{community.slug}</span>
                <span>•</span>
                <span>{community.memberCount} members</span>
              </div>
            </div>
          </div>

          <JoinButton
            communityId={community.id}
            initialIsMember={community.isMember}
          />
        </div>

        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {community.description}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs">
        <span className="rounded-md bg-muted px-2 py-0.5 font-medium text-muted-foreground">
          {community.category}
        </span>
        <Link
          href={`/communities/${community.slug}`}
          className="font-semibold text-primary hover:underline"
        >
          View Community →
        </Link>
      </div>
    </div>
  );
}
