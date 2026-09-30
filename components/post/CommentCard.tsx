"use client";

import { useState } from "react";
import { CommentItem } from "@/services/posts/create-comment";
import { deleteComment } from "@/services/posts/delete-comment";

interface CommentCardProps {
  comment: CommentItem;
  currentProfileId: string;
  onReply: (parentId: string, content: string) => Promise<void>;
  onCommentDeleted: (commentId: string) => void;
  depth?: number;
}

export function CommentCard({
  comment,
  currentProfileId,
  onReply,
  onCommentDeleted,
  depth = 0,
}: CommentCardProps) {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isOwner = comment.author.id === currentProfileId;

  const handleReply = async () => {
    const trimmedContent = replyContent.trim();

    if (!trimmedContent || isReplying) {
      return;
    }

    setIsReplying(true);

    try {
      await onReply(comment.id, trimmedContent);

      setReplyContent("");
      setShowReply(false);
    } finally {
      setIsReplying(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const result = await deleteComment(comment.id);

      if (!result.success) {
        setDeleteError(
          result.error ?? "Failed to delete comment."
        );
        return;
      }

      // Tell CommentSection that this comment was deleted.
      onCommentDeleted(comment.id);
    } catch {
      setDeleteError(
        "Something went wrong while deleting the comment."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={depth > 0 ? "ml-6 border-l pl-4" : ""}>
      <div className="rounded-lg bg-muted/40 p-3">
        {/* Comment Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Avatar */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-xs font-bold text-primary">
              {comment.author.avatarUrl ? (
                <img
                  src={comment.author.avatarUrl}
                  alt={comment.author.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                comment.author.fullName
                  .charAt(0)
                  .toUpperCase()
              )}
            </div>

            {/* Author */}
            <div>
              <div className="text-xs font-semibold text-foreground">
                {comment.author.fullName}
              </div>

              <div className="text-[11px] text-muted-foreground">
                @{comment.author.username}
              </div>
            </div>
          </div>

          {/* Delete */}
          {isOwner && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="shrink-0 text-[11px] font-medium text-destructive transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>

        {/* Comment Content */}
        <p className="mt-2 whitespace-pre-line text-sm text-foreground">
          {comment.content}
        </p>

        {/* Comment Actions */}
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowReply((current) => !current)}
            disabled={isDeleting}
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            {showReply ? "Cancel" : "Reply"}
          </button>
        </div>

        {/* Delete Error */}
        {deleteError && (
          <p className="mt-2 text-xs text-destructive">
            {deleteError}
          </p>
        )}

        {/* Reply Form */}
        {showReply && (
          <div className="mt-3 space-y-2">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
              maxLength={2000}
              disabled={isReplying}
              className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                {replyContent.length}/2000
              </span>

              <button
                type="button"
                onClick={handleReply}
                disabled={
                  isReplying || !replyContent.trim()
                }
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isReplying ? "Replying..." : "Reply"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {comment.replies &&
        comment.replies.length > 0 && (
          <div className="mt-2 space-y-2">
            {comment.replies.map((reply) => (
              <CommentCard
                key={reply.id}
                comment={reply}
                currentProfileId={currentProfileId}
                onReply={onReply}
                onCommentDeleted={onCommentDeleted}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
    </div>
  );
}
