"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, BadgeX, ShieldOff, ShieldCheck } from "lucide-react";
import { verifyRecruiter } from "@/services/admin/verify-recruiter";
import { suspendUser, unsuspendUser } from "@/services/admin/suspend-user";

export interface AdminRecruiterRow {
  id: string;
  fullName: string;
  email: string;
  isVerifiedRecruiter: boolean;
  isSuspended: boolean;
  createdAt: string;
}

export default function RecruiterTable({ recruiters }: { recruiters: AdminRecruiterRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleVerify(id: string) {
    startTransition(async () => {
      await verifyRecruiter(id);
      router.refresh();
    });
  }

  function handleSuspend(id: string, isSuspended: boolean) {
    startTransition(async () => {
      if (isSuspended) await unsuspendUser(id);
      else await suspendUser(id, "Suspended via recruiter moderation");
      router.refresh();
    });
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-medium">Recruiter</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Verification</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recruiters.map((r) => (
              <tr key={r.id} className="border-b border-zinc-800/60 text-sm">
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-zinc-100">{r.fullName}</span>
                    <span className="text-xs text-zinc-500">{r.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-500">{new Date(r.createdAt).toLocaleDateString("en-US", {
  timeZone: "UTC",
})}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      r.isVerifiedRecruiter
                        ? "rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400"
                        : "rounded-full bg-zinc-700/50 px-2 py-0.5 text-xs text-zinc-400"
                    }
                  >
                    {r.isVerifiedRecruiter ? "Verified" : "Unverified"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      r.isSuspended
                        ? "rounded-full bg-rose-500/10 px-2 py-0.5 text-xs text-rose-400"
                        : "rounded-full bg-zinc-700/50 px-2 py-0.5 text-xs text-zinc-300"
                    }
                  >
                    {r.isSuspended ? "Suspended" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={isPending}
                      onClick={() => handleVerify(r.id)}
                      className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      title={r.isVerifiedRecruiter ? "Unverify" : "Verify"}
                    >
                      {r.isVerifiedRecruiter ? <BadgeX className="h-4 w-4" /> : <BadgeCheck className="h-4 w-4" />}
                    </button>
                    <button
                      disabled={isPending}
                      onClick={() => handleSuspend(r.id, r.isSuspended)}
                      className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      title={r.isSuspended ? "Lift suspension" : "Suspend"}
                    >
                      {r.isSuspended ? <ShieldCheck className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {recruiters.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-zinc-500">
                  No recruiters yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
