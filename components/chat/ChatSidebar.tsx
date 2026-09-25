"use client";

import { Conversation } from "@/services/chat/get-conversations";

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ChatSidebar({
  conversations,
  selectedId,
  onSelect,
}: ChatSidebarProps) {
  return (
    <aside className="w-full border-r bg-card md:w-80 md:shrink-0">
      <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-base font-bold text-foreground">Messages</h2>
      </div>

      <div className="divide-y overflow-y-auto">
        {conversations.map((conv) => {
          const isSelected = conv.id === selectedId;

          return (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`flex w-full items-start gap-3 p-4 text-left transition-colors ${
                isSelected ? "bg-muted/70" : "hover:bg-muted/40"
              }`}
            >
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {conv.participant.fullName.charAt(0)}
                {conv.participant.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                )}
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate text-xs font-bold text-foreground">
                    {conv.participant.fullName}
                  </span>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {conv.lastMessageAt
                      ? new Date(conv.lastMessageAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  {conv.isTyping ? (
                    <span className="text-xs font-semibold text-primary animate-pulse">
                      typing...
                    </span>
                  ) : (
                    <p className="truncate text-xs text-muted-foreground">
                      {conv.lastMessage}
                    </p>
                  )}

                  {conv.unreadCount > 0 && (
                    <span className="flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
