import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMentors, getMyMentorships } from "@/services/mentor/get-mentors";
import { MentorCard } from "@/components/mentor/MentorCard";
import { MentorshipRequestForm } from "@/components/mentor/MentorshipRequestForm";
import { MentorshipActions } from "@/components/mentor/MentorshipActions";

export default async function MentorshipPage({ searchParams }: { searchParams: { q?: string; mentor?: string } }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const me = await prisma.profile.findUnique({ where: { clerkId: userId }, select: { id: true } });
  if (!me) redirect("/setup-profile");

  const [mentors, sessions] = await Promise.all([getMentors(searchParams.q), getMyMentorships(me.id)]);
  const selectedMentor = searchParams.mentor ? mentors.find(m => m.id === searchParams.mentor) : null;

  return <main className="mx-auto max-w-6xl px-4 py-8">
    <h1 className="text-2xl font-bold">Mentorship</h1>
    <p className="mt-1 text-sm text-muted-foreground">Find mentors and manage your mentorship requests.</p>

    <form className="mt-6 flex gap-2"><input name="q" defaultValue={searchParams.q ?? ""} placeholder="Search mentors..." className="flex-1 rounded-md border bg-background px-3 py-2" /><button className="rounded-md bg-secondary px-4 py-2 text-sm">Search</button></form>

    {selectedMentor && <MentorshipRequestForm mentor={{ id: selectedMentor.id, fullName: selectedMentor.fullName }} />}

    <section className="mt-8">
      <h2 className="text-lg font-semibold">Your mentorships</h2>
      {sessions.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No mentorship requests yet.</p> : <div className="mt-3 space-y-3">{sessions.map(s => {
        const other = s.mentorId === me.id ? s.mentee : s.mentor;
        return <div key={s.id} className="rounded-xl border bg-card p-4"><div className="flex flex-wrap justify-between gap-2"><div><p className="font-medium">{other.fullName} <span className="text-sm text-muted-foreground">@{other.username}</span></p><p className="mt-1 text-sm text-muted-foreground">{s.topic}</p></div><span className="rounded-md bg-muted px-2 py-1 text-xs">{s.status}</span></div><p className="mt-2 text-xs text-muted-foreground">Created {new Date(s.createdAt).toLocaleString()}</p><MentorshipActions id={s.id} status={s.status} canManage={s.mentorId === me.id} /></div>;
      })}</div>}
    </section>

    <section className="mt-10"><h2 className="text-lg font-semibold">Available mentors</h2>{mentors.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No mentors found.</p> : <div className="mt-4 grid gap-5 md:grid-cols-2">{mentors.map(m => <MentorCard key={m.id} mentor={m} />)}</div>}</section>
  </main>;
}
