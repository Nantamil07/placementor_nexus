"use client";

import { useState, useTransition } from "react";
import { Send } from "lucide-react";
import { sendGlobalNotification } from "@/services/admin/send-global-notification";
import { useRouter } from "next/navigation";

const AUDIENCES = [
  { value: "ALL", label: "Everyone" },
  { value: "STUDENTS", label: "Students" },
  { value: "ALUMNI", label: "Alumni" },
  { value: "MENTORS", label: "Mentors" },
  { value: "RECRUITERS", label: "Recruiters" },
  { value: "PLACEMENT_OFFICERS", label: "Placement Officers" },
] as const;

export default function NotificationComposer() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<(typeof AUDIENCES)[number]["value"]>("ALL");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await sendGlobalNotification(title, message, audience);
      if (!result.success) {
        setError(result.error ?? "Failed to send notification.");
        return;
      }
      setTitle("");
      setMessage("");
      setSuccess(true);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="mb-4 text-sm font-medium text-zinc-300">Compose announcement</p>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-400">Title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Placement drive next week"
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-400">Message</label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write the announcement…"
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-400">Audience</label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value as typeof audience)}
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
          >
            {AUDIENCES.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}
      {success && <p className="mt-3 text-xs text-emerald-400">Notification sent.</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {isPending ? "Sending…" : "Send announcement"}
      </button>
    </form>
  );
}
