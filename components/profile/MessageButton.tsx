"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { getOrCreateConversation } from "@/services/chat/create-conversation";

interface MessageButtonProps {
  targetUserId: string;
}

export function MessageButton({ targetUserId }: MessageButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleMessage() {
    startTransition(async () => {
      const result = await getOrCreateConversation(targetUserId);

      if (!result.success || !result.conversationId) {
        return;
      }

      router.push(`/messages?conversation=${result.conversationId}`);
    });
  }

  return (
    <button
      type="button"
      onClick={handleMessage}
      disabled={isPending}
      className="rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? "Opening..." : "Message"}
    </button>
  );
}
