"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, canModerateContent, logAdminAction } from "@/lib/admin-permissions";

export interface CompanyUpdateInput {
  name?: string;
  location?: string;
  about?: string;
  website?: string | null;
  logoUrl?: string | null;
  isVerified?: boolean;
}

export async function updateCompany(companyId: string, input: CompanyUpdateInput) {
  const admin = await requireAdmin();
  if (!canModerateContent(admin.role)) {
    return { success: false, error: "You do not have permission to edit companies." };
  }

  const existing = await prisma.company.findUnique({ where: { id: companyId } });
  if (!existing) return { success: false, error: "Company not found." };

  await prisma.company.update({ where: { id: companyId }, data: input });
  await logAdminAction({ actorId: admin.id, action: "COMPANY_UPDATED", targetType: "COMPANY", targetId: companyId, metadata: input as Record<string, unknown> });

  revalidatePath("/admin/companies");
  revalidatePath(`/admin/companies/${companyId}`);
  return { success: true };
}

export async function toggleCompanyVerification(companyId: string) {
  const admin = await requireAdmin();
  if (!canModerateContent(admin.role)) {
    return { success: false, error: "You do not have permission to verify companies." };
  }
  const existing = await prisma.company.findUnique({ where: { id: companyId } });
  if (!existing) return { success: false, error: "Company not found." };

  await prisma.company.update({ where: { id: companyId }, data: { isVerified: !existing.isVerified } });
  await logAdminAction({
    actorId: admin.id,
    action: existing.isVerified ? "COMPANY_UNVERIFIED" : "COMPANY_VERIFIED",
    targetType: "COMPANY",
    targetId: companyId,
  });

  revalidatePath("/admin/companies");
  revalidatePath(`/admin/companies/${companyId}`);
  return { success: true };
}
