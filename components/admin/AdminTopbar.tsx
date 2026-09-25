"use client";

import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { useSidebar } from "./AdminSidebar";
import { useAdmin } from "@/hooks/use-admin";

export default function AdminTopbar() {
  const { toggle } = useSidebar();
  const { fullName, role } = useAdmin();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-medium text-white">Welcome back, {fullName.split(" ")[0]}</p>
          <p className="text-xs text-zinc-500">{role === "ADMIN" ? "Administrator" : "Placement Officer"}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </header>
  );
}
