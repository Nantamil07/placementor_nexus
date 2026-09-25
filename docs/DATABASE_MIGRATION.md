# Database Migration — Module 16

Module 16 extends `prisma/schema.prisma` with new models and fields. This
document explains what changed and how to roll it out safely.

## What changed

**New enums:** `JobType`, `JobStatus`, `ApplicationStatus`, `EventType`,
`EventStatus`, `ReportType`, `ReportStatus`, `ReportTargetType`,
`NotificationAudience`.

**New models:** `Company`, `CompanyFollower`, `Job`, `JobApplication`,
`Community`, `CommunityMember`, `Post`, `Comment`, `Event`, `Report`,
`AuditLog`, `AdminNotification`, `UserSuspension`.

**New fields on `Profile`:** `isSuspended` (default `false`),
`isVerifiedRecruiter` (default `false`), plus the back-relations these new
models require (e.g. `jobsPosted`, `reportsFiled`, `auditLogs`). No existing
`Profile` fields were modified or removed.

## Local development

```bash
npx prisma migrate dev --name module_16_admin_panel
```

This creates a new migration under `prisma/migrations/` and applies it to
your dev database. Because all new fields have defaults and all new models
are net-new tables, this is a purely additive, non-destructive migration —
existing `Profile` rows are unaffected.

## Staging / production

1. **Never run `prisma migrate dev` against production.** Use `migrate
   deploy`, which only applies already-generated migrations and never
   prompts or auto-generates:

   ```bash
   npx prisma migrate deploy
   ```

2. If you're on Vercel, this is already wired into `vercel.json`'s
   `buildCommand`, so it runs automatically on every deploy.

3. **Take a backup first** (see `SUPABASE_SETUP.md` §5) even though this
   migration is additive — good habit before any schema change.

## Rollback

Prisma migrations are forward-only by design. If you need to roll back:

1. Revert the code deploy (so the app stops expecting the new tables/fields).
2. Manually drop the new tables / columns via a hand-written down-migration,
   or restore from the pre-migration backup if the rollback needs to be
   immediate.

## Verifying the migration

```bash
npx prisma studio
```

Confirm the following tables now exist and are empty (or seeded, if you ran
a seed script): `Company`, `Job`, `JobApplication`, `Community`,
`CommunityMember`, `Post`, `Comment`, `Event`, `Report`, `AuditLog`,
`AdminNotification`, `UserSuspension`. Confirm `Profile` rows still have all
their original data plus `isSuspended = false` and
`isVerifiedRecruiter = false` on every existing row.
