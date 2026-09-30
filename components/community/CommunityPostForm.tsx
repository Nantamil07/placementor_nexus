"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/services/posts/create-post";

export function CommunityPostForm({ communityId }: { communityId: string }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!content.trim()) return;
    setError(null);
    startTransition(async () => {
      const result = await createPost({ content, communityId });
      if (!result.success) {
        setError(result.error ?? "Could not publish post.");
        return;
      }
      setContent("");
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="rounded-xl border bg-card p-4 shadow-xs">
      <textarea
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={2000}
        placeholder="Start a discussion in this community..."
        className="w-full resize-none rounded-lg border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      <div className="mt-3 flex items-center justify-between border-t pt-3">
        <span className="text-xs text-muted-foreground">{content.length} / 2000</span>
        <button disabled={isPending || !content.trim()} className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50">
          {isPending ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
