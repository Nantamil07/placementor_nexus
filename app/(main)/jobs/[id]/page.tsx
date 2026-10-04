import { notFound } from "next/navigation";
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
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-4xl font-bold">{job.title}</h1>

      <p className="mt-2 text-zinc-400">
        {job.company.name}
      </p>

      <p className="mt-2 text-sm text-zinc-500">
        {job.location} • {job.type.replace("_", " ")}
      </p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Job Description</h2>

        <p className="mt-3 whitespace-pre-wrap text-zinc-300">
          {job.description}
        </p>
      </section>

      <ApplyButton jobId={job.id} />
    </main>
  );
}
