# Placementor Nexus — Module 02: Communities

## Included
- Prisma-backed community listing and detail retrieval
- Persistent join/leave membership
- Ban-aware membership checks
- Community creation for authenticated users
- Automatic unique slug generation
- Creator becomes community ADMIN member
- Community-specific post creation
- Community-specific post listing
- Community pages and responsive UI

## Apply
Extract this ZIP into the project root and overwrite the included files.

Then run:

```bash
npm install
npx prisma generate
npx tsc --noEmit
npm run build
```

No database reset is required. No migration is required because this module uses the existing Community and CommunityMember Prisma models.

## Manual test
1. Open `/communities`.
2. Create a community.
3. Confirm it redirects to the new community page.
4. Confirm the creator is already a member.
5. Open the community from another signed-in account and join it.
6. Refresh and confirm membership persists.
7. Create a community post.
8. Refresh and confirm the post persists in PostgreSQL.
9. Leave the community and confirm the join state changes.
