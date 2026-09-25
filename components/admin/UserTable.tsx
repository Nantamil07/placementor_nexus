"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import UserRow, { type AdminUserRow } from "./UserRow";

interface UserTableProps {
  users: AdminUserRow[];
  page: number;
  totalPages: number;
  total: number;
}

export default function UserTable({ users, page, totalPages, total }: UserTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [, startTransition] = useTransition();

  useEffect(() => {
    const handle = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set("search", search);
      else params.delete("search");
      params.set("page", "1");
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    }, 350);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function goToPage(next: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(next));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="flex flex-col gap-3 border-b border-zinc-800 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, username…"
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 py-1.5 pl-8 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <p className="text-xs text-zinc-500">{total} users</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-zinc-500">
                  No users match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-3 text-xs text-zinc-500">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
            className="rounded-md border border-zinc-700 px-3 py-1 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
            className="rounded-md border border-zinc-700 px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
