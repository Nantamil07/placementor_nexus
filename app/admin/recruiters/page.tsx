import { getRecruiters } from "@/services/admin/verify-recruiter";
import RecruiterTable from "@/components/admin/RecruiterTable";

export const dynamic = "force-dynamic";

export default async function AdminRecruitersPage() {
  const recruiters = await getRecruiters();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Recruiters</h1>
        <p className="text-sm text-zinc-500">Verify recruiter accounts before they can post jobs.</p>
      </div>
      <RecruiterTable recruiters={recruiters.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))} />
    </div>
  );
}
