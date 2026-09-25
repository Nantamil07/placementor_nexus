"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <AlertTriangle className="h-10 w-10 text-amber-400" />
      <div>
        <h2 className="text-lg font-semibold text-white">Something went wrong</h2>
        <p className="mt-1 max-w-md text-sm text-zinc-500">
          The admin panel hit an unexpected error{error.digest ? ` (ref: ${error.digest})` : ""}. You can try again,
          or head back to the dashboard.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Try again
        </button>
        <a
          href="/admin"
          className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
        >
          Back to dashboard
        </a>
      </div>
    </div>
  );
}
