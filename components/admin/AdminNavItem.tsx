"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminNavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  onNavigate?: () => void;
}

export default function AdminNavItem({ href, label, icon: Icon, badge, onNavigate }: AdminNavItemProps) {
  const pathname = usePathname();
  const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-zinc-800 text-white"
          : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100"
      )}
    >
      <span className="flex items-center gap-3">
        <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300")} />
        {label}
      </span>
      {typeof badge === "number" && badge > 0 && (
        <span className="rounded-full bg-red-500/90 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}
