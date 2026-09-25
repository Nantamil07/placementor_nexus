"use client";

import { useState } from "react";
import { CommentItem } from "@/services/posts/create-comment";

interface CommentCardProps {
  comment: CommentItem;
  onReplySubmit: (parentId: string, content: string) => Promise<void>;
}

export function CommentCard({ comment, onReplySubmit }: CommentCardProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await onReplySubmit(comment.id, replyText);
    setReplyText("");
    setShowReplyInput(false);
    setIsSubmitting(false);
  };

  const formattedDate = new Date(comment.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-3 pt-2">
      <div className="flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {comment.author.avatarUrl ? (
            <img
              src={comment.author.avatarUrl}
              alt={comment.author.fullName}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            comment.author.fullName.charAt(0).toUpperCase()
          )}
        </div>

        <div className="flex-1 space-y-1">
          <div className="rounded-xl border bg-muted/30 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">
                  {comment.author.fullName}
                </span>
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase">
                  {comment.author.role.replace("_", " ")}
                </span>
              </div>
              <time className="text-[11px] text-muted-foreground">{formattedDate}</time>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-foreground whitespace-pre-line">
              {comment.content}
            </p>
          </div>

          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="text-[11px] font-medium text-muted-foreground hover:text-foreground"
          >
            {showReplyInput ? "Cancel" : "Reply"}
          </button>

          {showReplyInput && (
            <form onSubmit={handleReply} className="flex gap-2 pt-1">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 rounded-md border bg-background px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={isSubmitting || !replyText.trim()}
                className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground disabled:opacity-50"
              >
                {isSubmitting ? "..." : "Send"}
              </button>
            </form>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-2 border-l-2 border-border pl-3 space-y-3 pt-1">
              {comment.replies.map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  onReplySubmit={onReplySubmit}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
