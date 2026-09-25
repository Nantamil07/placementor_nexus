"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, canModerateContent, logAdminAction } from "@/lib/admin-permissions";

export interface CompanyInput {
  name: string;
  location: string;
  about: string;
  website?: string | null;
  logoUrl?: string | null;
  isVerified?: boolean;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCompany(input: CompanyInput) {
  const admin = await requireAdmin();
  if (!canModerateContent(admin.role)) {
    return { success: false, error: "You do not have permission to create companies." };
  }
  if (!input.name?.trim() || !input.location?.trim() || !input.about?.trim()) {
    return { success: false, error: "Name, location, and about are required." };
  }

  const baseSlug = slugify(input.name);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.company.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++suffix}`;
  }

  const company = await prisma.company.create({
    data: {
      name: input.name.trim(),
      slug,
      location: input.location.trim(),
      about: input.about.trim(),
      website: input.website?.trim() || null,
      logoUrl: input.logoUrl?.trim() || null,
      isVerified: input.isVerified ?? false,
    },
  });

  await logAdminAction({ actorId: admin.id, action: "COMPANY_CREATED", targetType: "COMPANY", targetId: company.id });
  revalidatePath("/admin/companies");
  return { success: true, company };
}
