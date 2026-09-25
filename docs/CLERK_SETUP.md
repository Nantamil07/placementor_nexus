# Clerk Setup

## 1. Create a production instance

In the Clerk dashboard, create (or promote) an application instance for
production. Development and production instances have separate keys — don't
mix `pk_test_...` / `sk_test_...` with production traffic.

## 2. Required environment variables

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/feed
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

## 3. Allowed redirect / origin URLs

In Clerk → **Paths**, set your production domain as an allowed origin, and
confirm the sign-in/sign-up/after-auth paths above match your routes in
`app/(auth)`.

## 4. Session token claims

`lib/auth.ts` reads `userId` from Clerk's session and looks up the matching
`Profile` by `clerkId`. No custom session claims are required for Module 16 —
role-based access control is fully database-driven (`Profile.role`), not
stored in the Clerk session, so role changes made in `/admin/users` take
effect immediately without the user needing to re-authenticate.

## 5. Admin access model

- Clerk verifies **who** the user is (`auth.protect()` in `middleware.ts`
  guards `/admin/**` at the session level).
- `requireAdmin()` in `lib/admin-permissions.ts` then verifies **what** they
  can do, by reading `Profile.role` from Postgres. Only `ADMIN` and
  `PLACEMENT_OFFICER` pass; everyone else is redirected to `/`, and signed-out
  users are redirected to `/sign-in`.

## 6. Webhook (optional but recommended)

If you sync Clerk users into your `Profile` table via a webhook on
`user.created` / `user.updated`, make sure:

- The webhook endpoint path is included in `middleware.ts`'s public route
  matcher (`/api/webhook(.*)` already is).
- The webhook sets a sane default `role` (e.g. `STUDENT`) — admins are
  promoted manually or via `ADMIN_BOOTSTRAP_EMAILS`, never by self-signup.
