"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type UpdateProfileInput = {
  headline?: string;
  bio?: string;
  avatarUrl?: string;
};

export async function updateProfile(input: UpdateProfileInput) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const updated = await prisma.profile.update({
      where: { clerkId: userId },
      data: {
        headline: input.headline,
        bio: input.bio,
        avatarUrl: input.avatarUrl,
      },
    });

    revalidatePath("/profile");
    return { success: true, profile: updated };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile." };
  }
}
