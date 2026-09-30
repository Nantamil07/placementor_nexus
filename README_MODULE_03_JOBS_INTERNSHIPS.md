# Module 03 — Jobs & Internships

This module replaces the original hardcoded job data with PostgreSQL/Prisma-backed job discovery and adds persistent applications.

## Included

- `services/jobs/get-jobs.ts`
  - Reads only `APPROVED` jobs from PostgreSQL.
  - Search by title, description, or company name.
  - Filter by job type and location.
  - Pagination metadata.
- `services/jobs/get-job.ts`
  - Reads an approved job by ID.
  - Loads company information.
  - Detects whether the signed-in profile already applied.
- `services/jobs/apply-job.ts`
  - Clerk authentication.
  - Resolves the local Profile.
  - Prevents applying to unapproved jobs.
  - Prevents duplicate applications using the existing Prisma unique constraint.
  - Persists `JobApplication` with `APPLIED` status.
- `components/jobs/JobCard.tsx`
  - Database-backed job card.
- `components/jobs/ApplyButton.tsx`
  - Persistent Apply Now / Applied state.
- `app/(main)/jobs/page.tsx`
  - Job/internship listing with search, type, and location filters.
- `app/(main)/jobs/[id]/page.tsx`
  - Job detail page and application flow.

## Database changes

No Prisma schema changes are required. The existing `Company`, `Job`, and `JobApplication` models are used.

## Important

Only `APPROVED` jobs are visible on the public jobs pages. Existing admin job moderation remains responsible for approving/rejecting postings.

## Apply

Copy these files into the corresponding paths in your project. Do not run a database reset.

Then run:

```bash
npx prisma generate
npx tsc --noEmit
npm run build
```

## Manual test

1. Ensure an approved Job and Company exist in the database.
2. Open `/jobs`.
3. Search/filter jobs.
4. Open a job detail page.
5. Sign in and click **Apply Now**.
6. Confirm a `JobApplication` row is created.
7. Refresh the page and confirm it shows **Applied**.
8. Try applying again and confirm duplicate application is rejected.
9. Verify pending/rejected jobs do not appear on `/jobs`.
