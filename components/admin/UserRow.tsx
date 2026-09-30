"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Eye, ShieldOff, ShieldCheck, Trash2 } from "lucide-react";
import RoleSelector from "./RoleSelector";
import UserProfileDialog from "./UserProfileDialog";
import { suspendUser, unsuspendUser } from "@/services/admin/suspend-user";
import { deleteUserAndRedirect } from "@/services/admin/delete-user";
import { useAdmin } from "@/hooks/use-admin";

export interface AdminUserRow {
  id: string;
  fullName: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  role: string;
  isSuspended: boolean;
  createdAt: string;
  skills?: string[];
}

export default function UserRow({ user }: { user: AdminUserRow }) {
  const { canManageUsers } = useAdmin();
  const [showProfile, setShowProfile] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleToggleSuspend() {
    setError(null);
    startTransition(async () => {
      const result = user.isSuspended
        ? await unsuspendUser(user.id)
        : await suspendUser(user.id, "Suspended via admin panel");
      if (!result.success) setError(result.error ?? "Action failed.");
    });
  }

  function handleDelete() {
    if (!confirm(`Permanently delete ${user.fullName}? This cannot be undone.`)) return;
    startTransition(async () => {
      const result = await deleteUserAndRedirect(user.id);
      if (result && !result.success) setError(result.error ?? "Delete failed.");
    });
  }

  return (
    <>
      <tr className="border-b border-zinc-800/60 text-sm">
        <td className="whitespace-nowrap px-4 py-3">
          <div className="flex flex-col">
            <span className="font-medium text-zinc-100">{user.fullName}</span>
            <span className="text-xs text-zinc-500">{user.email}</span>
          </div>
        </td>
        <td className="whitespace-nowrap px-4 py-3">
          <RoleSelector profileId={user.id} role={user.role} />
        </td>
        <td className="whitespace-nowrap px-4 py-3">
          <span
            className={
              user.isSuspended
                ? "rounded-full bg-rose-500/10 px-2 py-0.5 text-xs text-rose-400"
                : "rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400"
            }
          >
            {user.isSuspended ? "Suspended" : "Active"}
          </span>
        </td>
        <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-500">
          {new Date(user.createdAt).toLocaleDateString("en-US", {
  timeZone: "UTC",
})}
        </td>
        <td className="whitespace-nowrap px-4 py-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowProfile(true)}
              className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              title="View profile"
            >
              <Eye className="h-4 w-4" />
            </button>
            <Link
              href={`/admin/users/${user.id}`}
              className="rounded px-2 py-1 text-xs text-blue-400 hover:underline"
            >
              Details
            </Link>
            <button
              onClick={handleToggleSuspend}
              disabled={isPending}
              className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
              title={user.isSuspended ? "Lift suspension" : "Suspend user"}
            >
              {user.isSuspended ? <ShieldCheck className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
            </button>
            {canManageUsers && (
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="rounded p-1.5 text-zinc-400 hover:bg-rose-950 hover:text-rose-400 disabled:opacity-50"
                title="Delete user"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          {error && <p className="mt-1 text-[10px] text-rose-400">{error}</p>}
        </td>
      </tr>

      {showProfile && (
        <UserProfileDialog
          user={{
            fullName: user.fullName,
            email: user.email,
            username: user.username,
            role: user.role,
            isSuspended: user.isSuspended,
            createdAt: user.createdAt,
            skills: user.skills ?? [],
          }}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
}
