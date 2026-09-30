"use client";

import { useTransition } from "react";
import { updateReferralStatus } from "@/services/referral/update-referral";

export function ReferralActions({ referralId }: { referralId: string }) {
  const [isPending, startTransition] = useTransition();
  const update = (status: "ACCEPTED" | "DECLINED") => startTransition(async () => { await updateReferralStatus(referralId, status); });
  return <div className="flex gap-2"><button disabled={isPending} onClick={() => update("ACCEPTED")} className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50">Accept</button><button disabled={isPending} onClick={() => update("DECLINED")} className="rounded-md border px-3 py-1.5 text-xs font-semibold disabled:opacity-50">Decline</button></div>;
}
