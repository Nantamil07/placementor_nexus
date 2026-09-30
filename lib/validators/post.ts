import { z } from "zod";

export const createPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Post content cannot be empty")
    .max(2000, "Post cannot exceed 2000 characters"),
  communityId: z.string().optional(),
});

export const updatePostSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  content: z
    .string()
    .trim()
    .min(1, "Post content cannot be empty")
    .max(2000, "Post cannot exceed 2000 characters"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
