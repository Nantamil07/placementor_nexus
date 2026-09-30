# Module 04 — Networking

Replaces the original in-memory networking implementation with Prisma-backed connections and follows.

## Included
- Persistent connection requests in `Connection`
- Receiver-only authorization when accepting requests
- Persistent follows in `Follow`
- Connection request and accepted notifications in `Notification`
- Real profile-based network suggestions
- Updated network page and buttons

## Install
Copy the module files into the matching project paths, then run:

```bash
npx prisma generate
npx tsc --noEmit
npm run build
```

No Prisma schema change is required; the required `Connection`, `Follow`, and `Notification` models already exist in the supplied schema.
