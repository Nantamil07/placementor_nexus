import { notFound } from "next/navigation";
import { getEvent } from "@/services/events/get-event";
import RegisterEventButton from "@/components/events/RegisterEventButton";

export const dynamic = "force-dynamic";

export default async function EventDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEvent(params.id);
  if (!event) notFound();

  return (
    <main className="mx-auto w-full max-w-4xl p-6 md:p-8">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
            {event.type.replaceAll("_", " ")}
          </span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            {event.status}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-bold text-white">{event.title}</h1>
        <p className="mt-3 whitespace-pre-wrap text-zinc-300">{event.description}</p>

        <div className="mt-6 grid gap-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Organizer</p>
            <p className="mt-1 text-sm text-zinc-200">{event.organizer.fullName}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Starts</p>
            <p className="mt-1 text-sm text-zinc-200">{new Date(event.startsAt).toLocaleString()}</p>
          </div>
          {event.endsAt && (
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">Ends</p>
              <p className="mt-1 text-sm text-zinc-200">{new Date(event.endsAt).toLocaleString()}</p>
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Registrations</p>
            <p className="mt-1 text-sm text-zinc-200">{event.registrationCount}</p>
          </div>
        </div>

        <div className="mt-6">
          <RegisterEventButton eventId={event.id} initialRegistered={event.isRegistered} startsAt={event.startsAt.toISOString()} />
        </div>
      </div>
    </main>
  );
}
