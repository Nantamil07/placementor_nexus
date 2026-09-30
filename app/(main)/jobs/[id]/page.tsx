import Link from "next/link";
import { notFound } from "next/navigation";
import ApplyButton from "@/components/jobs/ApplyButton";
import { getJob } from "@/services/jobs/get-job";

export default async function JobPage({
  params,
}: {
  params: { id: string };
}) {
  const job = await getJob(params.id);
  if (!job) notFound();

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6 md:p-8">
      <Link href="/jobs" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to Jobs
      </Link>

      <article className="rounded-xl border bg-card p-6 md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {job.company.name}
              {job.company.isVerified && " · Verified company"}
            </p>
          </div>

          <span className="w-fit rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            {job.type.replace("_", " ")}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="rounded-md bg-muted px-3 py-1.5">{job.location}</span>
          <span className="rounded-md bg-muted px-3 py-1.5">
            {job._count.applications} applications
          </span>
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Job Description</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
            {job.description}
          </p>
        </section>

        <section className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold">Company</h2>
          <p className="mt-2 text-sm text-muted-foreground">{job.company.name}</p>
          {job.company.about && (
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
              {job.company.about}
            </p>
          )}
          {job.company.website && (
            <a
              href={job.company.website}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm text-primary hover:underline"
            >
              Company website →
            </a>
          )}
        </section>

        <ApplyButton jobId={job.id} initialApplied={job.hasApplied} />
      </article>
    </main>
  );
}
