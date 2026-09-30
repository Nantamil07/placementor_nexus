import { CompanyCard } from "@/components/company/CompanyCard";
import { getCompanies } from "@/services/company/get-companies";

export default async function CompaniesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const companies = await getCompanies(q);

  return (
    <main className="mx-auto max-w-6xl p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="mt-1 text-sm text-muted-foreground">Explore companies, opportunities, and hiring information.</p>
        </div>
        <form className="flex gap-2" action="/companies">
          <input name="q" defaultValue={q ?? ""} placeholder="Search companies..." className="w-full rounded-lg border bg-background px-3 py-2 text-sm sm:w-64" />
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Search</button>
        </form>
      </div>
      {companies.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{companies.map((company) => <CompanyCard key={company.id} company={company} />)}</div>
      ) : (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">No companies found.</p>
      )}
    </main>
  );
}
