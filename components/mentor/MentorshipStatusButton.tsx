"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateMentorshipStatus } from "@/services/mentor/update-mentorship";

export function MentorshipStatusButton({ sessionId, action }: {
  sessionId: string; action: "CONFIRM" | "COMPLETE" | "CANCEL";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function run() {
    setLoading(true);
    const status = action === "CONFIRM" ? "CONFIRMED" : action === "COMPLETE" ? "COMPLETED" : "CANCELLED";
    await updateMentorshipStatus(sessionId, status);
    setLoading(false);
    router.refresh();
  }
  return <button onClick={run} disabled={loading}
    className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50">
    {loading ? "..." : action === "CONFIRM" ? "Confirm" : action === "COMPLETE" ? "Complete" : "Cancel"}
  </button>;
}
