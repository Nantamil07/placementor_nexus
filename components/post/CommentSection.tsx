"use client";

import { useState, useTransition } from "react";
import { createComment, CommentItem } from "@/services/posts/create-comment";
import { CommentCard } from "./CommentCard";

interface CommentSectionProps {
  postId: string;
  initialComments?: CommentItem[];
  onCommentAdded?: (newCount: number) => void;
}

export function CommentSection({
  postId,
  initialComments = [],
  onCommentAdded,
}: CommentSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [inputContent, setInputContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;

    startTransition(async () => {
      const result = await createComment(postId, inputContent);
      if (result.success && result.comment) {
        setComments((prev) => [...prev, result.comment!]);
        setInputContent("");
        if (onCommentAdded) {
          onCommentAdded(comments.length + 1);
        }
      }
    });
  };

  const handleReplySubmit = async (parentId: string, replyContent: string) => {
    const result = await createComment(postId, replyContent, parentId);
    if (result.success && result.comment) {
      // Recursively insert into state
      const appendReply = (items: CommentItem[]): CommentItem[] => {
        return items.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              replies: [...(item.replies || []), result.comment!],
            };
          }
          if (item.replies && item.replies.length > 0) {
            return { ...item, replies: appendReply(item.replies) };
          }
          return item;
        });
      };

      setComments((prev) => appendReply(prev));
      if (onCommentAdded) {
        onCommentAdded(comments.length + 1);
      }
    }
  };

  return (
    <div className="mt-4 space-y-4 border-t pt-4">
      <form onSubmit={handleCreateComment} className="flex gap-2">
        <input
          type="text"
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
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
              onReplySubmit={handleReplySubmit}
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
