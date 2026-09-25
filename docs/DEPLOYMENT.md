# Deployment Guide — Placementor Nexus

This covers taking Placementor Nexus (including the Module 16 Admin Panel)
from local development to a production deployment on Vercel + Supabase +
Clerk.

## 1. Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (Postgres + Storage)
- A [Clerk](https://clerk.com) application, in **production** mode
- A [Vercel](https://vercel.com) account (or any Node host that supports
  Next.js 14 server components + server actions)

## 2. First-time local setup

```bash
npm install
cp .env.local.example .env.local   # fill in dev keys
npx prisma generate
npx prisma migrate dev             # creates tables, including Module 16 models
npm run dev
```

Module 16 added new Prisma models (`Company`, `Job`, `JobApplication`,
`Community`, `Post`, `Comment`, `Event`, `Report`, `AuditLog`,
`AdminNotification`, `UserSuspension`) and new fields on `Profile`
(`isSuspended`, `isVerifiedRecruiter`). Running `prisma migrate dev` will
generate and apply a new migration for these — review it before applying in
production.

## 3. Promote your own account to ADMIN

The admin panel is only reachable by users whose `Profile.role` is `ADMIN`
or `PLACEMENT_OFFICER` (enforced in `lib/admin-permissions.ts`). After you've
signed up once through Clerk in this environment, promote yourself directly
in the database:

```sql
update "Profile" set role = 'ADMIN' where email = 'you@yourcompany.com';
```

Or via Prisma Studio: `npx prisma studio`.

## 4. Environment variables

Copy `.env.production.example` to `.env.production` and fill in real values,
or — for Vercel — add each variable under **Project Settings → Environment
Variables**, scoped to **Production**. See `CLERK_SETUP.md` and
`SUPABASE_SETUP.md` for where each value comes from.

## 5. Database migration in production

See `DATABASE_MIGRATION.md` for the full walkthrough. In short:

```bash
npx prisma migrate deploy
```

This is already wired into `vercel.json`'s `buildCommand`, so a normal Vercel
deploy will run migrations automatically. If you deploy elsewhere, run this
command manually before starting the app.

## 6. Deploying to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the repo in Vercel → it will detect Next.js automatically.
3. Add all environment variables from `.env.production.example`.
4. Deploy. `vercel.json` already sets:
   - `buildCommand`: `prisma generate && prisma migrate deploy && next build`
   - `X-Robots-Tag: noindex` and `X-Frame-Options: DENY` on `/admin/*`
5. After the first deploy, confirm `/admin` redirects non-admins to `/` and
   signed-out users to `/sign-in`.

## 7. Clerk webhook (recommended)

If you use a Clerk webhook to create `Profile` rows on `user.created`, make
sure its endpoint (`/api/webhook/clerk` or similar) is in the middleware's
public route matcher — it already is (`/api/webhook(.*)`).

## 8. Post-deploy checklist

- [ ] `/admin` requires sign-in and redirects non-admins away
- [ ] Dashboard KPI cards load real counts (not zeros — check DB connectivity)
- [ ] Creating/verifying a company works end-to-end
- [ ] Approving/rejecting a job updates its status
- [ ] Suspending a user blocks them from the rest of the app (if you wire
      `isSuspended` into your existing auth checks outside `/admin`)
- [ ] Sending a notification appears in the notifications table
- [ ] Audit log entries appear on the dashboard activity feed

See `README_ADMIN.md` for a tour of what each admin section does.
