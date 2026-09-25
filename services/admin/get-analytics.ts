import "server-only";
import { prisma } from "@/lib/prisma";

export interface DailyPoint {
  date: string; // YYYY-MM-DD
  value: number;
}

function lastNDays(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function bucketByDay(rows: { createdAt: Date }[], days: number): DailyPoint[] {
  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const row of rows) {
    const key = row.createdAt.toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return Array.from(buckets.entries()).map(([date, value]) => ({ date, value }));
}

export async function getSignupTrend(days = 30): Promise<DailyPoint[]> {
  const rows = await prisma.profile.findMany({
    where: { createdAt: { gte: lastNDays(days) } },
    select: { createdAt: true },
  });
  return bucketByDay(rows, days);
}

export async function getApplicationTrend(days = 30): Promise<DailyPoint[]> {
  const rows = await prisma.jobApplication.findMany({
    where: { createdAt: { gte: lastNDays(days) } },
    select: { createdAt: true },
  });
  return bucketByDay(rows, days);
}

export async function getRoleDistribution() {
  const grouped = await prisma.profile.groupBy({
    by: ["role"],
    _count: { _all: true },
  });
  return grouped.map((g) => ({ role: g.role, count: g._count._all }));
}
