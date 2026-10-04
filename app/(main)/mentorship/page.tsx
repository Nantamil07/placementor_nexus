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
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold">Mentorship</h1>
        <p className="mt-3 text-zinc-400">
          Complete your profile before using mentorship.
        </p>
      </main>
    );
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
