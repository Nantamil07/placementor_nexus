# Module 01 — Feed Completion

This module is designed for the uploaded Placementor Nexus source tree.

## Included

- Prisma-backed feed retrieval
- Persistent post voting with upvote/downvote/toggle behavior
- Persistent nested comments and replies
- Persistent comment retrieval and owner deletion compatibility
- Persistent post bookmarks
- Bookmark UI with optimistic state
- Existing post edit/delete integration preserved
- Feed `PostItem` now carries `userVote` and `isBookmarked`
- Fixes the `VoteButtons`/`PostCard` prop mismatch and `CommentSection`/`CommentCard` integration

## Files to copy

Copy the contents of this ZIP into the root of the existing project, preserving the directory structure.

## No Prisma schema change

The uploaded project already contains `PostVote` and `PostBookmark` with the required unique constraints, so this module does not change `prisma/schema.prisma`.

## Commands

```bash
npm install
npx prisma generate
npx tsc --noEmit
npm run build
```

Do **not** run a destructive database reset.

## Manual verification

1. Open `/feed` while signed in.
2. Create a post and refresh — it should remain.
3. Upvote, downvote, and toggle the same vote — refresh and verify persistence.
4. Open comments, create a comment, create nested replies, refresh and verify persistence.
5. Delete your own comment and verify the visible count updates.
6. Edit and delete your own post.
7. Click **Save** on a post, refresh, and verify it remains saved.
8. Click **Saved** again and verify it is removed.

## Important

This ZIP intentionally contains only the files needed for Module 01. It does not include `.env`, `.env.local`, `node_modules`, `.next`, or `.git`.
