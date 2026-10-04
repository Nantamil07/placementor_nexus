import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export interface ChatParticipant {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string | null;
  role: string;
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  isSeen: boolean;
}

export interface Conversation {
  id: string;
  participant: ChatParticipant;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  isTyping?: boolean;
}

export async function getConversations(): Promise<Conversation[]> {
  const { userId } = await auth();

  if (!userId) return [];

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!profile) return [];

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      participants: {
        include: {
          profile: {
            select: {
              id: true,
              fullName: true,
              username: true,
              avatarUrl: true,
              role: true,
            },
          },
        },
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const mapped: (Conversation | null)[] = conversations.map((conversation) => {
      const otherParticipant = conversation.participants.find(
        (participant) => participant.profileId !== profile.id
      );

      if (!otherParticipant) return null;

      const lastMessage = conversation.messages[0];

      return {
        id: conversation.id,
        participant: {
          id: otherParticipant.profile.id,
          fullName: otherParticipant.profile.fullName,
          username: otherParticipant.profile.username,
          avatarUrl: otherParticipant.profile.avatarUrl,
          role: otherParticipant.profile.role,
          isOnline: false,
        },
        lastMessage: lastMessage?.text,
        lastMessageAt: lastMessage?.createdAt.toISOString(),
        unreadCount: 0,
        isTyping: false,
      };
    });

  return mapped.filter(
    (conversation): conversation is Conversation => conversation !== null
  );
}

export async function getMessages(
  conversationId: string
): Promise<ChatMessage[]> {
  const { userId } = await auth();

  if (!userId) return [];

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!profile) return [];

  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_profileId: {
        conversationId,
        profileId: profile.id,
      },
    },
  });

  if (!participant) return [];

  const messages = await prisma.message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return messages.map((message) => ({
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    text: message.text,
    createdAt: message.createdAt.toISOString(),
    isSeen: message.senderId === profile.id,
  }));
}
