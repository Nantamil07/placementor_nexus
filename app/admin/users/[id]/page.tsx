import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getUserById } from "@/services/admin/get-users";
import RoleSelector from "@/components/admin/RoleSelector";

export const dynamic = "force-dynamic";

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const user = await getUserById(params.id);
  if (!user) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to users
      </Link>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-white">{user.fullName}</h1>
            <p className="text-sm text-zinc-500">
              @{user.username} · {user.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={
                user.isSuspended
                  ? "rounded-full bg-rose-500/10 px-3 py-1 text-xs text-rose-400"
                  : "rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400"
              }
            >
              {user.isSuspended ? "Suspended" : "Active"}
            </span>
            <RoleSelector profileId={user.id} role={user.role} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {user.skills.length === 0 && <p className="text-sm text-zinc-500">No skills listed.</p>}
              {user.skills.map((skill) => (
                <span key={skill.id} className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">Education</h2>
            {user.education.length === 0 && <p className="text-sm text-zinc-500">No education listed.</p>}
            <ul className="space-y-1 text-sm text-zinc-300">
              {user.education.map((edu) => (
                <li key={edu.id}>
                  {edu.degree} — {edu.institution}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">Recent applications</h2>
          {user.jobApplications.length === 0 && <p className="text-sm text-zinc-500">No applications yet.</p>}
          <ul className="space-y-1 text-sm text-zinc-300">
            {user.jobApplications.map((app) => (
              <li key={app.id} className="flex justify-between">
                <span>{app.job.title}</span>
                <span className="text-zinc-500">{app.status}</span>
              </li>
            ))}
          </ul>
        </div>

        {user.suspensionsRecieved.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">Suspension history</h2>
            <ul className="space-y-1 text-sm text-zinc-300">
              {user.suspensionsRecieved.map((s) => (
                <li key={s.id}>
                  {s.reason} — {s.isActive ? "Active" : "Lifted"} ({new Date(s.createdAt).toLocaleDateString()})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
