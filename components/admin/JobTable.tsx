"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, X as XIcon, Trash2 } from "lucide-react";
import JobModerationDialog from "./JobModerationDialog";
import { deleteJob } from "@/services/admin/delete-job";
import { useAdmin } from "@/hooks/use-admin";

export interface AdminJobRow {
  id: string;
  title: string;
  companyName: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CLOSED";
  applicantCount: number;
  createdAt: string;
}

const STATUS_STYLES: Record<AdminJobRow["status"], string> = {
  PENDING: "bg-amber-500/10 text-amber-400",
  APPROVED: "bg-emerald-500/10 text-emerald-400",
  REJECTED: "bg-rose-500/10 text-rose-400",
  CLOSED: "bg-zinc-700/50 text-zinc-400",
};

export default function JobTable({ jobs }: { jobs: AdminJobRow[] }) {
  const { canManageUsers } = useAdmin();
  const router = useRouter();
  const [dialog, setDialog] = useState<{ jobId: string; jobTitle: string; mode: "approve" | "reject" } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This removes all applications too.`)) return;
    startTransition(async () => {
      await deleteJob(id);
      router.refresh();
    });
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-medium">Job</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Applicants</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Posted</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-zinc-800/60 text-sm">
                <td className="px-4 py-3">
                  <Link href={`/admin/jobs/${job.id}`} className="font-medium text-zinc-100 hover:text-blue-400">
                    {job.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-zinc-400">{job.companyName}</td>
                <td className="px-4 py-3 text-zinc-400">{job.applicantCount}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[job.status]}`}>{job.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-500">{new Date(job.createdAt).toLocaleDateString("en-US", {
  timeZone: "UTC",
})}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {job.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => setDialog({ jobId: job.id, jobTitle: job.title, mode: "approve" })}
                          className="rounded p-1.5 text-zinc-400 hover:bg-emerald-950 hover:text-emerald-400"
                          title="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDialog({ jobId: job.id, jobTitle: job.title, mode: "reject" })}
                          className="rounded p-1.5 text-zinc-400 hover:bg-rose-950 hover:text-rose-400"
                          title="Reject"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {canManageUsers && (
                      <button
                        disabled={isPending}
                        onClick={() => handleDelete(job.id, job.title)}
                        className="rounded p-1.5 text-zinc-400 hover:bg-rose-950 hover:text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-zinc-500">
                  No jobs to review.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {dialog && (
        <JobModerationDialog
          jobId={dialog.jobId}
          jobTitle={dialog.jobTitle}
          mode={dialog.mode}
          onClose={() => setDialog(null)}
          onDone={() => router.refresh()}
        />
      )}
    </div>
  );
}
