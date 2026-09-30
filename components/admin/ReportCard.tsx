import { cn } from "@/lib/utils";

export interface ReportCardData {
  id: string;
  type: string;
  status: "PENDING" | "RESOLVED" | "REJECTED";
  targetType: string;
  targetId: string;
  reason: string;
  reporterName: string;
  reporterEmail: string;
  resolvedByName?: string | null;
  resolutionNote?: string | null;
  createdAt: string;
}

const STATUS_STYLES: Record<ReportCardData["status"], string> = {
  PENDING: "bg-amber-500/10 text-amber-400",
  RESOLVED: "bg-emerald-500/10 text-emerald-400",
  REJECTED: "bg-rose-500/10 text-rose-400",
};

export default function ReportCard({ report }: { report: ReportCardData }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            {report.type.replace(/_/g, " ")} · {report.targetType}
          </p>
          <h1 className="mt-1 text-lg font-semibold text-white">Report #{report.id.slice(-6)}</h1>
        </div>
        <span className={cn("rounded-full px-3 py-1 text-xs", STATUS_STYLES[report.status])}>{report.status}</span>
      </div>

      <p className="mt-4 text-sm text-zinc-300">{report.reason}</p>

      <dl className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-zinc-500">Reported by</dt>
          <dd className="text-zinc-200">
            {report.reporterName} ({report.reporterEmail})
          </dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Target</dt>
          <dd className="text-zinc-200">
            {report.targetType} · {report.targetId}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Filed</dt>
          <dd className="text-zinc-200">{new Date(report.createdAt).toLocaleString("en-US", {
  timeZone: "UTC",
})}</dd>
        </div>
        {report.resolvedByName && (
          <div>
            <dt className="text-xs text-zinc-500">Handled by</dt>
            <dd className="text-zinc-200">{report.resolvedByName}</dd>
          </div>
        )}
      </dl>

      {report.resolutionNote && (
        <p className="mt-4 rounded-md bg-zinc-800 p-3 text-sm text-zinc-300">Note: {report.resolutionNote}</p>
      )}
    </div>
  );
}
