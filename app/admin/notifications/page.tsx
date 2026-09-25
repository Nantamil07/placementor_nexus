import { getNotifications } from "@/services/admin/get-notifications";
import NotificationComposer from "@/components/admin/NotificationComposer";
import NotificationTable from "@/components/admin/NotificationTable";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  const notifications = await getNotifications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Notifications</h1>
        <p className="text-sm text-zinc-500">Broadcast placement announcements to the whole platform or by role.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <NotificationComposer />
        </div>
        <div className="lg:col-span-2">
          <NotificationTable
            notifications={notifications.map((n) => ({
              id: n.id,
              title: n.title,
              message: n.message,
              audience: n.audience,
              sentByName: n.sentBy.fullName,
              createdAt: n.createdAt.toISOString(),
            }))}
          />
        </div>
      </div>
    </div>
  );
}
