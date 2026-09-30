"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleCompanyFollow(companyId: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, following: false, error: "Unauthorized. Please sign in." };

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!profile) return { success: false, following: false, error: "Profile not found." };

  const company = await prisma.company.findUnique({ where: { id: companyId }, select: { id: true, slug: true } });
  if (!company) return { success: false, following: false, error: "Company not found." };

  const existing = await prisma.companyFollower.findUnique({
    where: { companyId_profileId: { companyId, profileId: profile.id } },
  });

  if (existing) {
    await prisma.companyFollower.delete({ where: { id: existing.id } });
  } else {
    await prisma.companyFollower.create({ data: { companyId, profileId: profile.id } });
  }

  revalidatePath("/companies");
  revalidatePath(`/companies/${company.slug}`);

  return { success: true, following: !existing };
}
