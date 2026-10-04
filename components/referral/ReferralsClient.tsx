"use client";

import { useState, useTransition } from "react";
import { createReferral } from "@/services/referral/create-referral";

interface Referral {
  id: string;
  jobTitle: string;
  jobUrl: string | null;
  resumeUrl: string | null;
  notes: string | null;
  status: string;
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

interface Candidate {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string | null;
  role: string;
}

interface Company {
  id: string;
  name: string;
}

export default function ReferralsClient({
  sent,
  received,
  candidates,
  companies,
}: {
  sent: Referral[];
  received: Referral[];
  candidates: Candidate[];
  companies: Company[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [referrerId, setReferrerId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function submitReferral() {
    setMessage("");

    startTransition(async () => {
      const result = await createReferral({
        referrerId,
        companyId: companyId || undefined,
        jobTitle,
        jobUrl: jobUrl || undefined,
        resumeUrl: resumeUrl || undefined,
        notes: notes || undefined,
      });

      if (result.success) {
        setMessage("Referral request sent successfully.");
        setShowForm(false);
        setReferrerId("");
        setCompanyId("");
        setJobTitle("");
        setJobUrl("");
        setResumeUrl("");
        setNotes("");
      } else {
        setMessage(result.error ?? "Unable to send referral request.");
      }
    });
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Referral Hub</h1>
            <p className="mt-2 text-zinc-400">
              Request referrals from people in your network.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowForm(true);
              setMessage("");
            }}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Request Referral
          </button>
        </div>

        {message && (
          <div className="mt-6 rounded-lg border p-4 text-sm text-zinc-300">
            {message}
          </div>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-semibold">My Requests</h2>

          {sent.length === 0 ? (
            <div className="mt-4 rounded-xl border p-6 text-zinc-400">
              You haven't requested any referrals yet.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {sent.map((referral) => (
                <ReferralCard
                  key={referral.id}
                  referral={referral}
                  label={`Requested from ${referral.referrer.fullName}`}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">
            Requests Received
          </h2>

          {received.length === 0 ? (
            <div className="mt-4 rounded-xl border p-6 text-zinc-400">
              You haven't received any referral requests.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {received.map((referral) => (
                <ReferralCard
                  key={referral.id}
                  referral={referral}
                  label={`Requested by ${referral.requester.fullName}`}
                />
              ))}
            </div>
          )}
        </section>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-lg rounded-xl border bg-background p-6 shadow-xl">
              <h2 className="text-xl font-semibold">
                Request a Referral
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-sm text-zinc-400">
                    Referrer
                  </label>
                  <select
                    value={referrerId}
                    onChange={(e) => setReferrerId(e.target.value)}
                    className="mt-1 w-full rounded-lg border bg-background p-3 text-sm"
                  >
                    <option value="">Select a person</option>
                    {candidates.map((candidate) => (
                      <option key={candidate.id} value={candidate.id}>
                        {candidate.fullName} (@{candidate.username})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-zinc-400">
                    Company
                  </label>
                  <select
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="mt-1 w-full rounded-lg border bg-background p-3 text-sm"
                  >
                    <option value="">Select a company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Job title"
                  className="w-full rounded-lg border bg-background p-3 text-sm"
                />

                <input
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="Job URL (optional)"
                  className="w-full rounded-lg border bg-background p-3 text-sm"
                />

                <input
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="Resume URL (optional)"
                  className="w-full rounded-lg border bg-background p-3 text-sm"
                />

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes (optional)"
                  rows={4}
                  className="w-full rounded-lg border bg-background p-3 text-sm"
                />
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isPending || !referrerId || !jobTitle.trim()}
                  onClick={submitReferral}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {isPending ? "Sending..." : "Send Request"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function ReferralCard({
  referral,
  label,
}: {
  referral: Referral;
  label: string;
}) {
  return (
    <div className="rounded-xl border p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">
            {referral.jobTitle}
          </h3>

          <p className="mt-1 text-sm text-zinc-400">
            {label}
          </p>

          {referral.company && (
            <p className="mt-2 text-sm text-zinc-300">
              {referral.company.name}
            </p>
          )}

          {referral.notes && (
            <p className="mt-3 text-sm text-zinc-400">
              {referral.notes}
            </p>
          )}
        </div>

        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs">
          {referral.status}
        </span>
      </div>
    </div>
  );
}
