"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createCommunitySchema = z.object({
  name: z.string().trim().min(3, "Community name must be at least 3 characters.").max(80),
  description: z.string().trim().max(500).optional(),
});

function makeSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export async function createCommunity(input: {
  name: string;
  description?: string;
}): Promise<{ success: boolean; slug?: string; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized. Please sign in." };

  const parsed = createCommunitySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid community details." };
  }

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!profile) return { success: false, error: "Profile not found. Complete onboarding first." };

  const baseSlug = makeSlug(parsed.data.name);
  if (!baseSlug) return { success: false, error: "Community name must contain letters or numbers." };

  let slug = baseSlug;
  for (let i = 2; i <= 100; i++) {
    const exists = await prisma.community.findUnique({ where: { slug }, select: { id: true } });
    if (!exists) break;
    slug = `${baseSlug}-${i}`.slice(0, 60);
  }

  const community = await prisma.community.create({
    data: {
      name: parsed.data.name.trim(),
      slug,
      description: parsed.data.description?.trim() || null,
      isPrivate: false,
      members: {
        create: {
          profileId: profile.id,
          role: "ADMIN",
        },
      },
    },
    select: { slug: true },
  });

  revalidatePath("/communities");
  revalidatePath(`/communities/${community.slug}`);

  return { success: true, slug: community.slug };
}
