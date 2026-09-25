import "server-only";
import { prisma } from "@/lib/prisma";

export interface AuditLogEntry {
  id: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  createdAt: Date;
  actor: { fullName: string; avatarUrl: string | null; role: string };
}

export async function getRecentAuditLog(limit = 15): Promise<AuditLogEntry[]> {
  const rows = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { actor: { select: { fullName: true, avatarUrl: true, role: true } } },
  });

  return rows.map((r) => ({
    id: r.id,
    action: r.action,
    targetType: r.targetType,
    targetId: r.targetId,
    createdAt: r.createdAt,
    actor: r.actor,
  }));
}
