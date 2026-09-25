import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getConversations, getMessages } from "@/services/chat/get-conversations";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";

export default async function MessagesPage() {
  await requireAuth();
  const conversations = await getConversations();

  if (conversations.length === 0) {
    redirect("/network");
  }

  const activeConversation = conversations[0];
  const initialMessages = await getMessages(activeConversation.id);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      <main className="mx-auto flex h-full w-full max-w-6xl border-x shadow-xs">
        <ChatSidebar
          conversations={conversations}
          selectedId={activeConversation.id}
          onSelect={() => {}}
        />

        <ChatWindow
          conversation={activeConversation}
          initialMessages={initialMessages}
        />
      </main>
    </div>
  );
}
