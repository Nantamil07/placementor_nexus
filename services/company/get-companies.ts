import { prisma } from "@/lib/prisma";
import type { Company } from "@/types/company";

export async function getCompanies(): Promise<Company[]> {
  const companies = await prisma.company.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return companies.map((company) => ({
    id: company.id,
    slug: company.slug,
    name: company.name,
    location: company.location,
    about: company.about,
  }));
}
