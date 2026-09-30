"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X as XIcon } from "lucide-react";
import EventModerationDialog from "./EventModerationDialog";

export interface AdminEventRow {
  id: string;
  title: string;
  type: "WEBINAR" | "HACKATHON" | "PLACEMENT_DRIVE" | "WORKSHOP";
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  organizerName: string;
  startsAt: string;
}

const STATUS_STYLES: Record<AdminEventRow["status"], string> = {
  PENDING: "bg-amber-500/10 text-amber-400",
  APPROVED: "bg-emerald-500/10 text-emerald-400",
  REJECTED: "bg-rose-500/10 text-rose-400",
  COMPLETED: "bg-zinc-700/50 text-zinc-400",
};

export default function EventTable({ events }: { events: AdminEventRow[] }) {
  const router = useRouter();
  const [dialog, setDialog] = useState<{ eventId: string; eventTitle: string; mode: "approve" | "reject" } | null>(null);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-medium">Event</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Organizer</th>
              <th className="px-4 py-3 font-medium">Starts</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-b border-zinc-800/60 text-sm">
                <td className="px-4 py-3 font-medium text-zinc-100">{e.title}</td>
                <td className="px-4 py-3 text-zinc-400">{e.type.replace("_", " ")}</td>
                <td className="px-4 py-3 text-zinc-400">{e.organizerName}</td>
                <td className="px-4 py-3 text-xs text-zinc-500">{new Date(e.startsAt).toLocaleString("en-US", {
  timeZone: "UTC",
})}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[e.status]}`}>{e.status}</span>
                </td>
                <td className="px-4 py-3">
                  {e.status === "PENDING" ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setDialog({ eventId: e.id, eventTitle: e.title, mode: "approve" })}
                        className="rounded p-1.5 text-zinc-400 hover:bg-emerald-950 hover:text-emerald-400"
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDialog({ eventId: e.id, eventTitle: e.title, mode: "reject" })}
                        className="rounded p-1.5 text-zinc-400 hover:bg-rose-950 hover:text-rose-400"
                        title="Reject"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-500">—</span>
                  )}
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-zinc-500">
                  No events to review.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {dialog && (
        <EventModerationDialog
          eventId={dialog.eventId}
          eventTitle={dialog.eventTitle}
          mode={dialog.mode}
          onClose={() => setDialog(null)}
          onDone={() => router.refresh()}
        />
      )}
    </div>
  );
}
