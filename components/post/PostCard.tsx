"use client";

import { useState } from "react";
import { PostItem } from "@/services/posts/get-feed";

interface PostCardProps {
  post: PostItem;
}

export function PostCard({ post }: PostCardProps) {
  const [upvotes, setUpvotes] = useState(post.upvotesCount);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const toggleUpvote = () => {
    if (hasUpvoted) {
      setUpvotes((prev) => prev - 1);
      setHasUpvoted(false);
    } else {
      setUpvotes((prev) => prev + 1);
      setHasUpvoted(true);
    }
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="rounded-xl border bg-card p-5 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {post.author.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                alt={post.author.fullName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              post.author.fullName.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {post.author.fullName}
              </span>
              <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground uppercase">
                {post.author.role.replace("_", " ")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>@{post.author.username}</span>
              <span>•</span>
              <time dateTime={post.createdAt}>{formattedDate}</time>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3.5 whitespace-pre-line text-sm leading-relaxed text-foreground">
        {post.content}
      </div>

      <div className="mt-4 flex items-center gap-4 border-t pt-3 text-xs text-muted-foreground">
        <button
          onClick={toggleUpvote}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors ${
            hasUpvoted
              ? "bg-primary/10 text-primary font-semibold"
              : "hover:bg-muted hover:text-foreground"
          }`}
        >
          <span>▲</span>
          <span>{upvotes} Upvotes</span>
        </button>

        <div className="flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium">
          <span>💬</span>
          <span>{post.commentsCount} Comments</span>
        </div>

        <button
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
            }
          }}
          className="ml-auto rounded-md px-2.5 py-1 transition-colors hover:bg-muted hover:text-foreground"
        >
          Share
        </button>
      </div>
    </article>
  );
}
