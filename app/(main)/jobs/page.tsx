import JobCard from "@/components/jobs/JobCard";
import { getJobs } from "@/services/jobs/get-jobs";
import type { JobType } from "@prisma/client";

const JOB_TYPES: JobType[] = ["INTERNSHIP", "FULL_TIME", "PART_TIME", "CONTRACT"];

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { search?: string; type?: string; location?: string };
}) {
  const type = JOB_TYPES.includes(searchParams.type as JobType)
    ? (searchParams.type as JobType)
    : undefined;

  const { jobs, total } = await getJobs({
    search: searchParams.search,
    type,
    location: searchParams.location,
  });

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold">Jobs & Internships</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover approved opportunities from companies on Placementor Nexus.
        </p>
      </div>

      <form className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-[1fr_180px_180px_auto]">
        <input
          name="search"
          defaultValue={searchParams.search}
          placeholder="Search jobs or companies..."
          className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        />
        <select
          name="type"
          defaultValue={searchParams.type ?? ""}
          className="rounded-lg border bg-background px-3 py-2 text-sm"
        >
          <option value="">All types</option>
          {JOB_TYPES.map((value) => (
            <option key={value} value={value}>
              {value.replace("_", " ")}
            </option>
          ))}
        </select>
        <input
          name="location"
          defaultValue={searchParams.location}
          placeholder="Location"
          className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Search
        </button>
      </form>

      <div className="text-sm text-muted-foreground">
        {total} {total === 1 ? "opportunity" : "opportunities"}
      </div>

      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No matching jobs or internships found.
        </div>
      )}
    </main>
  );
}
