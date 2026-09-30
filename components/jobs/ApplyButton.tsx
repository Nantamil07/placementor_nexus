"use client";

import { useState, useTransition } from "react";
import { applyToJob } from "@/services/jobs/apply-job";

export default function ApplyButton({
  jobId,
  initialApplied,
}: {
  jobId: string;
  initialApplied: boolean;
}) {
  const [applied, setApplied] = useState(initialApplied);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleApply = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await applyToJob(jobId);
      if (result.success) {
        setApplied(true);
        setMessage("Application submitted successfully.");
      } else {
        setMessage(result.error ?? "Unable to apply right now.");
      }
    });
  };

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={handleApply}
        disabled={applied || isPending}
        className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {applied ? "Applied" : isPending ? "Applying..." : "Apply Now"}
      </button>

      {message && (
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}
