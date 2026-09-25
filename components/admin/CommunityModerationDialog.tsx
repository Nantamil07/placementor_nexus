"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, Trash2, Ban, ShieldCheck } from "lucide-react";
import { removePost } from "@/services/admin/remove-community";
import { banCommunityUser, unbanCommunityUser } from "@/services/admin/ban-community-user";

export interface CommunityModerationData {
  id: string;
  name: string;
  posts: { id: string; content: string; authorName: string; commentCount: number }[];
  members: { profileId: string; fullName: string; email: string; isBanned: boolean }[];
}

interface CommunityModerationDialogProps {
  community: CommunityModerationData;
  onClose: () => void;
  /** Render as a static panel (used on the community detail page) instead of a modal overlay. */
  asPage?: boolean;
}

export default function CommunityModerationDialog({ community, onClose, asPage = false }: CommunityModerationDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRemovePost(postId: string) {
    if (!confirm("Remove this post from the community?")) return;
    startTransition(async () => {
      await removePost(postId, "Removed via admin moderation");
      router.refresh();
    });
  }

  function handleToggleBan(profileId: string, isBanned: boolean) {
    startTransition(async () => {
      if (isBanned) await unbanCommunityUser(community.id, profileId);
      else await banCommunityUser(community.id, profileId);
      router.refresh();
    });
  }

  const content = (
    <div
      className={
        asPage
          ? "rounded-xl border border-zinc-800 bg-zinc-900 p-6"
          : "max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900 p-6"
      }
      onClick={(e) => e.stopPropagation()}
    >
      {!asPage && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Moderate: {community.name}</h3>
          <button onClick={onClose} className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

        <div className="mb-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">Recent posts</p>
          <ul className="space-y-2">
            {community.posts.map((post) => (
              <li key={post.id} className="flex items-start justify-between gap-3 rounded-md border border-zinc-800 p-3 text-sm">
                <div>
                  <p className="text-zinc-200">{post.content}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {post.authorName} · {post.commentCount} comments
                  </p>
                </div>
                <button
                  disabled={isPending}
                  onClick={() => handleRemovePost(post.id)}
                  className="shrink-0 rounded p-1.5 text-zinc-400 hover:bg-rose-950 hover:text-rose-400"
                  title="Remove post"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
            {community.posts.length === 0 && <p className="text-sm text-zinc-500">No posts yet.</p>}
          </ul>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">Members</p>
          <ul className="space-y-1.5">
            {community.members.map((m) => (
              <li key={m.profileId} className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-zinc-200">{m.fullName}</span>{" "}
                  <span className="text-xs text-zinc-500">{m.email}</span>
                </div>
                <button
                  disabled={isPending}
                  onClick={() => handleToggleBan(m.profileId, m.isBanned)}
                  className="flex items-center gap-1 rounded p-1.5 text-xs text-zinc-400 hover:bg-zinc-800"
                >
                  {m.isBanned ? (
                    <>
                      <ShieldCheck className="h-3.5 w-3.5" /> Unban
                    </>
                  ) : (
                    <>
                      <Ban className="h-3.5 w-3.5" /> Ban
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
    </div>
  );

  if (asPage) return content;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      {content}
    </div>
  );
}
