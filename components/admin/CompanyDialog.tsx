"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { createCompany } from "@/services/admin/create-company";
import { updateCompany } from "@/services/admin/update-company";

export interface CompanyDialogInitial {
  id?: string;
  name: string;
  location: string;
  about: string;
  website?: string | null;
  logoUrl?: string | null;
  isVerified?: boolean;
}

interface CompanyDialogProps {
  initial?: CompanyDialogInitial;
  onClose: () => void;
  onSaved?: () => void;
}

const EMPTY: CompanyDialogInitial = { name: "", location: "", about: "", website: "", logoUrl: "", isVerified: false };

export default function CompanyDialog({ initial, onClose, onSaved }: CompanyDialogProps) {
  const [form, setForm] = useState<CompanyDialogInitial>(initial ?? EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isEdit = Boolean(initial?.id);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = isEdit
        ? await updateCompany(initial!.id!, form)
        : await createCompany({ ...form, name: form.name, location: form.location, about: form.about });
      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      onSaved?.();
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">{isEdit ? "Edit company" : "Add company"}</h3>
          <button type="button" onClick={onClose} className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Location</label>
            <input
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">About</label>
            <textarea
              required
              rows={3}
              value={form.about}
              onChange={(e) => setForm({ ...form, about: e.target.value })}
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Website</label>
            <input
              value={form.website ?? ""}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://…"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={form.isVerified ?? false}
              onChange={(e) => setForm({ ...form, isVerified: e.target.checked })}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-800"
            />
            Verified company
          </label>
        </div>

        {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-zinc-700 px-4 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {isPending ? "Saving…" : isEdit ? "Save changes" : "Create company"}
          </button>
        </div>
      </form>
    </div>
  );
}
