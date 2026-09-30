"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerForEvent, unregisterFromEvent } from "@/services/events/register-event";

export function EventRegistrationButton({ eventId, initialRegistered }: { eventId: string; initialRegistered: boolean }) {
  const router = useRouter(); const [registered, setRegistered] = useState(initialRegistered); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  async function toggle() {
    setLoading(true); setError("");
    const result = registered ? await unregisterFromEvent(eventId) : await registerForEvent(eventId);
    setLoading(false);
    if (!result.success) { setError(result.error ?? "Something went wrong."); return; }
    setRegistered(result.registered ?? !registered); router.refresh();
  }
  return <div><button type="button" onClick={toggle} disabled={loading} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">{loading ? "Please wait..." : registered ? "Cancel Registration" : "Register for Event"}</button>{error && <p className="mt-2 text-sm text-red-600">{error}</p>}</div>;
}
