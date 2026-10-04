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

export function AdminContextProvider({
  value,
  children,
}: {
  value: AdminContextValue;
  children: React.ReactNode;
}) {
  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

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
