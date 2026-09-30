"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCommunity } from "@/services/community/create-community";

export function CreateCommunityForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createCommunity({ name, description });
      if (!result.success || !result.slug) {
        setError(result.error ?? "Could not create community.");
        return;
      }
      setName("");
      setDescription("");
      setOpen(false);
      router.push(`/communities/${result.slug}`);
      router.refresh();
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        + Create Community
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-xl border bg-card p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Create a community</h2>
          <p className="text-xs text-muted-foreground">Start a public space around a placement or career topic.</p>
        </div>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">✕</button>
      </div>

      <div className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Community name"
          maxLength={80}
          required
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this community about?"
          maxLength={500}
          rows={3}
          className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {error && <p className="mt-3 text-xs text-destructive">{error}</p>}

      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
        <button type="submit" disabled={isPending || !name.trim()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">
          {isPending ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}
