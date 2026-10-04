import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getConversations,
  getMessages,
} from "@/services/chat/get-conversations";
import { MessagesClient } from "@/components/chat/MessagesClient";

interface MessagesPageProps {
  searchParams: Promise<{
    conversation?: string;
  }>;
}

export default async function MessagesPage({
  searchParams,
}: MessagesPageProps) {
  const { userId } = await requireAuth();

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!profile) {
    redirect("/setup-profile");
  }

  const conversations = await getConversations();

  if (conversations.length === 0) {
    return (
      <MessagesClient
        conversations={[]}
        initialMessages={[]}
        currentProfileId={profile.id}
        initialConversationId=""
      />
    );
  }

  const params = await searchParams;

  const requestedConversation = params.conversation;

  const activeConversation =
    conversations.find(
      (conversation) => conversation.id === requestedConversation
    ) ?? conversations[0];

  const initialMessages = await getMessages(activeConversation.id);

  return (
    <MessagesClient
      conversations={conversations}
      initialMessages={initialMessages}
      currentProfileId={profile.id}
      initialConversationId={activeConversation.id}
    />
  );
}
