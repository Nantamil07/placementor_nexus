"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProfile } from "@/services/auth/create-profile";
import { SetupProfileInput } from "@/lib/validators/profile";

export function UsernameForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    role: "STUDENT" as SetupProfileInput["role"],
    college: "",
    department: "",
    graduationYear: new Date().getFullYear() + 1,
    cgpa: "",
    bio: "",
  });

  useEffect(() => {
    if (username.trim().length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingUsername(true);
      try {
        const res = await fetch(`/api/profile/check-username?username=${encodeURIComponent(username.trim())}`);
        const data = await res.json();
        setUsernameAvailable(Boolean(data.available));
      } catch {
        setUsernameAvailable(null);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameAvailable === false) {
      setFormError("Please choose an available username.");
      return;
    }
    setFormError(null);

    startTransition(async () => {
      const result = await createProfile({
        username,
        ...formData,
      });

      if (!result.success) {
        setFormError(result.error ?? "Failed to save profile.");
        return;
      }

      router.push("/feed");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {formError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground">Username</label>
        <div className="relative mt-1">
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="e.g. dev_alex"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="mt-1 text-xs">
            {isCheckingUsername && <span className="text-muted-foreground">Checking availability...</span>}
            {!isCheckingUsername && usernameAvailable === true && (
              <span className="text-emerald-600 font-medium">✓ Username available</span>
            )}
            {!isCheckingUsername && usernameAvailable === false && (
              <span className="text-destructive font-medium">✕ Username already taken</span>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Full Name</label>
        <input
          type="text"
          required
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Primary Role</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as SetupProfileInput["role"] })}
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="STUDENT">Student</option>
          <option value="ALUMNI">Alumni</option>
          <option value="MENTOR">Mentor</option>
          <option value="RECRUITER">Recruiter</option>
          <option value="PLACEMENT_OFFICER">Placement Officer</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-foreground">College / University</label>
          <input
            type="text"
            required
            value={formData.college}
            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">Department / Major</label>
          <input
            type="text"
            required
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-foreground">Graduation Year</label>
          <input
            type="number"
            required
            min={1980}
            max={2035}
            value={formData.graduationYear}
            onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">CGPA / Grade (Optional)</label>
          <input
            type="text"
            value={formData.cgpa}
            onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
            placeholder="e.g. 8.75"
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Bio (Optional)</label>
        <textarea
          rows={3}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Brief intro about your interests and goals..."
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <button
        type="submit"
        disabled={isPending || usernameAvailable === false}
        className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {isPending ? "Completing Setup..." : "Complete Profile"}
      </button>
    </form>
  );
}
