"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, canManageUsers, logAdminAction } from "@/lib/admin-permissions";

export async function deleteCompany(companyId: string) {
  const admin = await requireAdmin();
  if (!canManageUsers(admin.role)) {
    return { success: false, error: "Only administrators can delete companies." };
  }

  const existing = await prisma.company.findUnique({ where: { id: companyId } });
  if (!existing) return { success: false, error: "Company not found." };

  await prisma.company.delete({ where: { id: companyId } });
  await logAdminAction({ actorId: admin.id, action: "COMPANY_DELETED", targetType: "COMPANY", targetId: companyId, metadata: { name: existing.name } });

  revalidatePath("/admin/companies");
  return { success: true };
}
