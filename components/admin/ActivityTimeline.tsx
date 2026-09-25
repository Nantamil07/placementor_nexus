import { formatDistanceToNow } from "@/lib/utils";
import type { AuditLogEntry } from "@/services/admin/get-audit-log";

function actionLabel(entry: AuditLogEntry): string {
  const target = entry.targetType ? entry.targetType.toLowerCase() : "item";
  return `${entry.action.replace(/_/g, " ").toLowerCase()} · ${target}`;
}

export default function ActivityTimeline({ entries }: { entries: AuditLogEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center text-sm text-zinc-500">
        No admin activity yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="mb-4 text-sm font-medium text-zinc-300">Recent activity</p>
      <ol className="space-y-4">
        {entries.map((entry) => (
          <li key={entry.id} className="flex gap-3 text-sm">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
            <div className="flex-1">
              <p className="text-zinc-200">
                <span className="font-medium">{entry.actor.fullName}</span>{" "}
                <span className="text-zinc-400">{actionLabel(entry)}</span>
              </p>
              <p className="text-xs text-zinc-500">{formatDistanceToNow(entry.createdAt)}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
