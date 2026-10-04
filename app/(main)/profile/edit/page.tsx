import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserProfile } from "@/services/profile/get-profile";
import { EditProfileForm } from "@/components/profile/EditProfileForm";

export default async function EditProfilePage() {
  const profile = await getCurrentUserProfile();

  if (!profile || !profile.isOnboarded) {
    redirect("/setup-profile");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link
          href="/profile"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to profile
        </Link>
      </div>

      <EditProfileForm
        initialData={{
          fullName: profile.fullName,
          headline: profile.headline,
          bio: profile.bio,
          avatarUrl: profile.avatarUrl,
        }}
      />
    </main>
  );
}
