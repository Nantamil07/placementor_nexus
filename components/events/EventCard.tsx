import Link from "next/link";

const labels: Record<string, string> = { WEBINAR: "Webinar", HACKATHON: "Hackathon", PLACEMENT_DRIVE: "Placement Drive", WORKSHOP: "Workshop" };

export function EventCard({ event }: { event: {
  id: string; title: string; description: string; type: string; startsAt: string; endsAt: string | null;
  organizer: { fullName: string; username: string; avatarUrl: string | null };
  registrationCount: number; isRegistered: boolean;
} }) {
  return <Link href={`/events/${event.id}`} className="block rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md">
    <div className="flex flex-wrap gap-2"><span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{labels[event.type] ?? event.type}</span>{event.isRegistered && <span className="rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium">Registered</span>}</div>
    <h2 className="mt-3 text-lg font-semibold">{event.title}</h2>
    <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{event.description}</p>
    <div className="mt-4 space-y-1 text-sm text-muted-foreground"><p><strong>Starts:</strong> {new Date(event.startsAt).toLocaleString()}</p>{event.endsAt && <p><strong>Ends:</strong> {new Date(event.endsAt).toLocaleString()}</p>}<p><strong>Organizer:</strong> {event.organizer.fullName} (@{event.organizer.username})</p><p>{event.registrationCount} registered</p></div>
  </Link>;
}
