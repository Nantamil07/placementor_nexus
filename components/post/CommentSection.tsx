"use client";

import { useState, useTransition } from "react";
import { createComment, CommentItem } from "@/services/posts/create-comment";
import { CommentCard } from "./CommentCard";

interface CommentSectionProps {
  postId: string;
  initialComments?: CommentItem[];
  currentProfileId: string;
  onCommentAdded?: (newCount: number) => void;
}

function removeComment(items: CommentItem[], commentId: string): CommentItem[] {
  return items
    .filter((item) => item.id !== commentId)
    .map((item) => ({
      ...item,
      replies: item.replies ? removeComment(item.replies, commentId) : [],
    }));
}

function appendReply(items: CommentItem[], parentId: string, reply: CommentItem): CommentItem[] {
  return items.map((item) => {
    if (item.id === parentId) {
      return { ...item, replies: [...(item.replies ?? []), reply] };
    }
    return item.replies?.length
      ? { ...item, replies: appendReply(item.replies, parentId, reply) }
      : item;
  });
}

export function CommentSection({
  postId,
  initialComments = [],
  currentProfileId,
  onCommentAdded,
}: CommentSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [inputContent, setInputContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleCreateComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;

    startTransition(async () => {
      const result = await createComment(postId, inputContent);
      if (!result.success || !result.comment) return;
      setComments((prev) => [...prev, result.comment!]);
      setInputContent("");
      onCommentAdded?.(comments.length + 1);
    });
  };

  const handleReply = async (parentId: string, replyContent: string) => {
    const result = await createComment(postId, replyContent, parentId);
    if (!result.success || !result.comment) return;
    setComments((prev) => appendReply(prev, parentId, result.comment!));
    onCommentAdded?.(comments.length + 1);
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments((prev) => removeComment(prev, commentId));
    onCommentAdded?.(Math.max(0, comments.length - 1));
  };

  return (
    <div className="mt-4 space-y-4 border-t pt-4">
      <form onSubmit={handleCreateComment} className="flex gap-2">
        <input
          type="text"
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          maxLength={2000}
          placeholder="Add a constructive thought or question..."
          className="flex-1 rounded-lg border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={isPending || !inputContent.trim()}
          className="rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "Posting..." : "Comment"}
        </button>
      </form>

      <div className="space-y-3">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              currentProfileId={currentProfileId}
              onReply={handleReply}
              onCommentDeleted={handleCommentDeleted}
            />
          ))
        ) : (
          <p className="py-2 text-center text-xs text-muted-foreground">
            No comments yet. Start the conversation!
          </p>
        )}
      </div>
    </div>
  );
}
