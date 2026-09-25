import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getCurrentUserProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  return await prisma.profile.findUnique({
    where: { clerkId: userId },
    include: {
      skills: true,
      education: {
        orderBy: { startDate: "desc" },
      },
      projects: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export type FullProfile = NonNullable<Awaited<ReturnType<typeof getCurrentUserProfile>>>;
