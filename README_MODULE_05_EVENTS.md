# Module 05 — Events

Built against the existing Event and EventRegistration Prisma models. No schema change is required.

Features: approved upcoming events, search/filter, event details, authenticated event creation, pending approval status, registration, cancellation, persistent registration state, registration counts, organizer information.

The current schema has no capacity/max-attendees field, so capacity is not invented. Admin approval/rejection uses the existing Event.status and rejectionReason fields.

## Install from project root

```bash
unzip -o placementor-nexus-module-05-events.zip -d /tmp/module05
mkdir -p services/events components/events "app/(main)/events"
cp -r /tmp/module05/mod05/services/events/* services/events/
cp -r /tmp/module05/mod05/components/events/* components/events/
cp -r "/tmp/module05/mod05/app/(main)/events/"* "app/(main)/events/"
cp /tmp/module05/mod05/README_MODULE_05_EVENTS.md .
```

Then:
```bash
npx prisma generate
npx tsc --noEmit
npm run build
```
