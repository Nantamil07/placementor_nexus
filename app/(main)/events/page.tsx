import Link from "next/link";
import { getEvents } from "@/services/events/get-events";
import EventCard from "@/components/events/EventCard";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className="mx-auto w-full max-w-6xl p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Events</h1>
          <p className="mt-1 text-zinc-400">Discover webinars, hackathons, workshops, and placement drives.</p>
        </div>
        <Link
          href="/events/create"
          className="inline-flex w-fit rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Create event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-10 text-center">
          <h2 className="text-lg font-semibold text-white">No upcoming events</h2>
          <p className="mt-2 text-sm text-zinc-500">Check back later or create an event for the community.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </main>
  );
}
