import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDashboardData } from "@/services/placement/get-dashboard";

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function statusLabel(status: string) {
  return status.replace("_", " ");
}

export default async function PlacementPage() {
  const { userId } = await requireAuth();

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true, fullName: true },
  });

  if (!profile) {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold">Placement Dashboard</h1>
        <p className="mt-3 text-muted-foreground">
          Complete your profile before using the placement dashboard.
        </p>
      </main>
    );
  }

  const dashboard = await getDashboardData(profile.id);

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold">Placement Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Track your applications and placement progress.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Applications"
          value={dashboard.stats.applications}
        />
        <StatCard
          label="Shortlisted"
          value={dashboard.stats.shortlisted}
        />
        <StatCard
          label="Selected"
          value={dashboard.stats.selected}
        />
        <StatCard
          label="Rejected"
          value={dashboard.stats.rejected}
        />
        <StatCard
          label="Open Jobs"
          value={dashboard.stats.openJobs}
        />
      </section>

      <section className="rounded-xl border bg-card">
        <div className="border-b p-5">
          <h2 className="text-xl font-semibold">Recent Applications</h2>
        </div>

        {dashboard.recentApplications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            You have not applied to any jobs yet.
          </div>
        ) : (
          <div className="divide-y">
            {dashboard.recentApplications.map((application) => (
              <div
                key={application.id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold">
                    {application.job.title}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {application.job.company.name}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {application.job.location} ·{" "}
                    {application.job.type.replace("_", " ")}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="rounded-full border px-3 py-1 text-xs font-medium">
                    {statusLabel(application.status)}
                  </span>

                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(application.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
