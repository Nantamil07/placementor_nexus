"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/services/events/create-event";

const types = [["WEBINAR", "Webinar"], ["HACKATHON", "Hackathon"], ["PLACEMENT_DRIVE", "Placement Drive"], ["WORKSHOP", "Workshop"]] as const;
export function CreateEventForm() {
  const router = useRouter(); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError(""); const f = new FormData(e.currentTarget);
    const result = await createEvent({ title: String(f.get("title") ?? ""), description: String(f.get("description") ?? ""), type: String(f.get("type") ?? "WEBINAR") as "WEBINAR" | "HACKATHON" | "PLACEMENT_DRIVE" | "WORKSHOP", startsAt: String(f.get("startsAt") ?? ""), endsAt: String(f.get("endsAt") ?? "") || undefined });
    setLoading(false); if (!result.success) { setError(result.error ?? "Unable to create event."); return; } router.push(`/events/${result.eventId}`); router.refresh();
  }
  return <form onSubmit={submit} className="space-y-5 rounded-xl border bg-card p-6 shadow-sm"><div><h1 className="text-xl font-semibold">Create an Event</h1><p className="mt-1 text-sm text-muted-foreground">New events are submitted for administrator approval.</p></div>{error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}<label className="block"><span className="mb-1 block text-sm font-medium">Title</span><input name="title" required maxLength={160} className="w-full rounded-md border bg-background px-3 py-2" /></label><label className="block"><span className="mb-1 block text-sm font-medium">Description</span><textarea name="description" required rows={6} maxLength={5000} className="w-full rounded-md border bg-background px-3 py-2" /></label><label className="block"><span className="mb-1 block text-sm font-medium">Type</span><select name="type" defaultValue="WEBINAR" className="w-full rounded-md border bg-background px-3 py-2">{types.map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></label><div className="grid gap-4 sm:grid-cols-2"><label><span className="mb-1 block text-sm font-medium">Starts at</span><input name="startsAt" type="datetime-local" required className="w-full rounded-md border bg-background px-3 py-2" /></label><label><span className="mb-1 block text-sm font-medium">Ends at</span><input name="endsAt" type="datetime-local" className="w-full rounded-md border bg-background px-3 py-2" /></label></div><button type="submit" disabled={loading} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">{loading ? "Submitting..." : "Submit Event"}</button></form>;
}
