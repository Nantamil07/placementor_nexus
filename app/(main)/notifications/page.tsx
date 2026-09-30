import { getCurrentUserNotifications } from "@/services/notifications/get-notifications";
import { NotificationList } from "@/components/notifications/NotificationList";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const { notifications, unreadCount } = await getCurrentUserNotifications();

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-4 md:p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Stay updated on connections, referrals, applications, mentorship, events, and placement announcements.
        </p>
      </header>

      <NotificationList
        initialUnreadCount={unreadCount}
        initialNotifications={notifications.map((notification) => ({
          id: notification.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          link: notification.link,
          isRead: notification.isRead,
          createdAt: notification.createdAt.toISOString(),
          actor: notification.actor,
        }))}
      />
    </main>
  );
}
