import { getCompanies } from "@/services/admin/get-companies";
import CompanyTable from "@/components/admin/CompanyTable";

export const dynamic = "force-dynamic";

export default async function AdminCompaniesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const page = Number(searchParams.page ?? "1") || 1;
  const { companies } = await getCompanies({ page, search: searchParams.search });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Companies</h1>
        <p className="text-sm text-zinc-500">Create, verify, and moderate companies on the platform.</p>
      </div>
      <CompanyTable
        companies={companies.map((c) => ({
          id: c.id,
          slug: c.slug,
          name: c.name,
          location: c.location,
          isVerified: c.isVerified,
          jobCount: c._count.jobs,
          followerCount: c._count.followers,
        }))}
      />
    </div>
  );
}
