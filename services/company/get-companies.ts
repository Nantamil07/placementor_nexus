import { prisma } from "@/lib/prisma";

export interface CompanyListItem {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  website: string | null;
  location: string;
  about: string;
  isVerified: boolean;
  followersCount: number;
}

export async function getCompanies(search?: string): Promise<CompanyListItem[]> {
  const term = search?.trim();

  const companies = await prisma.company.findMany({
    where: term
      ? {
          OR: [
            { name: { contains: term, mode: "insensitive" } },
            { location: { contains: term, mode: "insensitive" } },
            { about: { contains: term, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { _count: { select: { followers: true } } },
    orderBy: [{ isVerified: "desc" }, { name: "asc" }],
  });

  return companies.map((company) => ({
    id: company.id,
    slug: company.slug,
    name: company.name,
    logoUrl: company.logoUrl,
    website: company.website,
    location: company.location,
    about: company.about,
    isVerified: company.isVerified,
    followersCount: company._count.followers,
  }));
}
