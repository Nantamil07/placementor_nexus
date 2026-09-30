"use client";

import { useState, useTransition } from "react";
import { sendConnectionRequest } from "@/services/network/send-request";

type ConnectionStatus = "NONE" | "PENDING" | "ACCEPTED" | "REJECTED";

export function ConnectButton({ targetUserId, initialStatus = "NONE" }: { targetUserId: string; initialStatus?: ConnectionStatus }) {
  const [status, setStatus] = useState<ConnectionStatus>(initialStatus);
  const [isPending, startTransition] = useTransition();
  const handleConnect = () => {
    if (status !== "NONE") return;
    startTransition(async () => {
      const result = await sendConnectionRequest(targetUserId);
      if (result.success) setStatus(result.status);
    });
  };
  if (status === "ACCEPTED") return <button disabled className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600">✓ Connected</button>;
  if (status === "PENDING") return <button disabled className="rounded-full border border-border bg-muted/60 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground">Pending...</button>;
  return <button onClick={handleConnect} disabled={isPending} className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:bg-primary/90 disabled:opacity-50">{isPending ? "Sending..." : "Connect"}</button>;
}
