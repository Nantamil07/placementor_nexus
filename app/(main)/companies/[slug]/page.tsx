import { notFound } from "next/navigation";
import Link from "next/link";
import { getCompany } from "@/services/company/get-company";
import CompanyHeader from "@/components/company/CompanyHeader";
import { CompanyFollowButton } from "@/components/company/CompanyFollowButton";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await getCompany(slug);

  if (!company) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link
          href="/companies"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          ← Back to all companies
        </Link>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <CompanyHeader company={company} />

          <CompanyFollowButton
            companyId={company.id}
            initialFollowing={false}
          />
        </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">About</h2>

        <p className="mt-2 text-zinc-300">
          {company.about}
        </p>
      </section>

      {company.jobs.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">
            Open Positions
          </h2>

          <div className="mt-4 space-y-3">
            {company.jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="block rounded-xl border p-4 transition hover:border-blue-500"
              >
                <h3 className="font-semibold">{job.title}</h3>

                <p className="mt-1 text-sm text-zinc-400">
                  {job.location} • {job.type.replace("_", " ")}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
      </div>
    </main>
  );
}
