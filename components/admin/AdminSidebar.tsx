"use client";

import { createContext, useContext, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  UserSquare2,
  MessagesSquare,
  Flag,
  CalendarDays,
  Bell,
  GraduationCap,
} from "lucide-react";
import AdminNavItem from "./AdminNavItem";
import { useAdmin } from "@/hooks/use-admin";
import { cn } from "@/lib/utils";

interface SidebarState {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarState | null>(null);

/** Wraps the admin section so the topbar's hamburger can control the mobile sidebar. */
export function AdminSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SidebarContext.Provider
      value={{ isOpen, toggle: () => setIsOpen((v) => !v), close: () => setIsOpen(false) }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within AdminSidebarProvider");
  return ctx;
}

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, adminOnly: false },
  { href: "/admin/users", label: "Users", icon: Users, adminOnly: false },
  { href: "/admin/companies", label: "Companies", icon: Building2, adminOnly: false },
  { href: "/admin/recruiters", label: "Recruiters", icon: UserSquare2, adminOnly: false },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase, adminOnly: false },
  { href: "/admin/communities", label: "Communities", icon: MessagesSquare, adminOnly: false },
  { href: "/admin/reports", label: "Reports", icon: Flag, adminOnly: false },
  { href: "/admin/events", label: "Events", icon: CalendarDays, adminOnly: false },
  { href: "/admin/notifications", label: "Notifications", icon: Bell, adminOnly: true },
] as const;

export default function AdminSidebar() {
  const { isOpen, close } = useSidebar();
  const { role } = useAdmin();

  const items = NAV_ITEMS.filter((item) => !item.adminOnly || role === "ADMIN");

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={close}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-800 bg-zinc-950 transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-zinc-800 px-5">
          <GraduationCap className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-semibold tracking-tight text-white">
            Placementor <span className="text-blue-500">Admin</span>
          </span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {items.map((item) => (
            <AdminNavItem key={item.href} {...item} onNavigate={close} />
          ))}
        </nav>

        <div className="border-t border-zinc-800 px-4 py-3 text-[11px] text-zinc-500">
          Signed in as <span className="font-medium text-zinc-300">{role.replace("_", " ")}</span>
        </div>
      </aside>
    </>
  );
}
