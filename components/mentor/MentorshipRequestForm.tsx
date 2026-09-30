"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestMentorship } from "@/services/mentor/request-mentorship";

export function MentorshipRequestForm({ mentor }: { mentor: { id: string; fullName: string } }) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    const result = await requestMentorship(mentor.id, topic);
    setLoading(false);
    if (!result.success) { setError(result.error ?? "Unable to send request."); return; }
    setTopic(""); router.refresh();
    window.alert("Mentorship request sent.");
  }

  return <form onSubmit={submit} className="mt-4 rounded-lg border bg-muted/30 p-4">
    <p className="text-sm font-medium">Request {mentor.fullName} as your mentor</p>
    <textarea value={topic} onChange={e => setTopic(e.target.value)} required maxLength={300} rows={3} placeholder="What would you like help with?" className="mt-3 w-full rounded-md border bg-background px-3 py-2 text-sm" />
    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    <button disabled={loading} className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">{loading ? "Sending..." : "Send request"}</button>
  </form>;
}
