import Link from "next/link";
import { CommunityDetails } from "@/services/community/get-community";
import { JoinButton } from "./JoinButton";

export function CommunityCard({ community }: { community: CommunityDetails }) {
  return (
    <article className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-xs">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/communities/${community.slug}`} className="font-bold hover:underline">{community.name}</Link>
            <p className="mt-1 text-xs text-muted-foreground">
              c/{community.slug} · {community.memberCount} members{community.isPrivate ? " · Private" : ""}
            </p>
          </div>
          <JoinButton communityId={community.id} initialIsMember={community.isMember} />
        </div>
        <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {community.description || "No description provided."}
        </p>
      </div>
      <div className="mt-4 border-t pt-3">
        <Link href={`/communities/${community.slug}`} className="text-xs font-semibold text-primary hover:underline">View community →</Link>
      </div>
    </article>
  );
}
