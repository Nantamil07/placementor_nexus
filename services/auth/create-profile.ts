"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { setupProfileSchema, SetupProfileInput } from "@/lib/validators/profile";
import { isUsernameAvailable } from "./check-username";

export type CreateProfileResult = {
  success: boolean;
  error?: string;
};

export async function createProfile(
  input: SetupProfileInput
): Promise<CreateProfileResult> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized. Please sign in." };
  }

  const clerkUser = await currentUser();
  const primaryEmail =
    clerkUser?.emailAddresses[0]?.emailAddress ?? `${userId}@nexus.internal`;

  const parsed = setupProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const data = parsed.data;
  const username = data.username.toLowerCase();

  const available = await isUsernameAvailable(username);
  if (!available) {
    return { success: false, error: "Username is already registered." };
  }

  const startDate = new Date(data.graduationYear - 4, 7, 1);
  const endDate = new Date(data.graduationYear, 5, 30);

  await prisma.profile.upsert({
    where: { clerkId: userId },
    update: {
      username,
      fullName: data.fullName,
      bio: data.bio || null,
      headline: `${data.role} | ${data.department} at ${data.college}`,
      role: data.role,
      isOnboarded: true,
      education: {
        create: {
          institution: data.college,
          fieldOfStudy: data.department,
          degree: data.role === "STUDENT" ? "Undergraduate Studies" : "Degree",
          startDate,
          endDate,
          grade: data.cgpa || null,
        },
      },
    },
    create: {
      clerkId: userId,
      email: primaryEmail,
      username,
      fullName: data.fullName,
      avatarUrl: clerkUser?.imageUrl || null,
      bio: data.bio || null,
      headline: `${data.role} | ${data.department} at ${data.college}`,
      role: data.role,
      isOnboarded: true,
      education: {
        create: {
          institution: data.college,
          fieldOfStudy: data.department,
          degree: data.role === "STUDENT" ? "Undergraduate Studies" : "Degree",
          startDate,
          endDate,
          grade: data.cgpa || null,
        },
      },
    },
  });

  return { success: true };
}
