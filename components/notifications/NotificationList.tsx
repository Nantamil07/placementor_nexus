"use client";

import { useState, useTransition } from "react";
import { markNotificationRead } from "@/services/notifications/mark-notification-read";
import { markAllNotificationsRead } from "@/services/notifications/mark-all-notifications-read";

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
  actor: {
    id: string;
    fullName: string;
    username: string;
    avatarUrl: string | null;
  } | null;
};

function relativeTime(value: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(value).toLocaleDateString();
}

export function NotificationList({ initialNotifications, initialUnreadCount }: {
  initialNotifications: NotificationItem[];
  initialUnreadCount: number;
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [isPending, startTransition] = useTransition();

  const markRead = (id: string) => {
    const target = notifications.find((item) => item.id === id);
    if (!target || target.isRead) return;

    setNotifications((items) => items.map((item) => item.id === id ? { ...item, isRead: true } : item));
    setUnreadCount((count) => Math.max(0, count - 1));

    startTransition(async () => {
      const result = await markNotificationRead(id);
      if (!result.success) {
        setNotifications((items) => items.map((item) => item.id === id ? { ...item, isRead: false } : item));
        setUnreadCount((count) => count + 1);
      }
    });
  };

  const markAllRead = () => {
    if (unreadCount === 0) return;
    const previous = notifications;
    setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);

    startTransition(async () => {
      const result = await markAllNotificationsRead();
      if (!result.success) {
        setNotifications(previous);
        setUnreadCount(previous.filter((item) => !item.isRead).length);
      }
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}` : "You are all caught up."}
        </p>
        <button
          type="button"
          onClick={markAllRead}
          disabled={isPending || unreadCount === 0}
          className="rounded-lg border px-3 py-2 text-xs font-semibold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const content = (
              <div
                className={`rounded-xl border p-4 transition-colors ${notification.isRead ? "bg-background" : "bg-primary/5"}`}
                onClick={() => markRead(notification.id)}
              >
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {notification.actor?.avatarUrl ? (
                      <img src={notification.actor.avatarUrl} alt={notification.actor.fullName} className="h-full w-full object-cover" />
                    ) : (
                      notification.actor?.fullName?.charAt(0).toUpperCase() ?? "N"
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className={`text-sm ${notification.isRead ? "font-medium" : "font-semibold"}`}>{notification.title}</h2>
                      {!notification.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{notification.message}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{relativeTime(notification.createdAt)}</p>
                  </div>
                </div>
              </div>
            );

            return notification.link ? (
              <a key={notification.id} href={notification.link} className="block cursor-pointer hover:bg-muted/40">
                {content}
              </a>
            ) : (
              <div key={notification.id} className="cursor-pointer">{content}</div>
            );
          })}
        </div>
      )}
    </section>
  );
}
