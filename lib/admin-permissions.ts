import "server-only";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import type { Profile } from "@prisma/client";

/**
 * Roles allowed inside /admin/**.
 * ADMIN has full access; PLACEMENT_OFFICER has moderation-level access
 * (no destructive user/role management by default — see canManageUsers).
 */
export const ADMIN_ROLES = ["ADMIN", "PLACEMENT_OFFICER"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export function isAdminRole(role: string | null | undefined): role is AdminRole {
  return !!role && (ADMIN_ROLES as readonly string[]).includes(role);
}

/**
 * Fetches the current profile and verifies Clerk auth + database role.
 * Redirects to /sign-in (no session) or / (authenticated but not an admin).
 * This is the single source of truth for admin access — call it at the top
 * of every admin server component / route handler / server action.
 */
export async function requireAdmin(): Promise<Profile> {
  const { userId } = await getAuthSession();
  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await prisma.profile.findUnique({ where: { clerkId: userId } });

  if (!profile || profile.isSuspended || !isAdminRole(profile.role)) {
    redirect("/");
  }

  return profile;
}

/** Only full ADMINs may change roles, delete users, or delete companies/jobs outright. */
export function canManageUsers(role: string): boolean {
  return role === "ADMIN";
}

/** Both ADMIN and PLACEMENT_OFFICER may moderate content (approve/reject/remove). */
export function canModerateContent(role: string): boolean {
  return isAdminRole(role);
}

/** Only full ADMINs may broadcast notifications to the whole platform. */
export function canSendNotifications(role: string): boolean {
  return role === "ADMIN";
}

export async function logAdminAction(params: {
  actorId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}) {
  return prisma.auditLog.create({
    data: {
      actorId: params.actorId,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      metadata: params.metadata ? JSON.parse(JSON.stringify(params.metadata)) : undefined,
    },
  });
}
