import { notFound } from "next/navigation";
import Link from "next/link";
import { getEvent } from "@/services/events/get-event";
import RegisterEventButton from "@/components/events/RegisterEventButton";

export const dynamic = "force-dynamic";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          ← Back to all events
        </Link>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-xs sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
            {event.type.replaceAll("_", " ")}
          </span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {event.status}
          </span>
        </div>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {event.title}
        </h1>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {event.description}
        </p>

        <div className="mt-6 grid gap-4 rounded-xl border bg-muted/40 p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Organizer</p>
            <p className="mt-1 text-sm font-medium text-foreground">{event.organizer.fullName}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Starts</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {new Date(event.startsAt).toLocaleString()}
            </p>
          </div>
          {event.endsAt && (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Ends</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {new Date(event.endsAt).toLocaleString()}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Registrations</p>
            <p className="mt-1 text-sm font-medium text-foreground">{event.registrationCount}</p>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <RegisterEventButton
            eventId={event.id}
            initialRegistered={event.isRegistered}
            startsAt={event.startsAt.toISOString()}
          />
        </div>
      </div>
    </main>
  );
}
