import { z } from "zod";

export const createPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Post content cannot be empty")
    .max(2000, "Post cannot exceed 2000 characters"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
