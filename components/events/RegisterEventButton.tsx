"use client";

import { useState, useTransition } from "react";
import { cancelEventRegistration } from "@/services/events/cancel-registration";
import { registerForEvent } from "@/services/events/register-event";

export default function RegisterEventButton({
  eventId,
  initialRegistered,
  startsAt,
}: {
  eventId: string;
  initialRegistered: boolean;
  startsAt: string;
}) {
  const [registered, setRegistered] = useState(initialRegistered);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isPast = new Date(startsAt).getTime() <= Date.now();

  function toggle() {
    setError(null);
    startTransition(async () => {
      const result = registered
        ? await cancelEventRegistration(eventId)
        : await registerForEvent(eventId);

      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
        return;
      }

      setRegistered(result.registered ?? !registered);
    });
  }

  if (isPast) {
    return <span className="text-sm text-zinc-500">Registration is closed.</span>;
  }

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        disabled={isPending}
        className={
          registered
            ? "rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-800 disabled:opacity-60"
            : "rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
        }
      >
        {isPending ? "Saving…" : registered ? "Cancel registration" : "Register for event"}
      </button>
      {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
    </div>
  );
}
