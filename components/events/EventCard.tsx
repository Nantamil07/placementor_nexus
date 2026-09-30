import Link from "next/link";

type EventCardEvent = {
  id: string;
  title: string;
  description: string;
  type: string;
  startsAt: Date;
  organizer: { fullName: string; username: string; avatarUrl: string | null };
  _count: { registrations: number };
};

export default function EventCard({ event }: { event: EventCardEvent }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="block rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-blue-500/60"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
          {event.type.replaceAll("_", " ")}
        </span>
        <span className="text-xs text-zinc-500">
          {event._count.registrations} {event._count.registrations === 1 ? "registration" : "registrations"}
        </span>
      </div>

      <h2 className="mt-4 text-xl font-semibold text-white">{event.title}</h2>
      <p className="mt-2 line-clamp-3 text-sm text-zinc-400">{event.description}</p>

      <div className="mt-5 space-y-1 text-sm">
        <p className="text-zinc-200">{new Date(event.startsAt).toLocaleString()}</p>
        <p className="text-zinc-500">Organized by {event.organizer.fullName}</p>
      </div>
    </Link>
  );
}
