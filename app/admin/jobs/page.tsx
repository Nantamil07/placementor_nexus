import { getJobs } from "@/services/admin/get-jobs";
import JobTable from "@/components/admin/JobTable";

export const dynamic = "force-dynamic";

const STATUS_FILTERS = ["PENDING", "APPROVED", "REJECTED", "CLOSED"] as const;

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string; search?: string };
}) {
  const page = Number(searchParams.page ?? "1") || 1;
  const status = STATUS_FILTERS.includes(searchParams.status as any) ? (searchParams.status as any) : undefined;
  const { jobs } = await getJobs({ page, status, search: searchParams.search });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Jobs</h1>
        <p className="text-sm text-zinc-500">Approve, reject, or remove job postings.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <a
            key={s}
            href={`/admin/jobs?status=${s}`}
            className={`rounded-full border px-3 py-1 text-xs ${
              status === s ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            {s}
          </a>
        ))}
        <a
          href="/admin/jobs"
          className={`rounded-full border px-3 py-1 text-xs ${
            !status ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          ALL
        </a>
      </div>

      <JobTable
        jobs={jobs.map((j) => ({
          id: j.id,
          title: j.title,
          companyName: j.company.name,
          status: j.status,
          applicantCount: j._count.applications,
          createdAt: j.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
