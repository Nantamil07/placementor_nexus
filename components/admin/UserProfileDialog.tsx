"use client";

import { X } from "lucide-react";

export interface UserProfileDialogData {
  fullName: string;
  email: string;
  username: string;
  role: string;
  isSuspended: boolean;
  createdAt: string;
  skills: string[];
}

interface UserProfileDialogProps {
  user: UserProfileDialogData;
  onClose: () => void;
}

export default function UserProfileDialog({ user, onClose }: UserProfileDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">{user.fullName}</h3>
            <p className="text-xs text-zinc-500">@{user.username}</p>
          </div>
          <button onClick={onClose} className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">Email</dt>
            <dd className="text-zinc-200">{user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Role</dt>
            <dd className="text-zinc-200">{user.role.replace("_", " ")}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Status</dt>
            <dd className={user.isSuspended ? "text-rose-400" : "text-emerald-400"}>
              {user.isSuspended ? "Suspended" : "Active"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Joined</dt>
            <dd className="text-zinc-200">{new Date(user.createdAt).toLocaleDateString("en-US", {
  timeZone: "UTC",
})}</dd>
          </div>
        </dl>

        {user.skills.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-zinc-500">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {user.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
