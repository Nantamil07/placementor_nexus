import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMentors, getMyMentorships } from "@/services/mentor/get-mentors";
import MentorshipClient from "@/components/mentor/MentorshipClient";

export default async function MentorshipPage() {
  const { userId } = await requireAuth();

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!profile) {
    redirect("/setup-profile");
    return null;
  }

  const [mentors, mentorships] = await Promise.all([
    getMentors(),
    getMyMentorships(profile.id),
  ]);

  return (
    <MentorshipClient
      mentors={mentors}
      mentorships={mentorships}
    />
  );
}
