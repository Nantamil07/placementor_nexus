"use client";

import { useState, useTransition } from "react";
import { togglePostBookmark } from "@/services/posts/bookmark-post";

interface BookmarkButtonProps {
  postId: string;
  initialBookmarked?: boolean;
}

export function BookmarkButton({ postId, initialBookmarked = false }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const previous = bookmarked;
    setBookmarked(!previous);

    startTransition(async () => {
      const result = await togglePostBookmark(postId);
      if (!result.success) {
        setBookmarked(previous);
        return;
      }
      setBookmarked(result.bookmarked);
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      title={bookmarked ? "Remove bookmark" : "Bookmark post"}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark post"}
      aria-pressed={bookmarked}
      className={`rounded-md px-2.5 py-1 font-medium transition-colors hover:bg-muted hover:text-foreground ${
        bookmarked ? "text-primary" : "text-muted-foreground"
      }`}
    >
      {bookmarked ? "🔖 Saved" : "🔖 Save"}
    </button>
  );
}
