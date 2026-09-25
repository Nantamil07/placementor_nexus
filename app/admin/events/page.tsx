import { getEvents } from "@/services/admin/get-events";
import EventTable from "@/components/admin/EventTable";

export const dynamic = "force-dynamic";

const STATUS_FILTERS = ["PENDING", "APPROVED", "REJECTED", "COMPLETED"] as const;

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string };
}) {
  const page = Number(searchParams.page ?? "1") || 1;
  const status = STATUS_FILTERS.includes(searchParams.status as any) ? (searchParams.status as any) : undefined;
  const { events } = await getEvents({ page, status });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Events</h1>
        <p className="text-sm text-zinc-500">Approve webinars, hackathons, and placement drives.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <a
            key={s}
            href={`/admin/events?status=${s}`}
            className={`rounded-full border px-3 py-1 text-xs ${
              status === s ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            {s}
          </a>
        ))}
        <a
          href="/admin/events"
          className={`rounded-full border px-3 py-1 text-xs ${
            !status ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          ALL
        </a>
      </div>

      <EventTable
        events={events.map((e) => ({
          id: e.id,
          title: e.title,
          type: e.type,
          status: e.status,
          organizerName: e.organizer.fullName,
          startsAt: e.startsAt.toISOString(),
        }))}
      />
    </div>
  );
}
