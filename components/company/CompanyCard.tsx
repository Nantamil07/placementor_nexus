import Link from "next/link";
import type { Company } from "@/types/company";
import { CompanyFollowButton } from "./CompanyFollowButton";

export default function CompanyCard({
  company,
}: {
  company: Company;
}) {
  return (
    <div className="rounded-xl border p-5 hover:border-blue-500">
      <div className="flex items-start justify-between gap-4">
        <Link
          href={`/companies/${company.slug}`}
          className="min-w-0 flex-1"
        >
          <h3 className="text-lg font-semibold">{company.name}</h3>

          <p className="mt-2 text-sm text-zinc-400">
            {company.location}
          </p>

          <p className="mt-3 line-clamp-3 text-zinc-300">
            {company.about}
          </p>
        </Link>

        <CompanyFollowButton
          companyId={company.id}
          initialFollowing={false}
        />
      </div>
    </div>
  );
}
