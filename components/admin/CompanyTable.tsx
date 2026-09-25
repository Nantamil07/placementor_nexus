"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, BadgeX, Pencil, Plus, Trash2 } from "lucide-react";
import CompanyDialog, { type CompanyDialogInitial } from "./CompanyDialog";
import { toggleCompanyVerification } from "@/services/admin/update-company";
import { deleteCompany } from "@/services/admin/delete-company";
import { useAdmin } from "@/hooks/use-admin";

export interface AdminCompanyRow {
  id: string;
  slug: string;
  name: string;
  location: string;
  isVerified: boolean;
  jobCount: number;
  followerCount: number;
}

export default function CompanyTable({ companies }: { companies: AdminCompanyRow[] }) {
  const { canManageUsers } = useAdmin();
  const router = useRouter();
  const [dialogState, setDialogState] = useState<{ open: boolean; initial?: CompanyDialogInitial }>({ open: false });
  const [isPending, startTransition] = useTransition();

  function handleVerify(id: string) {
    startTransition(async () => {
      await toggleCompanyVerification(id);
      router.refresh();
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete ${name} and all its job listings?`)) return;
    startTransition(async () => {
      await deleteCompany(id);
      router.refresh();
    });
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-800 p-4">
        <p className="text-sm text-zinc-400">{companies.length} companies</p>
        <button
          onClick={() => setDialogState({ open: true })}
          className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500"
        >
          <Plus className="h-3.5 w-3.5" /> Add company
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Jobs</th>
              <th className="px-4 py-3 font-medium">Followers</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id} className="border-b border-zinc-800/60 text-sm">
                <td className="px-4 py-3">
                  <Link href={`/admin/companies/${c.id}`} className="font-medium text-zinc-100 hover:text-blue-400">
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-zinc-400">{c.location}</td>
                <td className="px-4 py-3 text-zinc-400">{c.jobCount}</td>
                <td className="px-4 py-3 text-zinc-400">{c.followerCount}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      c.isVerified
                        ? "rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400"
                        : "rounded-full bg-zinc-700/50 px-2 py-0.5 text-xs text-zinc-400"
                    }
                  >
                    {c.isVerified ? "Verified" : "Unverified"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={isPending}
                      onClick={() => handleVerify(c.id)}
                      className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      title={c.isVerified ? "Unverify" : "Verify"}
                    >
                      {c.isVerified ? <BadgeX className="h-4 w-4" /> : <BadgeCheck className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() =>
                        setDialogState({
                          open: true,
                          initial: { id: c.id, name: c.name, location: c.location, about: "", isVerified: c.isVerified },
                        })
                      }
                      className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {canManageUsers && (
                      <button
                        disabled={isPending}
                        onClick={() => handleDelete(c.id, c.name)}
                        className="rounded p-1.5 text-zinc-400 hover:bg-rose-950 hover:text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {companies.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-zinc-500">
                  No companies yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {dialogState.open && (
        <CompanyDialog
          initial={dialogState.initial}
          onClose={() => setDialogState({ open: false })}
          onSaved={() => router.refresh()}
        />
      )}
    </div>
  );
}
