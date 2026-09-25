"use client";

import { useState, useTransition } from "react";
import { updateUserRole } from "@/services/admin/update-user-role";
import { useAdmin } from "@/hooks/use-admin";
import { cn } from "@/lib/utils";

const ROLES = ["STUDENT", "ALUMNI", "MENTOR", "RECRUITER", "PLACEMENT_OFFICER", "ADMIN"] as const;

interface RoleSelectorProps {
  profileId: string;
  role: string;
}

export default function RoleSelector({ profileId, role }: RoleSelectorProps) {
  const { canManageUsers } = useAdmin();
  const [value, setValue] = useState(role);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!canManageUsers) {
    return <span className="text-xs text-zinc-400">{role.replace("_", " ")}</span>;
  }

  function handleChange(next: string) {
    const previous = value;
    setValue(next);
    setError(null);
    startTransition(async () => {
      const result = await updateUserRole(profileId, next as (typeof ROLES)[number]);
      if (!result.success) {
        setValue(previous);
        setError(result.error ?? "Failed to update role.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <select
        value={value}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value)}
        className={cn(
          "rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-100 focus:border-blue-500 focus:outline-none",
          isPending && "opacity-60"
        )}
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r.replace("_", " ")}
          </option>
        ))}
      </select>
      {error && <span className="text-[10px] text-rose-400">{error}</span>}
    </div>
  );
}
