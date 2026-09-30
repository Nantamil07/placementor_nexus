import { CompanyFollowButton } from "./CompanyFollowButton";

type Company = {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string | null;
  location: string;
  about: string;
  isVerified: boolean;
  followersCount: number;
  isFollowing: boolean;
};

export function CompanyHeader({ company }: { company: Company }) {
  return (
    <header className="rounded-2xl border bg-card p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-xl font-bold text-primary">
            {company.logoUrl ? <img src={company.logoUrl} alt="" className="h-full w-full object-cover" /> : company.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{company.name}</h1>
              {company.isVerified && <span className="text-sm text-primary">✓ Verified</span>}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{company.location}</p>
            <p className="mt-1 text-xs text-muted-foreground">{company.followersCount} follower{company.followersCount === 1 ? "" : "s"}</p>
          </div>
        </div>
        <CompanyFollowButton companyId={company.id} initialFollowing={company.isFollowing} />
      </div>
      {company.website && (
        <a href={company.website} target="_blank" rel="noreferrer" className="mt-5 inline-block text-sm font-medium text-primary hover:underline">Company website</a>
      )}
    </header>
  );
}
