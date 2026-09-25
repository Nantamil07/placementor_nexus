import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getReportById } from "@/services/admin/get-reports";
import ReportCard from "@/components/admin/ReportCard";

export const dynamic = "force-dynamic";

export default async function AdminReportDetailPage({ params }: { params: { id: string } }) {
  const report = await getReportById(params.id);
  if (!report) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/reports" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to reports
      </Link>

      <ReportCard
        report={{
          id: report.id,
          type: report.type,
          status: report.status,
          targetType: report.targetType,
          targetId: report.targetId,
          reason: report.reason,
          reporterName: report.reporter.fullName,
          reporterEmail: report.reporter.email,
          resolvedByName: report.resolvedBy?.fullName,
          resolutionNote: report.resolutionNote,
          createdAt: report.createdAt.toISOString(),
        }}
      />
    </div>
  );
}
