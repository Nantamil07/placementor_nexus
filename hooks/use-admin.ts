"use client";

import { createContext, useContext } from "react";

export interface AdminContextValue {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  role: "ADMIN" | "PLACEMENT_OFFICER";
}

export const AdminContext = createContext<AdminContextValue | null>(null);

/**
 * Client-side access to the current admin's identity + derived permission
 * flags. The value is seeded server-side in app/admin/layout.tsx via
 * <AdminContext.Provider>, so this never triggers an extra network request.
 */
export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin() must be used within the /admin layout");
  }

  return {
    ...ctx,
    isAdmin: ctx.role === "ADMIN",
    canManageUsers: ctx.role === "ADMIN",
    canSendNotifications: ctx.role === "ADMIN",
    canModerateContent: true,
  };
}
