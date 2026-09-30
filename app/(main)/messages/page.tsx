import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import {
  getConversations,
  getMessages,
} from "@/services/chat/get-conversations";
import { MessagesClient } from "@/components/chat/MessagesClient";

export default async function MessagesPage() {
  await requireAuth();

  const conversations = await getConversations();

  if (conversations.length === 0) {
    redirect("/network");
  }

  const activeConversation = conversations[0];
  const initialMessages = await getMessages(activeConversation.id);

  return (
    <MessagesClient
      conversations={conversations}
      initialMessages={initialMessages}
    />
  );
}
