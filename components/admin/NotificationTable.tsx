export interface AdminNotificationRow {
  id: string;
  title: string;
  message: string;
  audience: string;
  sentByName: string;
  createdAt: string;
}

export default function NotificationTable({ notifications }: { notifications: AdminNotificationRow[] }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 p-4">
        <p className="text-sm font-medium text-zinc-300">Sent announcements</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Audience</th>
              <th className="px-4 py-3 font-medium">Sent by</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((n) => (
              <tr key={n.id} className="border-b border-zinc-800/60 text-sm">
                <td className="px-4 py-3">
                  <p className="font-medium text-zinc-100">{n.title}</p>
                  <p className="mt-0.5 max-w-md truncate text-xs text-zinc-500">{n.message}</p>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-400">{n.audience.replace("_", " ")}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{n.sentByName}</td>
                <td className="px-4 py-3 text-xs text-zinc-500">{new Date(n.createdAt).toLocaleString("en-US", {
  timeZone: "UTC",
})}</td>
              </tr>
            ))}
            {notifications.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-zinc-500">
                  No announcements sent yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
