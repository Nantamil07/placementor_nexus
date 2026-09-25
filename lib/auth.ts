import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/validators";

export async function getAuthSession() {
  return await auth();
}

export async function getCurrentClerkUser() {
  return await currentUser();
}

export async function getCurrentProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  return await prisma.profile.findUnique({
    where: { clerkId: userId },
  });
}

export async function requireAuth() {
  const session = await auth();
  if (!session.userId) {
    redirect("/sign-in");
  }
  return session;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await requireAuth();
  const profile = await prisma.profile.findUnique({
    where: { clerkId: session.userId },
  });

  if (!profile || !allowedRoles.includes(profile.role as UserRole)) {
    redirect("/sign-in");
  }

  return { session, profile };
}
