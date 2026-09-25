import { getUsers } from "@/services/admin/get-users";
import UserTable from "@/components/admin/UserTable";

export const dynamic = "force-dynamic";

interface UsersPageProps {
  searchParams: { page?: string; search?: string; role?: string };
}

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  const page = Number(searchParams.page ?? "1") || 1;
  const { users, total, totalPages } = await getUsers({
    page,
    search: searchParams.search,
    role: searchParams.role,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Users</h1>
        <p className="text-sm text-zinc-500">Manage roles, suspensions, and accounts across the platform.</p>
      </div>

      <UserTable
        users={users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }))}
        page={page}
        totalPages={totalPages}
        total={total}
      />
    </div>
  );
}
