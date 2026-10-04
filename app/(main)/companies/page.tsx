export const dynamic = "force-dynamic";

import CompanyCard from "@/components/company/CompanyCard";
import { getCompanies } from "@/services/company/get-companies";

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Partner Companies
        </h1>
        <p className="text-sm text-muted-foreground">
          Explore partner companies recruiting on campus and follow them to stay updated on new drives.
        </p>
      </div>

      {companies.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-12 text-center">
          <h2 className="text-base font-semibold text-foreground">No partner companies registered yet</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Companies will appear here once verified by the placement administration.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => (
            <CompanyCard key={c.slug} company={c} />
          ))}
        </div>
      )}
    </main>
  );
}
