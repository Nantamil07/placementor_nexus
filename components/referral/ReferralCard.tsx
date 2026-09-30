"use client";

import { ReferralActions } from "./ReferralActions";
import type { ReferralStatus } from "@prisma/client";

export interface ReferralCardData {
  id: string;
  jobTitle: string;
  jobUrl: string | null;
  resumeUrl: string | null;
  notes: string | null;
status: ReferralStatus;
  createdAt: string;
  requester: {
    id: string;
    fullName: string;
    username: string;
    avatarUrl: string | null;
  };
  referrer: {
    id: string;
    fullName: string;
    username: string;
    avatarUrl: string | null;
  };
  company: {
    id: string;
    name: string;
  } | null;
}

interface ReferralCardProps {
  referral: ReferralCardData;
  mode: "sent" | "received";
}

export function ReferralCard({
  referral,
  mode,
}: ReferralCardProps) {
  const person = mode === "received"
    ? referral.requester
    : referral.referrer;

  const formattedDate = new Date(
    referral.createdAt
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {person.avatarUrl ? (
              <img
                src={person.avatarUrl}
                alt={person.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              person.fullName.charAt(0).toUpperCase()
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {person.fullName}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              @{person.username}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            referral.status === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : referral.status === "ACCEPTED"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {referral.status}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="text-base font-semibold text-foreground">
          {referral.jobTitle}
        </h3>

        {referral.company && (
          <p className="mt-1 text-sm text-muted-foreground">
            {referral.company.name}
          </p>
        )}

        {referral.notes && (
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {referral.notes}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        {referral.jobUrl && (
          <a
            href={referral.jobUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Job posting
          </a>
        )}

        {referral.resumeUrl && mode === "received" && (
          <a
            href={referral.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Resume
          </a>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t pt-3">
        <time
          dateTime={referral.createdAt}
          className="text-xs text-muted-foreground"
        >
          {formattedDate}
        </time>

        {mode === "received" && referral.status === "PENDING" && (
          <ReferralActions referralId={referral.id} />
        )}
      </div>
    </article>
  );
}
