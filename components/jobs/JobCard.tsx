import Link from "next/link";
import type { JobType } from "@prisma/client";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    type: JobType;
    createdAt: Date;
    company: {
      name: string;
      logoUrl: string | null;
      isVerified: boolean;
    };
    _count: { applications: number };
  };
}

const typeLabel: Record<JobType, string> = {
  INTERNSHIP: "Internship",
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
};

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block rounded-xl border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-muted/30"
    >
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted text-lg font-bold text-primary">
          {job.company.logoUrl ? (
            <img
              src={job.company.logoUrl}
              alt={`${job.company.name} logo`}
              className="h-full w-full object-cover"
            />
          ) : (
            job.company.name.charAt(0).toUpperCase()
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="font-semibold text-foreground">{job.title}</h2>
              <p className="text-sm text-muted-foreground">
                {job.company.name}
                {job.company.isVerified && " · Verified"}
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {typeLabel[job.type]}
            </span>
          </div>

          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
            {job.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>{job.location}</span>
            <span>{job._count.applications} applications</span>
            <span>{job.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
