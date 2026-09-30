# Module 07 — Referrals

## What this module adds
- Referral request form
- Referrer selection from existing profiles
- Optional company, job URL, resume URL and notes
- Persistent Referral records through Prisma/PostgreSQL
- Incoming and sent referral lists
- Referrer-only accept/decline actions
- Persistent referral status updates
- REFERRAL_UPDATE notifications
- Authentication and ownership checks
- Duplicate pending-request protection

## Files
- `services/referral/get-referrals.ts`
- `services/referral/create-referral.ts`
- `services/referral/update-referral.ts`
- `components/referral/ReferralRequestForm.tsx`
- `components/referral/ReferralActions.tsx`
- `components/referral/ReferralCard.tsx`
- `app/(main)/referrals/page.tsx`

## Installation
From the project root:

```bash
unzip -o placementor-nexus-module-07-referrals.zip -d /tmp/module07
cp -r /tmp/module07/mod07/services/referral/* services/referral/
cp -r /tmp/module07/mod07/components/referral/* components/referral/
cp -r "/tmp/module07/mod07/app/(main)/referrals/"* "app/(main)/referrals/"
cp /tmp/module07/mod07/README_MODULE_07_REFERRALS.md .
```

No Prisma schema change is required when the provided Referral, Company, Profile and Notification models/enums already exist.

## Validation
```bash
npx tsc --noEmit
npm run build
```

Then open `/referrals` while signed in and test:
1. Send a referral request.
2. Confirm it appears under Sent requests.
3. Sign in as the selected referrer.
4. Confirm it appears under Incoming requests.
5. Accept or decline it.
6. Confirm the status persists after refresh.
7. Confirm the requester receives a referral notification.
