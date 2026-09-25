import { getReports } from "@/services/admin/get-reports";
import ReportTable from "@/components/admin/ReportTable";

export const dynamic = "force-dynamic";

const STATUS_FILTERS = ["PENDING", "RESOLVED", "REJECTED"] as const;

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string };
}) {
  const page = Number(searchParams.page ?? "1") || 1;
  const status = STATUS_FILTERS.includes(searchParams.status as any) ? (searchParams.status as any) : undefined;
  const { reports } = await getReports({ page, status });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Reports</h1>
        <p className="text-sm text-zinc-500">Spam, abuse, and other reports awaiting review.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <a
            key={s}
            href={`/admin/reports?status=${s}`}
            className={`rounded-full border px-3 py-1 text-xs ${
              status === s ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            {s}
          </a>
        ))}
        <a
          href="/admin/reports"
          className={`rounded-full border px-3 py-1 text-xs ${
            !status ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          ALL
        </a>
      </div>

      <ReportTable
        reports={reports.map((r) => ({
          id: r.id,
          type: r.type,
          status: r.status,
          targetType: r.targetType,
          reason: r.reason,
          reporterName: r.reporter.fullName,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
