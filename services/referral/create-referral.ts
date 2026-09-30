"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createReferral(input: {
  referrerId: string;
  companyId?: string;
  jobTitle: string;
  jobUrl?: string;
  resumeUrl?: string;
  notes?: string;
}) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized. Please sign in." };

  const requester = await prisma.profile.findUnique({ where: { clerkId: userId }, select: { id: true } });
  if (!requester) return { success: false, error: "Profile not found." };
  if (requester.id === input.referrerId) return { success: false, error: "You cannot request a referral from yourself." };

  const jobTitle = input.jobTitle.trim();
  if (!jobTitle) return { success: false, error: "Job title is required." };

  const referrer = await prisma.profile.findUnique({ where: { id: input.referrerId }, select: { id: true, fullName: true } });
  if (!referrer) return { success: false, error: "Referrer not found." };

  if (input.companyId) {
    const company = await prisma.company.findUnique({ where: { id: input.companyId }, select: { id: true } });
    if (!company) return { success: false, error: "Company not found." };
  }

  const duplicate = await prisma.referral.findFirst({
    where: { requesterId: requester.id, referrerId: input.referrerId, jobTitle, status: "PENDING" },
    select: { id: true },
  });
  if (duplicate) return { success: false, error: "You already have a pending referral request for this role with this person." };

  const referral = await prisma.referral.create({
    data: {
      requesterId: requester.id,
      referrerId: input.referrerId,
      companyId: input.companyId || null,
      jobTitle,
      jobUrl: input.jobUrl?.trim() || null,
      resumeUrl: input.resumeUrl?.trim() || null,
      notes: input.notes?.trim() || null,
    },
  });

  await prisma.notification.create({
    data: {
      recipientId: input.referrerId,
      actorId: requester.id,
      type: "REFERRAL_UPDATE",
      title: "New referral request",
      message: `You received a referral request for ${jobTitle}.`,
      link: "/referrals",
    },
  });

  revalidatePath("/referrals");
  return { success: true, referralId: referral.id };
}
