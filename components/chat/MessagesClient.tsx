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

  useEffect(() => {
    if (!initialConversationId || selectedId === initialConversationId) {
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

  if (conversations.length === 0) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-background px-4">
        <div className="mx-auto max-w-md rounded-2xl border bg-card p-8 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="mt-4 text-base font-bold text-foreground">No conversations yet</h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Connect with classmates, alumni mentors, or recruiters on campus to start a direct message thread.
          </p>
          <div className="mt-6">
            <a
              href="/network"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90"
            >
              Explore Network & Peers
            </a>
          </div>
        </div>
      </div>
    );
  }

  const selectedConversation =
    conversations.find(
      (conversation) => conversation.id === selectedId
    ) ?? conversations[0];

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      <main className="mx-auto flex h-full w-full max-w-6xl border-x shadow-xs">
        <ChatSidebar
          conversations={conversations}
          selectedId={selectedConversation?.id ?? ""}
          onSelect={handleSelectConversation}
        />

        {isLoading ? (
          <section className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Loading messages...
          </section>
        ) : selectedConversation ? (
          <ChatWindow
            key={selectedConversation.id}
            conversation={selectedConversation}
            initialMessages={messages}
            currentProfileId={currentProfileId}
          />
        ) : null}
      </main>
    </div>
  );
}
