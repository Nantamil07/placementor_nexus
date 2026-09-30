import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export type ConnectionStatus = "NONE" | "PENDING" | "ACCEPTED" | "REJECTED";

export interface NetworkUser {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string | null;
  headline: string | null;
  role: string;
  mutualCount: number;
  connectionStatus: ConnectionStatus;
}

export interface ConnectionRequestItem {
  id: string;
  senderId: string;
  receiverId: string;
  status: ConnectionStatus;
  createdAt: string;
  sender: NetworkUser;
}

async function getProfileId() {
  const { userId } = await auth();
  if (!userId) return null;
  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  return profile?.id ?? null;
}

export async function getNetworkData() {
  const currentProfileId = await getProfileId();
  if (!currentProfileId) {
    return { pendingRequests: [], connections: [], suggestions: [] };
  }

  const [pending, acceptedOutgoing, acceptedIncoming, profiles] = await Promise.all([
    prisma.connection.findMany({
      where: { receiverId: currentProfileId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: {
        sender: {
          select: { id: true, fullName: true, username: true, avatarUrl: true, headline: true, role: true },
        },
      },
    }),
    prisma.connection.findMany({ where: { senderId: currentProfileId, status: "ACCEPTED" }, select: { receiverId: true } }),
    prisma.connection.findMany({ where: { receiverId: currentProfileId, status: "ACCEPTED" }, select: { senderId: true } }),
    prisma.profile.findMany({
      where: { id: { not: currentProfileId }, isSuspended: false },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { id: true, fullName: true, username: true, avatarUrl: true, headline: true, role: true },
    }),
  ]);

  const connectedIds = new Set([
    ...acceptedOutgoing.map((x) => x.receiverId),
    ...acceptedIncoming.map((x) => x.senderId),
  ]);

  const allRelevant = await prisma.connection.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ senderId: currentProfileId }, { receiverId: currentProfileId }],
    },
    select: { senderId: true, receiverId: true },
  });
  const connectedSet = new Set<string>();
  for (const c of allRelevant) {
    connectedSet.add(c.senderId === currentProfileId ? c.receiverId : c.senderId);
  }

  const suggestionIds = profiles.filter((p) => !connectedIds.has(p.id)).map((p) => p.id);
  const existingConnections = await prisma.connection.findMany({
    where: {
      OR: [
        { senderId: currentProfileId, receiverId: { in: suggestionIds } },
        { receiverId: currentProfileId, senderId: { in: suggestionIds } },
      ],
    },
    select: { senderId: true, receiverId: true, status: true },
  });

  const statusMap = new Map<string, ConnectionStatus>();
  for (const c of existingConnections) {
    const otherId = c.senderId === currentProfileId ? c.receiverId : c.senderId;
    statusMap.set(otherId, c.status);
  }

  const toUser = (p: typeof profiles[number]): NetworkUser => ({
    ...p,
    role: String(p.role),
    mutualCount: 0,
    connectionStatus: statusMap.get(p.id) ?? "NONE",
  });

  return {
    pendingRequests: pending.map((r) => ({
      id: r.id,
      senderId: r.senderId,
      receiverId: r.receiverId,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      sender: toUser(r.sender),
    })),
    connections: profiles.filter((p) => connectedSet.has(p.id)).map(toUser),
    suggestions: profiles.filter((p) => !connectedIds.has(p.id)).map(toUser),
  };
}
