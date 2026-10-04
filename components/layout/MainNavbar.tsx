"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Rss,
  Users,
  MessageSquare,
  Briefcase,
  Building2,
  GraduationCap,
  Award,
  BarChart3,
  Calendar,
  MessagesSquare,
  Bell,
  Shield,
  Menu,
  X,
  User,
} from "lucide-react";

interface MainNavbarProps {
  currentProfile: {
    id: string;
    username: string;
    fullName: string;
    avatarUrl: string | null;
    role: string;
  };
  unreadNotificationsCount: number;
}

export function MainNavbar({
  currentProfile,
  unreadNotificationsCount,
}: MainNavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminOrOfficer =
    currentProfile.role === "ADMIN" || currentProfile.role === "PLACEMENT_OFFICER";

  const navItems = [
    { href: "/feed", label: "Feed", icon: Rss },
    { href: "/network", label: "Network", icon: Users },
    { href: "/messages", label: "Messages", icon: MessageSquare },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
    { href: "/companies", label: "Companies", icon: Building2 },
    { href: "/mentorship", label: "Mentorship", icon: GraduationCap },
    { href: "/referrals", label: "Referrals", icon: Award },
    { href: "/placement", label: "Placement", icon: BarChart3 },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/communities", label: "Communities", icon: MessagesSquare },
  ];

  const isActive = (href: string) => {
    if (href === "/feed") return pathname === "/feed" || pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/feed"
            className="flex items-center gap-2 text-base font-bold tracking-tight text-foreground transition hover:opacity-90"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="hidden sm:inline-block">
              Placementor <span className="text-primary">Nexus</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Medium Screen Nav Bar (Dropdown or condensed) */}
        <nav className="hidden md:flex xl:hidden items-center gap-1 overflow-x-auto py-1">
          {navItems.slice(0, 6).map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons & User Menu */}
        <div className="flex items-center gap-2.5">
          {/* Admin Link if Admin/Officer */}
          {isAdminOrOfficer && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 transition hover:bg-amber-500/20"
              title="Admin & Placement Portal"
            >
              <Shield className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">Admin</span>
            </Link>
          )}

          {/* Notifications Link with Badge */}
          <Link
            href="/notifications"
            className="relative rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                {unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount}
              </span>
            )}
          </Link>

          {/* User Profile Quick Link */}
          <Link
            href="/profile"
            className="hidden items-center gap-2 rounded-lg border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted sm:inline-flex"
          >
            <User className="h-3.5 w-3.5 text-primary" />
            <span className="max-w-[100px] truncate">@{currentProfile.username}</span>
          </Link>

          {/* Clerk User Button */}
          <div className="flex items-center">
            <UserButton afterSignOutUrl="/sign-in" />
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground xl:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b bg-background px-4 pt-2 pb-4 shadow-lg xl:hidden">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-lg p-2.5 text-xs font-medium transition ${
                    active
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-muted/40 text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg bg-muted/40 p-2.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              <User className="h-4 w-4 text-primary" />
              My Profile
            </Link>

            {isAdminOrOfficer && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg bg-amber-500/15 p-2.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/25"
              >
                <Shield className="h-4 w-4" />
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
