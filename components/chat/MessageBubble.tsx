import { ChatMessage } from "@/services/chat/get-conversations";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formattedTime = new Date(message.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
          isOwn
            ? "bg-primary text-primary-foreground rounded-br-xs"
            : "bg-muted text-foreground rounded-bl-xs"
        }`}
      >
        <p className="whitespace-pre-line">{message.text}</p>
      </div>

      <div className="mt-1 flex items-center gap-1.5 px-1 text-[10px] text-muted-foreground">
        <span>{formattedTime}</span>
        {isOwn && (
          <span className={message.isSeen ? "text-primary font-bold" : ""}>
            {message.isSeen ? "✓✓ Seen" : "✓ Sent"}
          </span>
        )}
      </div>
    </div>
  );
}
