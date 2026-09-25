import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCompanyById } from "@/services/admin/get-companies";

export const dynamic = "force-dynamic";

export default async function AdminCompanyDetailPage({ params }: { params: { id: string } }) {
  const company = await getCompanyById(params.id);
  if (!company) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/companies" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to companies
      </Link>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-white">{company.name}</h1>
            <p className="text-sm text-zinc-500">{company.location}</p>
          </div>
          <span
            className={
              company.isVerified
                ? "rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400"
                : "rounded-full bg-zinc-700/50 px-3 py-1 text-xs text-zinc-400"
            }
          >
            {company.isVerified ? "Verified" : "Unverified"}
          </span>
        </div>

        <p className="mt-4 text-sm text-zinc-300">{company.about}</p>

        <div className="mt-6">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
            Job postings ({company._count.jobs})
          </h2>
          {company.jobs.length === 0 && <p className="text-sm text-zinc-500">No job postings yet.</p>}
          <ul className="space-y-1 text-sm text-zinc-300">
            {company.jobs.map((job) => (
              <li key={job.id} className="flex justify-between">
                <Link href={`/admin/jobs/${job.id}`} className="hover:text-blue-400">
                  {job.title}
                </Link>
                <span className="text-zinc-500">{job.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
