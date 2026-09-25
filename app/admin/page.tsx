import { Users, GraduationCap, Building2, MessagesSquare, FileText, Briefcase, ClipboardList, CalendarDays, Trophy, UserCheck2 } from "lucide-react";
import DashboardGrid from "@/components/admin/DashboardGrid";
import StatCard from "@/components/admin/StatCard";
import AnalyticsCard from "@/components/admin/AnalyticsCard";
import AnalyticsChart from "@/components/admin/AnalyticsChart";
import ActivityTimeline from "@/components/admin/ActivityTimeline";
import { getDashboardStats } from "@/services/admin/get-dashboard";
import { getSignupTrend, getApplicationTrend } from "@/services/admin/get-analytics";
import { getSystemHealth } from "@/services/admin/get-system-health";
import { getRecentAuditLog } from "@/services/admin/get-audit-log";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, signupTrend, applicationTrend, health, activity] = await Promise.all([
    getDashboardStats(),
    getSignupTrend(30),
    getApplicationTrend(30),
    getSystemHealth(),
    getRecentAuditLog(10),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Overview</h1>
        <p className="text-sm text-zinc-500">Platform-wide metrics across users, jobs, and engagement.</p>
      </div>

      <DashboardGrid cols={5}>
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} accent="blue" />
        <StatCard label="Students" value={stats.students} icon={GraduationCap} accent="purple" />
        <StatCard label="Alumni" value={stats.alumni} icon={UserCheck2} accent="green" />
        <StatCard label="Recruiters" value={stats.recruiters} icon={Building2} accent="amber" />
        <StatCard label="Communities" value={stats.communities} icon={MessagesSquare} accent="rose" />
        <StatCard label="Posts" value={stats.posts} icon={FileText} accent="blue" />
        <StatCard label="Jobs" value={stats.jobs} icon={Briefcase} accent="purple" />
        <StatCard label="Applications" value={stats.applications} icon={ClipboardList} accent="green" />
        <StatCard label="Events" value={stats.events} icon={CalendarDays} accent="amber" />
        <StatCard label="Placement Success Rate" value={`${stats.placementSuccessRate}%`} icon={Trophy} accent="rose" />
      </DashboardGrid>

      <DashboardGrid cols={4} className="lg:grid-cols-4">
        <AnalyticsCard title="Pending Job Approvals" value={health.pendingJobs} />
        <AnalyticsCard title="Pending Event Approvals" value={health.pendingEvents} />
        <AnalyticsCard title="Open Reports" value={health.pendingReports} />
        <AnalyticsCard
          title="Database"
          value={health.databaseOk ? "Healthy" : "Unreachable"}
          subtext={`${health.activeSuspensions} active suspensions`}
        />
      </DashboardGrid>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AnalyticsChart title="New sign-ups (30 days)" data={signupTrend} color="#3b82f6" />
        <AnalyticsChart title="Job applications (30 days)" data={applicationTrend} color="#22c55e" />
      </div>

      <ActivityTimeline entries={activity} />
    </div>
  );
}
