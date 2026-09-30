"use client";

import { useState } from "react";
import { PostItem } from "@/services/posts/get-feed";
import {
  getCommentsForPost,
  CommentItem,
} from "@/services/posts/create-comment";
import { updatePost } from "@/services/posts/update-post";
import { deletePost } from "@/services/posts/delete-post";
import { VoteButtons } from "./VoteButtons";
import { CommentSection } from "./CommentSection";

interface PostCardProps {
  post: PostItem;
  currentProfileId: string;
}

export function PostCard({
  post,
  currentProfileId,
}: PostCardProps) {
  const [commentsCount, setCommentsCount] = useState(
    post.commentsCount
  );

  const [comments, setComments] = useState<CommentItem[] | null>(
    null
  );

  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete state
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isOwner = post.authorId === currentProfileId;

  const formattedDate = new Date(post.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  // --------------------------------------------------
  // Comments
  // --------------------------------------------------

  const handleToggleComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }

    setShowComments(true);

    if (comments !== null) {
      return;
    }

    setLoadingComments(true);

    try {
      const result = await getCommentsForPost(post.id);
      setComments(result);
    } finally {
      setLoadingComments(false);
    }
  };

  // --------------------------------------------------
  // Edit Post
  // --------------------------------------------------

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      setEditError("Post content cannot be empty.");
      return;
    }

    setIsSavingEdit(true);
    setEditError(null);

    try {
      const result = await updatePost({
        postId: post.id,
        content: editContent,
      });

      if (!result.success || !result.post) {
        setEditError(
          result.error ?? "Failed to update post."
        );
        return;
      }

      setEditContent(result.post.content);
      setIsEditing(false);
    } catch {
      setEditError(
        "Something went wrong while updating the post."
      );
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(post.content);
    setEditError(null);
    setIsEditing(false);
  };

  // --------------------------------------------------
  // Delete Post
  // --------------------------------------------------

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const result = await deletePost(post.id);

      if (!result.success) {
        setDeleteError(
          result.error ?? "Failed to delete post."
        );
        return;
      }

      // Refresh the feed so the soft-deleted post disappears.
      window.location.reload();
    } catch {
      setDeleteError(
        "Something went wrong while deleting the post."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <article className="rounded-xl border bg-card p-5 shadow-xs transition-shadow hover:shadow-sm">
      {/* --------------------------------------------- */}
      {/* Post Header */}
      {/* --------------------------------------------- */}

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
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

          {/* Author Information */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {post.author.fullName}
              </span>

              <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium uppercase text-muted-foreground">
                {post.author.role.replace("_", " ")}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>@{post.author.username}</span>

              <span>•</span>

              <time dateTime={post.createdAt}>
                {formattedDate}
              </time>
            </div>
          </div>
        </div>

        {/* --------------------------------------------- */}
        {/* Owner Actions */}
        {/* --------------------------------------------- */}

        {isOwner && !isEditing && (
          <div className="flex items-center gap-1">
            {/* Edit */}
            <button
              type="button"
              onClick={() => {
                setEditContent(post.content);
                setEditError(null);
                setDeleteError(null);
                setIsEditing(true);
              }}
              disabled={isDeleting}
              className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              Edit
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-md px-2.5 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      {/* --------------------------------------------- */}
      {/* Delete Error */}
      {/* --------------------------------------------- */}

      {deleteError && (
        <p className="mt-3 text-xs text-destructive">
          {deleteError}
        </p>
      )}

      {/* --------------------------------------------- */}
      {/* Post Content / Edit Mode */}
      {/* --------------------------------------------- */}

      {isEditing ? (
        <div className="mt-3.5 space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            maxLength={2000}
            rows={5}
            autoFocus
            className="w-full resize-y rounded-lg border bg-background px-3 py-2 text-sm leading-relaxed text-foreground outline-none focus:ring-2 focus:ring-primary"
          />

          <div className="flex items-center justify-between">
            {/* Character Counter */}
            <span className="text-xs text-muted-foreground">
              {editContent.length}/2000
            </span>

            {/* Edit Actions */}
            <div className="flex items-center gap-2">
              {/* Cancel */}
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSavingEdit}
                className="rounded-md px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>

              {/* Save */}
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={
                  isSavingEdit || !editContent.trim()
                }
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:bg-primary/90 disabled:opacity-50"
              >
                {isSavingEdit ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          {/* Edit Error */}
          {editError && (
            <p className="text-xs text-destructive">
              {editError}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-3.5 whitespace-pre-line text-sm leading-relaxed text-foreground">
          {post.content}
        </div>
      )}

      {/* --------------------------------------------- */}
      {/* Post Actions */}
      {/* --------------------------------------------- */}

      <div className="mt-4 flex items-center gap-4 border-t pt-3 text-xs text-muted-foreground">
        {/* Vote */}
        <VoteButtons
          postId={post.id}
          initialScore={post.upvotesCount}
          initialVote={post.userVote as -1 | 0 | 1}
        />

        {/* Comments */}
        <button
          type="button"
          onClick={handleToggleComments}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors hover:bg-muted hover:text-foreground"
        >
          <span>💬</span>

          <span>
            {commentsCount} Comments
          </span>
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(
                window.location.href
              );
            }
          }}
          className="ml-auto rounded-md px-2.5 py-1 transition-colors hover:bg-muted hover:text-foreground"
        >
          Share
        </button>
      </div>

      {/* --------------------------------------------- */}
      {/* Comments Section */}
      {/* --------------------------------------------- */}

      {showComments && (
        <div>
          {loadingComments ? (
            <div className="mt-4 border-t pt-4 text-center text-xs text-muted-foreground">
              Loading comments...
            </div>
          ) : (
            <CommentSection
  postId={post.id}
  initialComments={comments ?? []}
  currentProfileId={currentProfileId}
  onCommentAdded={(newCount) => {
    setCommentsCount(newCount);
  }}
/>
          )}
        </div>
      )}
    </article>
  );
}
