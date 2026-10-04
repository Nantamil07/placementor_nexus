"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateProfile,
  type UpdateProfileInput,
} from "@/services/profile/update-profile";

interface EditProfileFormProps {
  initialData: {
    fullName: string;
    headline: string | null;
    bio: string | null;
    avatarUrl: string | null;
  };
}

export function EditProfileForm({
  initialData,
}: EditProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState<UpdateProfileInput>({
    fullName: initialData.fullName,
    headline: initialData.headline ?? "",
    bio: initialData.bio ?? "",
    avatarUrl: initialData.avatarUrl ?? "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function updateField(
    field: keyof UpdateProfileInput,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await updateProfile(form);

      if (!result.success) {
        setError(result.error ?? "Unable to update profile.");
        return;
      }

      setMessage("Profile updated successfully.");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border bg-card p-6 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold">
          Edit Profile
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update the information displayed on your profile.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600">
          {message}
        </div>
      )}

      <div>
        <label className="text-sm font-medium">
          Full Name
        </label>

        <input
          required
          value={form.fullName}
          onChange={(e) =>
            updateField("fullName", e.target.value)
          }
          className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="text-sm font-medium">
          Headline
        </label>

        <input
          value={form.headline}
          maxLength={150}
          onChange={(e) =>
            updateField("headline", e.target.value)
          }
          placeholder="e.g. CSE Student | Full Stack Developer"
          className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />

        <p className="mt-1 text-xs text-muted-foreground">
          {form.headline.length}/150
        </p>
      </div>

      <div>
        <label className="text-sm font-medium">
          Bio
        </label>

        <textarea
          rows={5}
          maxLength={300}
          value={form.bio}
          onChange={(e) =>
            updateField("bio", e.target.value)
          }
          placeholder="Tell people about yourself, your interests and career goals..."
          className="mt-1 w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />

        <p className="mt-1 text-xs text-muted-foreground">
          {form.bio.length}/300
        </p>
      </div>

      <div>
        <label className="text-sm font-medium">
          Avatar URL
        </label>

        <input
          type="url"
          value={form.avatarUrl}
          onChange={(e) =>
            updateField("avatarUrl", e.target.value)
          }
          placeholder="https://example.com/avatar.jpg"
          className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />

        <p className="mt-1 text-xs text-muted-foreground">
          Enter a publicly accessible image URL.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
