import { prisma } from "@/lib/prisma";

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const cleanUsername = username.trim().toLowerCase();

  if (cleanUsername.length < 3 || cleanUsername.length > 30) {
    return false;
  }

  const existingProfile = await prisma.profile.findUnique({
    where: { username: cleanUsername },
    select: { id: true },
  });

  return !existingProfile;
}
