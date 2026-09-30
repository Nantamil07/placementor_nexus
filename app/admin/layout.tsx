import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-permissions";
import { AdminSidebarProvider } from "@/components/admin/AdminSidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { AdminContextProvider } from "@/hooks/use-admin";

export const metadata: Metadata = {
  title: "Admin · Placementor Nexus",
  description: "Admin panel for Placementor Nexus",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireAdmin();

  return (
    <AdminContextProvider
      value={{
        id: profile.id,
        fullName: profile.fullName,
        email: profile.email,
        avatarUrl: null,
        role: profile.role as "ADMIN" | "PLACEMENT_OFFICER",
      }}
    >
      <AdminSidebarProvider>
        <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
          <AdminSidebar />

          <div className="flex min-h-screen flex-1 flex-col">
            <AdminTopbar />

            <main className="flex-1 overflow-x-hidden p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </AdminSidebarProvider>
    </AdminContextProvider>
  );
}
