import { z } from "zod";
import { UsernameSchema } from "../validators";

export const ProfileRoleEnum = z.enum([
  "STUDENT",
  "ALUMNI",
  "MENTOR",
  "RECRUITER",
  "PLACEMENT_OFFICER",
]);

export const setupProfileSchema = z.object({
  username: UsernameSchema,
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
  role: ProfileRoleEnum,
  college: z.string().trim().min(2, "College/Institution is required").max(120),
  department: z.string().trim().min(2, "Department/Major is required").max(100),
  graduationYear: z.coerce
    .number()
    .int()
    .min(1980, "Year must be 1980 or later")
    .max(2035, "Year cannot exceed 2035"),
  cgpa: z
    .string()
    .trim()
    .regex(/^([0-9](\.[0-9]{1,2})?|10(\.0{1,2})?)$/, "Enter a valid CGPA (e.g. 8.75 or 9.0)")
    .optional()
    .or(z.literal("")),
  bio: z.string().trim().max(300, "Bio must be under 300 characters").optional(),
});

export type SetupProfileInput = z.infer<typeof setupProfileSchema>;
