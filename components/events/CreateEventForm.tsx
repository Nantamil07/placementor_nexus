"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/services/events/create-event";

const TYPES = [
  ["WEBINAR", "Webinar"],
  ["HACKATHON", "Hackathon"],
  ["PLACEMENT_DRIVE", "Placement drive"],
  ["WORKSHOP", "Workshop"],
] as const;

export default function CreateEventForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit(formData: FormData) {
    setError(null);

    const type = formData.get("type");
    if (!TYPES.some(([value]) => value === type)) {
      setError("Choose a valid event type.");
      return;
    }

    startTransition(async () => {
      const result = await createEvent({
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? ""),
        type: type as "WEBINAR" | "HACKATHON" | "PLACEMENT_DRIVE" | "WORKSHOP",
        startsAt: String(formData.get("startsAt") ?? ""),
        endsAt: String(formData.get("endsAt") ?? "") || undefined,
      });

      if (!result.success) {
        setError(result.error ?? "Could not create event.");
        return;
      }

      router.push(`/events/${result.eventId}`);
      router.refresh();
    });
  }

  return (
    <form action={submit} className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">Title</label>
        <input name="title" required minLength={3} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">Description</label>
        <textarea name="description" required minLength={10} rows={6} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">Type</label>
        <select name="type" defaultValue="WEBINAR" className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500">
          {TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">Starts</label>
          <input name="startsAt" type="datetime-local" required className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">Ends <span className="text-zinc-600">(optional)</span></label>
          <input name="endsAt" type="datetime-local" className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
        </div>
      </div>

      {error && <p className="text-sm text-rose-400">{error}</p>}

      <button type="submit" disabled={isPending} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60">
        {isPending ? "Submitting…" : "Submit for approval"}
      </button>
    </form>
  );
}
