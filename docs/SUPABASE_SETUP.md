# Supabase Setup

Supabase provides the Postgres database (via Prisma) and, if you use it
elsewhere in the app, file storage.

## 1. Create a project

Create a new Supabase project. Note the project ref and database password —
you'll need them for the connection strings below.

## 2. Connection strings

Supabase exposes two useful ports for Postgres:

- **6543** — PgBouncer (transaction pooling). Use this for `DATABASE_URL`,
  since Next.js server actions and API routes open many short-lived
  connections (serverless-style).
- **5432** — direct connection. Use this for `DIRECT_URL`, which Prisma
  needs for `prisma migrate deploy` (migrations don't work reliably through
  a pooler).

```
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

Both are already declared in `prisma/schema.prisma`'s datasource block (if
not, add `directUrl = env("DIRECT_URL")` alongside `url = env("DATABASE_URL")`).

## 3. Storage (if used for avatars / company logos)

```
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
```

The service role key is server-only — never expose it with `NEXT_PUBLIC_`.
It's only needed if admin actions (e.g. uploading a company logo from
`CompanyDialog`) write to Supabase Storage on the server side.

## 4. Row Level Security (RLS)

Because all Module 16 admin reads/writes go through Prisma using the
**service-role-equivalent** database connection (not the Supabase client
with a user JWT), RLS policies on these tables are not required for the
admin panel to function. If you separately expose any of these tables via
Supabase's auto-generated REST/GraphQL API or client-side Supabase queries,
add RLS policies restricting `Report`, `AuditLog`, `AdminNotification`, and
`UserSuspension` to service-role access only — they should never be
readable/writable directly from the browser.

## 5. Backups

Enable Supabase's daily backups (Settings → Database → Backups) before going
to production — Module 16 introduces destructive admin actions (delete user,
delete company, delete job) that should be recoverable if misused.
