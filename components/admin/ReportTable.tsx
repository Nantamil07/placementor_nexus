"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, X as XIcon } from "lucide-react";
import ReportActionDialog from "./ReportActionDialog";

export interface AdminReportRow {
  id: string;
  type: string;
  status: "PENDING" | "RESOLVED" | "REJECTED";
  targetType: string;
  reason: string;
  reporterName: string;
  createdAt: string;
}

const STATUS_STYLES: Record<AdminReportRow["status"], string> = {
  PENDING: "bg-amber-500/10 text-amber-400",
  RESOLVED: "bg-emerald-500/10 text-emerald-400",
  REJECTED: "bg-rose-500/10 text-rose-400",
};

export default function ReportTable({ reports }: { reports: AdminReportRow[] }) {
  const router = useRouter();
  const [dialog, setDialog] = useState<{ reportId: string; mode: "resolve" | "reject" } | null>(null);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-medium">Report</th>
              <th className="px-4 py-3 font-medium">Reported by</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Filed</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-b border-zinc-800/60 text-sm">
                <td className="px-4 py-3">
                  <Link href={`/admin/reports/${r.id}`} className="font-medium text-zinc-100 hover:text-blue-400">
                    {r.type.replace(/_/g, " ")} · {r.targetType}
                  </Link>
                  <p className="mt-0.5 max-w-sm truncate text-xs text-zinc-500">{r.reason}</p>
                </td>
                <td className="px-4 py-3 text-zinc-400">{r.reporterName}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[r.status]}`}>{r.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-500">{new Date(r.createdAt).toLocaleDateString("en-US", {
  timeZone: "UTC",
})}</td>
                <td className="px-4 py-3">
                  {r.status === "PENDING" ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setDialog({ reportId: r.id, mode: "resolve" })}
                        className="rounded p-1.5 text-zinc-400 hover:bg-emerald-950 hover:text-emerald-400"
                        title="Resolve"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDialog({ reportId: r.id, mode: "reject" })}
                        className="rounded p-1.5 text-zinc-400 hover:bg-rose-950 hover:text-rose-400"
                        title="Reject"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-500">—</span>
                  )}
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-zinc-500">
                  No reports in this queue.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {dialog && (
        <ReportActionDialog
          reportId={dialog.reportId}
          mode={dialog.mode}
          onClose={() => setDialog(null)}
          onDone={() => router.refresh()}
        />
      )}
    </div>
  );
}
