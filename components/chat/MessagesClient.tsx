"use client";

import { useState } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import type { Conversation } from "@/services/chat/get-conversations";

interface MessagesClientProps {
  conversations: Conversation[];
  initialMessages: any[];
}

export function MessagesClient({
  conversations,
  initialMessages,
}: MessagesClientProps) {
  const [selectedId, setSelectedId] = useState(conversations[0].id);

  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedId) ??
    conversations[0];

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      <main className="mx-auto flex h-full w-full max-w-6xl border-x shadow-xs">
        <ChatSidebar
          conversations={conversations}
          selectedId={selectedConversation.id}
          onSelect={setSelectedId}
        />

        <ChatWindow
          conversation={selectedConversation}
          initialMessages={initialMessages}
        />
      </main>
    </div>
  );
}
