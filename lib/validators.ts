import { z } from "zod";

export const RoleEnum = z.enum([
  "STUDENT",
  "ALUMNI",
  "MENTOR",
  "RECRUITER",
  "PLACEMENT_OFFICER",
  "ADMIN",
]);

export type UserRole = z.infer<typeof RoleEnum>;

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export const UsernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
  );
