"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/services/posts/create-post";

interface CreatePostProps {
  authorName: string;
  avatarUrl?: string | null;
}

export function CreatePost({ authorName, avatarUrl }: CreatePostProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setErrorMessage(null);

    startTransition(async () => {
      const result = await createPost({ content });
      if (!result.success) {
        setErrorMessage(result.error ?? "Failed to create post.");
        return;
      }

      setContent("");
      router.refresh();
    });
  };

  return (
    <div className="rounded-xl border bg-card p-4 shadow-xs">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={authorName}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            authorName.charAt(0).toUpperCase()
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-3">
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share placement tips, interview experiences, or ask the campus community..."
            className="w-full resize-none rounded-lg border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            maxLength={2000}
          />

          {errorMessage && (
            <p className="text-xs text-destructive">{errorMessage}</p>
          )}

          <div className="flex items-center justify-between border-t pt-2">
            <span className="text-xs text-muted-foreground">
              {content.length} / 2000 characters
            </span>

            <button
              type="submit"
              disabled={isPending || !content.trim()}
              className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:bg-primary/90 disabled:opacity-50"
            >
              {isPending ? "Publishing..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
