import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/services/profile/get-profile";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileLinks } from "@/components/profile/ProfileLinks";
import { ProfileAbout } from "@/components/profile/ProfileAbout";

export default async function ProfilePage() {
  const profile = await getCurrentUserProfile();

  if (!profile || !profile.isOnboarded) {
    redirect("/setup-profile");
  }

  const primaryEdu = profile.education[0];
  const graduationYear = primaryEdu?.endDate
    ? new Date(primaryEdu.endDate).getFullYear()
    : null;

  return (
    <div className="min-h-screen bg-muted/20 pb-16">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <ProfileHeader
          fullName={profile.fullName}
          username={profile.username}
          role={profile.role}
          headline={profile.headline}
          avatarUrl={profile.avatarUrl}
        />

        <ProfileStats
          projectsCount={profile.projects.length}
          skillsCount={profile.skills.length}
          cgpa={primaryEdu?.grade}
          graduationYear={graduationYear}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ProfileLinks username={profile.username} />
          </div>

          <div className="lg:col-span-2">
            <ProfileAbout
              bio={profile.bio}
              education={profile.education}
              skills={profile.skills}
              projects={profile.projects}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
