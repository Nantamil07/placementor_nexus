"use client";

import { useState, useTransition } from "react";
import { createReferral } from "@/services/referral/create-referral";

type Candidate = { id: string; fullName: string; username: string; avatarUrl: string | null; role: string };
type Company = { id: string; name: string };

export function ReferralRequestForm({ candidates, companies }: { candidates: Candidate[]; companies: Company[] }) {
  const [referrerId, setReferrerId] = useState(candidates[0]?.id ?? "");
  const [companyId, setCompanyId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    startTransition(async () => {
      const result = await createReferral({ referrerId, companyId: companyId || undefined, jobTitle, jobUrl, resumeUrl, notes });
      if (!result.success) return setMessage(result.error ?? "Failed to create request.");
      setJobTitle(""); setJobUrl(""); setResumeUrl(""); setNotes("");
      setMessage("Referral request sent successfully.");
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
      <div><h2 className="text-base font-semibold">Request a referral</h2><p className="mt-1 text-xs text-muted-foreground">Send a referral request to someone in your network.</p></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">Referrer<select value={referrerId} onChange={e => setReferrerId(e.target.value)} className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm" required><option value="">Select a person</option>{candidates.map(c => <option key={c.id} value={c.id}>{c.fullName} (@{c.username})</option>)}</select></label>
        <label className="text-sm font-medium">Company (optional)<select value={companyId} onChange={e => setCompanyId(e.target.value)} className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"><option value="">Select a company</option>{companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      </div>
      <label className="block text-sm font-medium">Job title<input value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm" placeholder="Software Engineer" required /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">Job URL<input value={jobUrl} onChange={e => setJobUrl(e.target.value)} type="url" className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm" placeholder="https://..." /></label>
        <label className="text-sm font-medium">Resume URL<input value={resumeUrl} onChange={e => setResumeUrl(e.target.value)} type="url" className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm" placeholder="https://..." /></label>
      </div>
      <label className="block text-sm font-medium">Message / notes<textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm" placeholder="Briefly explain why you are requesting the referral." /></label>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
      <button disabled={isPending || !referrerId} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">{isPending ? "Sending..." : "Send referral request"}</button>
    </form>
  );
}
