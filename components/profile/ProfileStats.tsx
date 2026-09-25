interface ProfileStatsProps {
  projectsCount: number;
  skillsCount: number;
  cgpa?: string | null;
  graduationYear?: number | null;
}

export function ProfileStats({
  projectsCount,
  skillsCount,
  cgpa,
  graduationYear,
}: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-xl border bg-card p-4 text-center shadow-xs">
        <span className="block text-2xl font-bold tracking-tight text-foreground">
          {projectsCount}
        </span>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Projects
        </span>
      </div>

      <div className="rounded-xl border bg-card p-4 text-center shadow-xs">
        <span className="block text-2xl font-bold tracking-tight text-foreground">
          {skillsCount}
        </span>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Skills
        </span>
      </div>

      <div className="rounded-xl border bg-card p-4 text-center shadow-xs">
        <span className="block text-2xl font-bold tracking-tight text-foreground">
          {cgpa || "N/A"}
        </span>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          CGPA
        </span>
      </div>

      <div className="rounded-xl border bg-card p-4 text-center shadow-xs">
        <span className="block text-2xl font-bold tracking-tight text-foreground">
          {graduationYear || "—"}
        </span>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Class Of
        </span>
      </div>
    </div>
  );
}
