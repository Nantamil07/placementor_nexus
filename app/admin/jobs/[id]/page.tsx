import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getJobById } from "@/services/admin/get-jobs";

export const dynamic = "force-dynamic";

export default async function AdminJobDetailPage({ params }: { params: { id: string } }) {
  const job = await getJobById(params.id);
  if (!job) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/jobs" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </Link>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-white">{job.title}</h1>
            <p className="text-sm text-zinc-500">
              {job.company.name} · {job.location} · {job.type.replace("_", " ")}
            </p>
          </div>
          <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">{job.status}</span>
        </div>

        <p className="mt-4 whitespace-pre-line text-sm text-zinc-300">{job.description}</p>

        {job.rejectionReason && (
          <p className="mt-4 rounded-md bg-rose-500/10 p-3 text-sm text-rose-300">
            Rejection reason: {job.rejectionReason}
          </p>
        )}

        {job.postedBy && (
          <p className="mt-4 text-xs text-zinc-500">
            Posted by {job.postedBy.fullName} ({job.postedBy.email})
          </p>
        )}

        <div className="mt-6">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
            Applicants ({job._count.applications})
          </h2>
          {job.applications.length === 0 && <p className="text-sm text-zinc-500">No applicants yet.</p>}
          <ul className="space-y-1 text-sm text-zinc-300">
            {job.applications.map((app) => (
              <li key={app.id} className="flex justify-between">
                <span>{app.applicant.fullName}</span>
                <span className="text-zinc-500">{app.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
