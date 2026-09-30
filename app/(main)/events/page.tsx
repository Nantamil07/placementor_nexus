import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getEvents } from "@/services/events/get-events";
import { EventCard } from "@/components/events/EventCard";

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string }> }) {
  const params = await searchParams; const { userId } = await auth();
  const profile = userId ? await prisma.profile.findUnique({ where: { clerkId: userId }, select: { id: true } }) : null;
  const type = ["WEBINAR", "HACKATHON", "PLACEMENT_DRIVE", "WORKSHOP"].includes(params.type ?? "") ? params.type as "WEBINAR" | "HACKATHON" | "PLACEMENT_DRIVE" | "WORKSHOP" : undefined;
  const events = await getEvents({ search: params.q, type, profileId: profile?.id });
  return <main className="mx-auto max-w-6xl px-4 py-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-bold">Events</h1><p className="mt-1 text-sm text-muted-foreground">Discover approved webinars, workshops, hackathons, and placement drives.</p></div>{userId && <Link href="/events/create" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Create Event</Link>}</div><form className="mt-6 grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-[1fr_auto]"><input name="q" defaultValue={params.q ?? ""} placeholder="Search events..." className="rounded-md border bg-background px-3 py-2"/><select name="type" defaultValue={params.type ?? ""} className="rounded-md border bg-background px-3 py-2"><option value="">All types</option><option value="WEBINAR">Webinar</option><option value="HACKATHON">Hackathon</option><option value="PLACEMENT_DRIVE">Placement Drive</option><option value="WORKSHOP">Workshop</option></select><button className="rounded-md bg-secondary px-4 py-2 text-sm font-medium sm:col-span-2 sm:justify-self-end">Filter</button></form>{events.length === 0 ? <div className="mt-8 rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">No approved upcoming events match your search.</div> : <div className="mt-8 grid gap-5 md:grid-cols-2">{events.map(e => <EventCard key={e.id} event={e}/>)}</div>}</main>;
}
