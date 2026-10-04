export const dynamic = "force-dynamic";

import JobCard from "@/components/jobs/JobCard";
import { getJobs } from "@/services/jobs/get-jobs";

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Jobs & Internships
        </h1>
        <p className="text-sm text-muted-foreground">
          Discover approved campus hiring drives, verified referral roles, and off-campus opportunities.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-12 text-center">
          <h2 className="text-base font-semibold text-foreground">No active job listings</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Check back soon for new hiring drives and internship postings.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
        </div>
      )}
    </main>
  );
}