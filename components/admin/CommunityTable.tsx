"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, ShieldCheck } from "lucide-react";
import { removeCommunity } from "@/services/admin/remove-community";
import { useAdmin } from "@/hooks/use-admin";

export interface AdminCommunityRow {
  id: string;
  slug: string;
  name: string;
  isPrivate: boolean;
  isRemoved: boolean;
  memberCount: number;
  postCount: number;
}

export default function CommunityTable({ communities }: { communities: AdminCommunityRow[] }) {
  const { canManageUsers } = useAdmin();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRemove(id: string, name: string) {
    if (!confirm(`Hide "${name}" from the platform?`)) return;
    startTransition(async () => {
      await removeCommunity(id);
      router.refresh();
    });
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-medium">Community</th>
              <th className="px-4 py-3 font-medium">Members</th>
              <th className="px-4 py-3 font-medium">Posts</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {communities.map((c) => (
              <tr key={c.id} className="border-b border-zinc-800/60 text-sm">
                <td className="px-4 py-3">
                  <Link href={`/admin/communities/${c.slug}`} className="font-medium text-zinc-100 hover:text-blue-400">
                    {c.name}
                  </Link>
                  {c.isPrivate && <span className="ml-2 text-xs text-zinc-500">(private)</span>}
                </td>
                <td className="px-4 py-3 text-zinc-400">{c.memberCount}</td>
                <td className="px-4 py-3 text-zinc-400">{c.postCount}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      c.isRemoved
                        ? "rounded-full bg-rose-500/10 px-2 py-0.5 text-xs text-rose-400"
                        : "rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400"
                    }
                  >
                    {c.isRemoved ? "Removed" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/admin/communities/${c.slug}`}
                      className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      title="Moderate"
                    >
                      <ShieldCheck className="h-4 w-4" />
                    </Link>
                    {canManageUsers && !c.isRemoved && (
                      <button
                        disabled={isPending}
                        onClick={() => handleRemove(c.id, c.name)}
                        className="rounded p-1.5 text-zinc-400 hover:bg-rose-950 hover:text-rose-400"
                        title="Remove community"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {communities.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-zinc-500">
                  No communities yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
