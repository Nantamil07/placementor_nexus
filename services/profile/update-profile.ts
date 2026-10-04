"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100),
  headline: z
    .string()
    .trim()
    .max(150, "Headline must be under 150 characters"),
  bio: z
    .string()
    .trim()
    .max(300, "Bio must be under 300 characters"),
  avatarUrl: z
    .string()
    .trim()
    .url("Enter a valid image URL")
    .or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export async function updateProfile(input: UpdateProfileInput) {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const parsed = updateProfileSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid profile data",
    };
  }

  try {
    const updated = await prisma.profile.update({
      where: {
        clerkId: userId,
      },
      data: {
        fullName: parsed.data.fullName,
        headline: parsed.data.headline || null,
        bio: parsed.data.bio || null,
        avatarUrl: parsed.data.avatarUrl || null,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/feed");
    revalidatePath("/network");

    return {
      success: true,
      profile: updated,
    };
  } catch (error) {
    console.error("Error updating profile:", error);

    return {
      success: false,
      error: "Failed to update profile.",
    };
  }
}
