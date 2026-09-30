# Module 08 — Notifications

## Included

- Persistent user notifications backed by Prisma/PostgreSQL.
- Authenticated notification retrieval using Clerk -> Profile.
- Unread notification count.
- Mark one notification as read.
- Mark all notifications as read.
- Reusable `createNotification()` server helper for future modules.
- `/notifications` page with unread/read visual state.
- Notification links when a notification contains a `link`.

## Files

```text
services/notifications/
├── get-notifications.ts
├── mark-notification-read.ts
├── mark-all-notifications-read.ts
└── create-notification.ts

components/notifications/
└── NotificationList.tsx

app/(main)/notifications/
└── page.tsx
```

## Install

From the project root:

```bash
unzip -o placementor-nexus-module-08-notifications.zip -d /tmp/module08
cp -r /tmp/module08/mod08/services/notifications/* services/notifications/
mkdir -p components/notifications
cp -r /tmp/module08/mod08/components/notifications/* components/notifications/
mkdir -p "app/(main)/notifications"
cp -r "/tmp/module08/mod08/app/(main)/notifications/"* "app/(main)/notifications/"
cp /tmp/module08/mod08/README_MODULE_08_NOTIFICATIONS.md .
```

## Validation

```bash
npx tsc --noEmit
npm run build
```

No Prisma schema migration is required because this module uses the existing `Notification` model and `NotificationType` enum.

## Usage

Open:

```text
/notifications
```

The module intentionally does not modify the existing navbar/sidebar because those components vary across the current project state. A notifications navigation item can be added separately once the current navigation component is finalized.
