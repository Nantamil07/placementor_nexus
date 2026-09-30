"use client";

import { useState, useTransition } from "react";
import {
  createComment,
  CommentItem,
} from "@/services/posts/create-comment";
import { CommentCard } from "./CommentCard";

interface CommentSectionProps {
  postId: string;
  initialComments?: CommentItem[];
  currentProfileId: string;
  onCommentAdded?: (newCount: number) => void;
}

export function CommentSection({
  postId,
  initialComments = [],
  currentProfileId,
  onCommentAdded,
}: CommentSectionProps) {
  const [comments, setComments] =
    useState<CommentItem[]>(initialComments);

  const [inputContent, setInputContent] = useState("");

  const [isPending, startTransition] = useTransition();

  // --------------------------------------------------
  // Create Top-Level Comment
  // --------------------------------------------------

  const handleCreateComment = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedContent = inputContent.trim();

    if (!trimmedContent || isPending) {
      return;
    }

    startTransition(async () => {
      const result = await createComment(
        postId,
        trimmedContent
      );

      if (!result.success || !result.comment) {
        return;
      }

      setComments((previousComments) => {
        const updatedComments = [
          ...previousComments,
          result.comment!,
        ];

        if (onCommentAdded) {
          onCommentAdded(countComments(updatedComments));
        }

        return updatedComments;
      });

      setInputContent("");
    });
  };

  // --------------------------------------------------
  // Create Reply
  // --------------------------------------------------

  const handleReplySubmit = async (
    parentId: string,
    replyContent: string
  ) => {
    const trimmedContent = replyContent.trim();

    if (!trimmedContent) {
      return;
    }

    const result = await createComment(
      postId,
      trimmedContent,
      parentId
    );

    if (!result.success || !result.comment) {
      return;
    }

    const newComment = result.comment;

    setComments((previousComments) => {
      const updatedComments = appendReply(
        previousComments,
        parentId,
        newComment
      );

      if (onCommentAdded) {
        onCommentAdded(countComments(updatedComments));
      }

      return updatedComments;
    });
  };

  // --------------------------------------------------
  // Delete Comment
  // --------------------------------------------------

  const handleCommentDeleted = (commentId: string) => {
    setComments((previousComments) => {
      const updatedComments = removeComment(
        previousComments,
        commentId
      );

      if (onCommentAdded) {
        onCommentAdded(countComments(updatedComments));
      }

      return updatedComments;
    });
  };

  return (
    <div className="mt-4 border-t pt-4">
      {/* New Comment Form */}
      <form
        onSubmit={handleCreateComment}
        className="mb-4 space-y-2"
      >
        <textarea
          value={inputContent}
          onChange={(event) =>
            setInputContent(event.target.value)
          }
          placeholder="Write a comment..."
          rows={3}
          maxLength={2000}
          disabled={isPending}
          className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {inputContent.length}/2000
          </span>

          <button
            type="submit"
            disabled={
              isPending || !inputContent.trim()
            }
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Commenting..." : "Comment"}
          </button>
        </div>
      </form>

      {/* Comments */}
      {comments.length === 0 ? (
        <p className="py-3 text-center text-xs text-muted-foreground">
          No comments yet. Be the first to comment.
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              currentProfileId={currentProfileId}
              onReply={handleReplySubmit}
              onCommentDeleted={handleCommentDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------
// Append Reply
// --------------------------------------------------

function appendReply(
  comments: CommentItem[],
  parentId: string,
  newReply: CommentItem
): CommentItem[] {
  return comments.map((comment) => {
    if (comment.id === parentId) {
      return {
        ...comment,
        replies: [
          ...(comment.replies ?? []),
          newReply,
        ],
      };
    }

    if (
      comment.replies &&
      comment.replies.length > 0
    ) {
      return {
        ...comment,
        replies: appendReply(
          comment.replies,
          parentId,
          newReply
        ),
      };
    }

    return comment;
  });
}

// --------------------------------------------------
// Remove Comment
// --------------------------------------------------

function removeComment(
  comments: CommentItem[],
  commentId: string
): CommentItem[] {
  return comments
    .filter((comment) => comment.id !== commentId)
    .map((comment) => {
      if (
        comment.replies &&
        comment.replies.length > 0
      ) {
        return {
          ...comment,
          replies: removeComment(
            comment.replies,
            commentId
          ),
        };
      }

      return comment;
    });
}

// --------------------------------------------------
// Count Comments Including Nested Replies
// --------------------------------------------------

function countComments(
  comments: CommentItem[]
): number {
  return comments.reduce((total, comment) => {
    const repliesCount = comment.replies
      ? countComments(comment.replies)
      : 0;

    return total + 1 + repliesCount;
  }, 0);
}
