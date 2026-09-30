"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateReferralStatus(referralId: string, status: "ACCEPTED" | "DECLINED") {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized. Please sign in." };

  const profile = await prisma.profile.findUnique({ where: { clerkId: userId }, select: { id: true } });
  if (!profile) return { success: false, error: "Profile not found." };

  const referral = await prisma.referral.findUnique({
    where: { id: referralId },
    select: { id: true, referrerId: true, requesterId: true, jobTitle: true, status: true },
  });
  if (!referral) return { success: false, error: "Referral request not found." };
  if (referral.referrerId !== profile.id) return { success: false, error: "Only the referrer can update this request." };
  if (referral.status !== "PENDING") return { success: false, error: "This referral request has already been processed." };

  await prisma.referral.update({ where: { id: referralId }, data: { status } });

  await prisma.notification.create({
    data: {
      recipientId: referral.requesterId,
      actorId: profile.id,
      type: "REFERRAL_UPDATE",
      title: `Referral request ${status.toLowerCase()}`,
      message: `${status === "ACCEPTED" ? "Your referral request was accepted" : "Your referral request was declined"} for ${referral.jobTitle}.`,
      link: "/referrals",
    },
  });

  revalidatePath("/referrals");
  return { success: true };
}
