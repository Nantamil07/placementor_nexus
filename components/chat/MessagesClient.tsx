"use client";

import { useEffect, useState, useTransition } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import type {
  ChatMessage,
  Conversation,
} from "@/services/chat/get-conversations";
import { loadMessages } from "@/services/chat/load-messages";

interface MessagesClientProps {
  conversations: Conversation[];
  initialMessages: ChatMessage[];
  currentProfileId: string;
  initialConversationId: string;
}

export function MessagesClient({
  conversations,
  initialMessages,
  currentProfileId,
  initialConversationId,
}: MessagesClientProps) {
  const [selectedId, setSelectedId] = useState(initialConversationId);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, startTransition] = useTransition();

  const selectedConversation =
    conversations.find(
      (conversation) => conversation.id === selectedId
    ) ?? conversations[0];

  useEffect(() => {
    if (selectedId === initialConversationId) {
      setMessages(initialMessages);
      return;
    }

    startTransition(async () => {
      const nextMessages = await loadMessages(selectedId);
      setMessages(nextMessages);
    });
  }, [selectedId, initialConversationId, initialMessages]);

  function handleSelectConversation(id: string) {
    setSelectedId(id);
    window.history.replaceState(
      null,
      "",
      `/messages?conversation=${id}`
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      <main className="mx-auto flex h-full w-full max-w-6xl border-x shadow-xs">
        <ChatSidebar
          conversations={conversations}
          selectedId={selectedConversation.id}
          onSelect={handleSelectConversation}
        />

        {isLoading ? (
          <section className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Loading messages...
          </section>
        ) : (
          <ChatWindow
            key={selectedConversation.id}
            conversation={selectedConversation}
            initialMessages={messages}
            currentProfileId={currentProfileId}
          />
        )}
      </main>
    </div>
  );
}
