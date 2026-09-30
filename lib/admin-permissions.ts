import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function requireAdmin() {
  const { userId } = await auth();

  // Not signed in
  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await prisma.profile.findUnique({
    where: {
      clerkId: userId,
    },
    select: {
      id: true,
      clerkId: true,
      fullName: true,
      username: true,
      email: true,
      role: true,
      isSuspended: true,
    },
  });

  // Clerk user exists but application profile does not
  if (!profile) {
    redirect("/setup-profile");
  }

  // Suspended users cannot access admin
  if (profile.isSuspended) {
    redirect("/feed");
  }

  // Only ADMIN can access admin routes
  if (profile.role !== "ADMIN") {
    redirect("/feed");
  }

  return profile;
}

export async function isAdmin() {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  const profile = await prisma.profile.findUnique({
    where: {
      clerkId: userId,
    },
    select: {
      role: true,
      isSuspended: true,
    },
  });

  return Boolean(
    profile &&
      profile.role === "ADMIN" &&
      !profile.isSuspended
  );
}
