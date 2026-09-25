"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { approveEvent } from "@/services/admin/approve-event";
import { rejectEvent } from "@/services/admin/reject-event";

interface EventModerationDialogProps {
  eventId: string;
  eventTitle: string;
  mode: "approve" | "reject";
  onClose: () => void;
  onDone?: () => void;
}

export default function EventModerationDialog({ eventId, eventTitle, mode, onClose, onDone }: EventModerationDialogProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = mode === "approve" ? await approveEvent(eventId) : await rejectEvent(eventId, reason);
      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      onDone?.();
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">
            {mode === "approve" ? "Approve event" : "Reject event"}
          </h3>
          <button type="button" onClick={onClose} className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-3 text-sm text-zinc-400">
          {mode === "approve" ? "Approve" : "Reject"} <span className="text-zinc-200">{eventTitle}</span>?
        </p>

        {mode === "reject" && (
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Reason</label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why is this event being rejected?"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
            />
          </div>
        )}

        {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-zinc-700 px-4 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className={
              mode === "approve"
                ? "rounded-md bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
                : "rounded-md bg-rose-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-rose-500 disabled:opacity-60"
            }
          >
            {isPending ? "Saving…" : mode === "approve" ? "Approve" : "Reject"}
          </button>
        </div>
      </form>
    </div>
  );
}
