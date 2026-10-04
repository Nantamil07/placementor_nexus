import { notFound } from "next/navigation";
import Link from "next/link";
import { getJob } from "@/services/jobs/get-job";
import ApplyButton from "@/components/jobs/ApplyButton";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          ← Back to all jobs
        </Link>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-xs sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {job.title}
        </h1>

        <p className="mt-2 text-sm font-medium text-primary">
          <Link href={`/companies/${job.company.slug}`} className="hover:underline">
            {job.company.name}
          </Link>
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {job.location} • {job.type.replace("_", " ")}
        </p>

        <section className="mt-8 border-t pt-6">
          <h2 className="text-base font-semibold text-foreground">Job Description</h2>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {job.description}
          </p>
        </section>

        <div className="mt-8 border-t pt-6">
          <ApplyButton jobId={job.id} />
        </div>
      </div>
    </main>
  );
}
