# Admin Panel — Module 16

A tour of what's under `/admin`, who can access what, and how it's wired up.

## Access control

- **Middleware** (`middleware.ts`): any request to `/admin/**` must come from
  a signed-in Clerk session, or it's redirected to `/sign-in`.
- **Layout** (`app/admin/layout.tsx`): calls `requireAdmin()`
  (`lib/admin-permissions.ts`), which looks up the caller's `Profile.role` in
  Postgres. Only `ADMIN` and `PLACEMENT_OFFICER` are allowed through; anyone
  else — including a valid but non-admin Clerk session — is redirected to `/`.
- **Fine-grained permissions**, also in `lib/admin-permissions.ts`:
  - `canManageUsers` — `ADMIN` only. Gates role changes and hard deletes
    (users, companies, jobs).
  - `canModerateContent` — `ADMIN` or `PLACEMENT_OFFICER`. Gates
    approve/reject/suspend/remove actions.
  - `canSendNotifications` — `ADMIN` only. Gates the notification broadcaster.
  - These are enforced **again inside every server action**, not just in the
    UI — the UI hides buttons a role can't use, but the server actions
    re-check permissions independently so this can't be bypassed.

## Sections

| Route | What it does |
|---|---|
| `/admin` | KPI dashboard: user/content counts, sign-up & application trends, pending-moderation counts, recent audit log |
| `/admin/users` | Search, paginate, change role, suspend/unsuspend, delete, view profile |
| `/admin/companies` | Create/edit/delete companies, toggle verification |
| `/admin/recruiters` | Verify recruiter accounts, suspend recruiters |
| `/admin/jobs` | Approve/reject pending jobs, delete jobs, filter by status |
| `/admin/communities` | Remove posts, ban/unban members, remove a community entirely |
| `/admin/reports` | Review the report queue (spam/abuse/etc.), resolve or reject with a note |
| `/admin/events` | Approve/reject webinars, hackathons, workshops, placement drives |
| `/admin/notifications` | Broadcast an announcement to everyone or a specific role (`ADMIN` only) |

## Every mutation is audited

`lib/admin-permissions.ts` exposes `logAdminAction()`, which every mutating
server action (suspend, delete, approve, reject, verify, send notification,
…) calls after a successful write. These land in the `AuditLog` table and
power the "Recent activity" feed on the dashboard — useful for
accountability when more than one admin/placement officer has access.

## Adding a new admin section

1. Add any new Prisma models/fields you need, then `prisma migrate dev`.
2. Add a `services/admin/get-<thing>.ts` (read) and any mutation files
   (`"use server"` actions that call `requireAdmin()` + the relevant
   `can...` check + `logAdminAction()`).
3. Add a table/dialog component under `components/admin/`.
4. Add a route under `app/admin/<thing>/page.tsx`.
5. Add a nav entry in `components/admin/AdminSidebar.tsx`'s `NAV_ITEMS`.

## Known follow-ups (not in scope for this module)

- The public-facing `services/jobs/get-jobs.ts` and
  `services/company/get-companies.ts` still return hardcoded mock data —
  they were not touched by Module 16. To make the public site reflect what
  gets approved here, point those at the new `Job`/`Company` Prisma models.
- `Profile.isSuspended` is set by this admin panel but isn't yet checked by
  the rest of the app (e.g. to block a suspended user from posting or
  applying to jobs). Wire that check into your existing auth/session layer
  outside `/admin` if you want suspensions to be enforced platform-wide.
