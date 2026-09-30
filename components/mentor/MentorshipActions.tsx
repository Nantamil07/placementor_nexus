"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateMentorshipStatus } from "@/services/mentor/request-mentorship";

export function MentorshipActions({ id, status, canManage }: { id: string; status: string; canManage: boolean }) {
  const router = useRouter(); const [loading, setLoading] = useState(false);
  async function update(next: "CONFIRMED" | "COMPLETED" | "CANCELLED") {
    setLoading(true); const r = await updateMentorshipStatus(id, next); setLoading(false);
    if (!r.success) window.alert(r.error); else router.refresh();
  }
  if (loading || !canManage) return null;
  if (status === "REQUESTED") return <div className="mt-3 flex gap-2"><button onClick={() => update("CONFIRMED")} className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">Accept</button><button onClick={() => update("CANCELLED")} className="rounded-md border px-3 py-1.5 text-sm">Decline</button></div>;
  if (status === "CONFIRMED") return <div className="mt-3 flex gap-2"><button onClick={() => update("COMPLETED")} className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">Mark completed</button><button onClick={() => update("CANCELLED")} className="rounded-md border px-3 py-1.5 text-sm">Cancel</button></div>;
  return null;
}
