import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export type ConnectionStatus = "NONE" | "PENDING" | "ACCEPTED";

export interface NetworkUser {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string | null;
  headline: string | null;
  role: string;
  mutualCount: number;
  isFollowing: boolean;
}

export interface ConnectionRequestItem {
  id: string;
  senderId: string;
  receiverId: string;
  status: ConnectionStatus;
  createdAt: string;
  sender: NetworkUser;
}

export async function getNetworkData() {
  const { userId } = await auth();

  if (!userId) {
    return {
      pendingRequests: [],
      connections: [],
      suggestions: [],
    };
  }

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!profile) {
    return {
      pendingRequests: [],
      connections: [],
      suggestions: [],
    };
  }

  const currentProfileId = profile.id;

  const [pending, acceptedConnections, followedUsers, people] =
    await Promise.all([
      prisma.connection.findMany({
        where: {
          receiverId: currentProfileId,
          status: "PENDING",
        },
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              username: true,
              avatarUrl: true,
              headline: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.connection.findMany({
        where: {
          status: "ACCEPTED",
          OR: [
            { senderId: currentProfileId },
            { receiverId: currentProfileId },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              username: true,
              avatarUrl: true,
              headline: true,
              role: true,
            },
          },
          receiver: {
            select: {
              id: true,
              fullName: true,
              username: true,
              avatarUrl: true,
              headline: true,
              role: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),

      prisma.follow.findMany({
        where: {
          followerId: currentProfileId,
        },
        select: {
          followingId: true,
        },
      }),

      prisma.profile.findMany({
        where: {
          id: {
            not: currentProfileId,
          },
          isSuspended: false,
          isOnboarded: true,
        },
        select: {
          id: true,
          fullName: true,
          username: true,
          avatarUrl: true,
          headline: true,
          role: true,
        },
        orderBy: {
          fullName: "asc",
        },
        take: 30,
      }),
    ]);

  const followingIds = new Set(
    followedUsers.map((follow) => follow.followingId)
  );

  const connectedIds = new Set<string>();

  for (const connection of acceptedConnections) {
    connectedIds.add(
      connection.senderId === currentProfileId
        ? connection.receiverId
        : connection.senderId
    );
  }

  const pendingOutgoing = await prisma.connection.findMany({
    where: {
      senderId: currentProfileId,
      status: "PENDING",
    },
    select: {
      receiverId: true,
    },
  });

  const pendingOutgoingIds = new Set(
    pendingOutgoing.map((request) => request.receiverId)
  );

  const pendingRequests: ConnectionRequestItem[] = pending.map((request) => ({
    id: request.id,
    senderId: request.senderId,
    receiverId: request.receiverId,
    status: "PENDING",
    createdAt: request.createdAt.toISOString(),
    sender: {
      id: request.sender.id,
      fullName: request.sender.fullName,
      username: request.sender.username,
      avatarUrl: request.sender.avatarUrl,
      headline: request.sender.headline,
      role: request.sender.role,
      mutualCount: 0,
      isFollowing: followingIds.has(request.sender.id),
    },
  }));

  const connections = acceptedConnections.map((connection) => {
    const person =
      connection.senderId === currentProfileId
        ? connection.receiver
        : connection.sender;

    return {
      id: person.id,
      fullName: person.fullName,
      username: person.username,
      avatarUrl: person.avatarUrl,
      headline: person.headline,
      role: person.role,
      mutualCount: 0,
      isFollowing: followingIds.has(person.id),
    };
  });

  const suggestions: NetworkUser[] = people
    .filter((person) => !connectedIds.has(person.id))
    .filter((person) => !pendingOutgoingIds.has(person.id))
    .map((person) => ({
      id: person.id,
      fullName: person.fullName,
      username: person.username,
      avatarUrl: person.avatarUrl,
      headline: person.headline,
      role: person.role,
      mutualCount: 0,
      isFollowing: followingIds.has(person.id),
    }));

  return {
    pendingRequests,
    connections,
    suggestions,
  };
}
