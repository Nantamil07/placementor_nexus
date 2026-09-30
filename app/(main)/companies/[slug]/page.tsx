import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getCompany } from "@/services/company/get-company";
import { CompanyHeader } from "@/components/company/CompanyHeader";

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { userId } = await auth();
  const profile = userId ? await prisma.profile.findUnique({ where: { clerkId: userId }, select: { id: true } }) : null;
  const company = await getCompany(slug, profile?.id);
  if (!company) notFound();

  return (
    <main className="mx-auto max-w-5xl p-6 md:p-8">
      <CompanyHeader company={company} />
      <section className="mt-8 rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold">About {company.name}</h2>
        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">{company.about}</p>
      </section>
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Open positions</h2>
        {company.jobs.length ? (
          <div className="space-y-3">
            {company.jobs.map((job) => (
              <a key={job.id} href={`/jobs/${job.id}`} className="block rounded-xl border bg-card p-5 hover:shadow-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="font-semibold">{job.title}</h3>
                  <span className="text-xs text-muted-foreground">{job.type.replaceAll("_", " ")}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{job.location}</p>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{job.description}</p>
              </a>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">No approved positions are currently listed.</p>
        )}
      </section>
    </main>
  );
}
