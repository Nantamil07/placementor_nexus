"use client";

import { useState, useTransition } from "react";
import { Conversation, ChatMessage } from "@/services/chat/get-conversations";
import { sendMessage } from "@/services/chat/send-message";
import { MessageBubble } from "./MessageBubble";

interface ChatWindowProps {
  conversation: Conversation;
  initialMessages: ChatMessage[];
}

export function ChatWindow({ conversation, initialMessages }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const optimisticMsg: ChatMessage = {
      id: `temp_${Date.now()}`,
      conversationId: conversation.id,
      senderId: "current_user",
      text: input.trim(),
      createdAt: new Date().toISOString(),
      isSeen: false,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    const textToSend = input.trim();
    setInput("");

    startTransition(async () => {
      const res = await sendMessage(conversation.id, textToSend);
      if (res.success && res.message) {
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMsg.id ? res.message! : m))
        );
      }
    });
  };

  return (
    <section className="flex flex-1 flex-col bg-background">
      <header className="flex h-14 items-center justify-between border-b px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {conversation.participant.fullName.charAt(0)}
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground sm:text-sm">
              {conversation.participant.fullName}
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="capitalize">{conversation.participant.role.replace("_", " ")}</span>
              <span>•</span>
              <span className={conversation.participant.isOnline ? "text-emerald-600 font-semibold" : ""}>
                {conversation.participant.isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === "current_user"}
          />
        ))}

        {conversation.isTyping && (
          <div className="text-[11px] text-muted-foreground animate-pulse italic">
            {conversation.participant.fullName} is typing...
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 border-t p-3 sm:p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${conversation.participant.fullName}...`}
          className="flex-1 rounded-full border bg-muted/30 px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={isPending || !input.trim()}
          className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:bg-primary/90 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </section>
  );
}
