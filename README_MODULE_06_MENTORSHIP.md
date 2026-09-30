# Module 06 — Mentorship

Uses the existing `Profile`, `MentorshipSession`, `Notification`, `UserRole`, and `MentorshipStatus` schema.

## Features
- Mentor directory using `Profile.role = MENTOR`
- Search by name, username, headline, or bio
- Mentor skills display
- Send mentorship request with a topic
- Mentor accepts/declines requests
- Mentor marks confirmed sessions completed
- Mentor or mentee can cancel requested/confirmed sessions
- Persistent state in PostgreSQL
- Mentorship notifications
- Authentication and authorization checks

## Status flow
`REQUESTED -> CONFIRMED -> COMPLETED`

Cancellation is allowed from `REQUESTED` or `CONFIRMED`.

## Install

```bash
unzip -o placementor-nexus-module-06-mentorship.zip -d /tmp/module06
mkdir -p services/mentor components/mentor "app/(main)/mentorship"
cp -r /tmp/module06/mod06/services/mentor/* services/mentor/
cp -r /tmp/module06/mod06/components/mentor/* components/mentor/
cp -r /tmp/module06/mod06/app/(main)/mentorship/* "app/(main)/mentorship/"
cp /tmp/module06/mod06/README_MODULE_06_MENTORSHIP.md .
```

Then:
```bash
npx prisma generate
npx tsc --noEmit
npm run build
```
