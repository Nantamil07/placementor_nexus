import Link from "next/link";
import type { CompanyListItem } from "@/services/company/get-companies";

export function CompanyCard({ company }: { company: CompanyListItem }) {
  return (
    <Link href={`/companies/${company.slug}`} className="block rounded-xl border bg-card p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10 font-semibold text-primary">
          {company.logoUrl ? <img src={company.logoUrl} alt="" className="h-full w-full object-cover" /> : company.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate font-semibold">{company.name}</h2>
            {company.isVerified && <span className="text-xs text-primary">✓</span>}
          </div>
          <p className="text-sm text-muted-foreground">{company.location}</p>
        </div>
      </div>
      <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">{company.about}</p>
      <p className="mt-4 text-xs text-muted-foreground">{company.followersCount} follower{company.followersCount === 1 ? "" : "s"}</p>
    </Link>
  );
}
