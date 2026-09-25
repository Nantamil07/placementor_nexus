"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { resolveReport } from "@/services/admin/resolve-report";
import { rejectReport } from "@/services/admin/reject-report";

interface ReportActionDialogProps {
  reportId: string;
  mode: "resolve" | "reject";
  onClose: () => void;
  onDone?: () => void;
}

export default function ReportActionDialog({ reportId, mode, onClose, onDone }: ReportActionDialogProps) {
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = mode === "resolve" ? await resolveReport(reportId, note) : await rejectReport(reportId, note);
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
          <h3 className="text-base font-semibold text-white">{mode === "resolve" ? "Resolve report" : "Reject report"}</h3>
          <button type="button" onClick={onClose} className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="mb-1 block text-xs font-medium text-zinc-400">Note (optional)</label>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What action was taken?"
          className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
        />

        {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-zinc-700 px-4 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className={
              mode === "resolve"
                ? "rounded-md bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
                : "rounded-md bg-rose-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-rose-500 disabled:opacity-60"
            }
          >
            {isPending ? "Saving…" : mode === "resolve" ? "Mark resolved" : "Reject"}
          </button>
        </div>
      </form>
    </div>
  );
}
